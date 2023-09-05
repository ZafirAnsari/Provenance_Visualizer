/*
Copyright 2017 Benjamin RICAUD

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


var node_history = {};
var node_position_list = [];
//unique id for edge
var edge_id = 0;
//var node_position_history=[]
var merge_node_history = []
var merge_node_dict = {}
var node_position_history_forward = []
var node_position_history_backward = []

var graphio = (function () {

  function search_query() {
    // Query sent to the server when clicking the search button
    //
    // Preprocess query
    let input_field = $('#search_field').val();
    // $('#outputArea').html('ZEEK-AGENT Visualizer');
    // $('#messageArea').html('ZEEK-AGENT Visualizer');
    let input_id = $('#search_value').val();
    let label_field = $('#label_field').val();
    if (input_field == "ID") {
      // form a query to find the id from elasticsearch database
      var data = {
        "query": {
          "bool": {
            "must": [
              {
                "match": {

                  "_id": input_id

                }
                // if you want to add another field in the query, you can do so by uncommenting and adding relevant field
                // },
                // {
                //   "match": {
                //     //"id.resp_p":port_num



                //   }
              }
            ]
          }
        }
        ,
        "size": node_limit_per_request
      }
      if (label_field == 'none' || label_field == 'process') {//fetch the node matching the id if it exists in process index
        $.ajax({

          url: es_process_index_url,
          type: 'POST',

          contentType: "application/json;charset=UTF-8",
          dataType: 'json',
          data: JSON.stringify(data),
          processData: false,
          async: false,
          success: function (response) {
            var data = response.hits.hits;
            //console.log("data",data)
            if (data.length != 0) {
              var data_list = data_manipulation(data, search_fx, "process")
              var test_dic = { 'nodes': data_list, 'links': [] }
              //console.log("graphnew",test_dic)
              graph_viz.refresh_data(test_dic, 1, null)
              node_position_list.push(search_fx)
              search_fx = search_fx + 25
            }

          }
        })
      }
      if (label_field == 'none' || label_field == 'file') {//fetch the node matching the id if it exists in process file
        $.ajax({

          url: es_file_index_url,
          type: 'POST',

          contentType: "application/json;charset=UTF-8",
          dataType: 'json',
          data: JSON.stringify(data),
          processData: false,
          async: false,
          success: function (response) {
            var data = response.hits.hits;

            if (data.length != 0) {
              var data_list = data_manipulation(data, search_fx, "file")
              var test_dic = { 'nodes': data_list, 'links': [] }
              //console.log("graphnew",test_dic)
              graph_viz.refresh_data(test_dic, 1, null)
              node_position_list.push(search_fx)
              search_fx = search_fx + 25
            }


          }
        })

      }
      if (label_field == 'none' || label_field == 'socket') {//fetch the node matching the id if it exists in process socket
        $.ajax({

          url: es_socket_index_url,
          type: 'POST',

          contentType: "application/json;charset=UTF-8",
          dataType: 'json',
          data: JSON.stringify(data),
          processData: false,
          async: false,
          success: function (response) {
            var data = response.hits.hits;
            //console.log("data",data)
            if (data.length != 0) {
              var data_list = data_manipulation(data, search_fx, "socket")
              var test_dic = { 'nodes': data_list, 'links': [] }
              //console.log("graphnew",test_dic)
              graph_viz.refresh_data(test_dic, 1, null)
              node_position_list.push(search_fx)
              search_fx = search_fx + 25
            }


          }
        })
      }
      if (label_field == 'none' || label_field == 'zeek') { //fetch the node matching the id if it exists in process zeek
        $.ajax({

          url: es_zeek_index_url,
          type: 'POST',
          contentType: "application/json;charset=UTF-8",
          dataType: 'json',
          data: JSON.stringify(data),
          processData: false,
          async: false,
          success: function (response) {
            var data = response.hits.hits;
            //console.log("data",data)
            if (data.length != 0) {
              var data_list = data_manipulation(data, search_fx, "conn")
              var test_dic = { 'nodes': data_list, 'links': [] }
              //console.log("graphnew",test_dic)
              graph_viz.refresh_data(test_dic, 1, null)
              node_position_list.push(search_fx)
              search_fx = search_fx + 25
            }
          }
        })
      }

    }

    if (input_field == "PID" && (label_field == 'none' || label_field == 'process')) {//fetch process node with a certain pid

      input_id = parseInt(input_id)
      let data = {
        "query": {
          "bool": {
            "must": [
              {
                "match": {

                  "pid": input_id

                }

              }
            ]
          }
        }
        ,
        "size": node_limit_per_request
      }

      $.ajax({

        url: es_process_index_url,
        type: 'POST',

        contentType: "application/json;charset=UTF-8",
        dataType: 'json',
        data: JSON.stringify(data),
        processData: false,
        async: false,
        success: function (response) {
          var data = response.hits.hits;

          if (data.length != 0) {
            var data_list = data_manipulation(data, search_fx, "process")
            var test_dic = { 'nodes': data_list, 'links': [] }
            //console.log("graphnew",test_dic)
            graph_viz.refresh_data(test_dic, 1, null)
            node_position_list.push(search_fx)
            search_fx = search_fx + 25
          }
        }
      })
    }





    if (input_field == "FILE NAME" && (label_field == 'none' || label_field == 'file')) {//fetch file node with a certain file name
      let data = {
        "query": {
          "bool": {
            "must": [
              {
                "match": {

                  "path": input_id
                }

              }
            ]
          }
          // "wildcard" : {
          //     "path.keyword" : input_id
          //     }
          
        }
        ,
        "size": node_limit_per_request
      }

      $.ajax({

        url: es_file_index_url,
        type: 'POST',

        contentType: "application/json;charset=UTF-8",
        dataType: 'json',
        data: JSON.stringify(data),
        processData: false,
        async: false,
        success: function (response) {
          var data = response.hits.hits;
          //console.log(data)
          if (data.length != 0) {
            var data_list = data_manipulation(data, search_fx, "file",input_id,"search")
            var test_dic = { 'nodes': data_list, 'links': [] }
            //console.log("graphnew",test_dic)
            graph_viz.refresh_data(test_dic, 1, null)
            node_position_list.push(search_fx)
            search_fx = search_fx + 25
          }
        }
      })
    }



    if (input_id == "" && label_field != "none")// search and fetch all nodes belonging to a certain label
    {
      var label_url = ""
      var label_node = ""
      if (label_field == "process") {
        label_url = es_process_index_url
        label_node = "process"
      }
      if (label_field == "file") {
        label_url = es_file_index_url
        label_node = "file"
      }
      if (label_field == "socket") {
        label_url = es_socket_index_url
        label_node = "socket"
      }
      if (label_field == "zeek") {
        label_url = es_zeek_index_url
        label_node = "conn"
      }

      let data = {
        "query": {
          "match_all": {}
        }
        ,
        "size": node_limit_per_request
      }


      $.ajax({

        url: label_url,
        type: 'POST',

        contentType: "application/json;charset=UTF-8",
        dataType: 'json',
        data: JSON.stringify(data),
        processData: false,
        async: false,
        success: function (response) {
          var data = response.hits.hits;

          if (data.length != 0) {
            var data_list = data_manipulation(data, search_fx, label_node)
            var test_dic = { 'nodes': data_list, 'links': [] }
            //console.log(data_list.length)
            graph_viz.refresh_data(test_dic, 1, null)
            node_position_list.push(search_fx)
            search_fx = search_fx + 25
          }


        }
      })
    }
  }

  ///////////////////////////////////////////////////////data manipulation of nodes, specified structure for front end////////////////////////////////////////////////
  function data_manipulation(data, val, type,filename,search_or_click_for_file) {

    var data_list = []
    //console.log(filename)
    for (var key in data) {
      var data_dict = data[key];
      data_dict["id"] = data_dict['_id']
      data_dict["properties"] = data_dict["_source"]
      data_dict['type'] = 'vertex'
      delete data_dict['_index']
      delete data_dict['_type']
      delete data_dict['_source']
      delete data_dict['_score']
      delete data_dict['_id']

      if (type == "process") {

        data_dict["properties"]['name'] = data_dict["properties"]['exe']
        data_dict['label'] = "PROCESS"
      }
      if (type == "file") {
        data_dict["properties"]['name'] = data_dict["properties"]['path']
        data_dict['label'] = "FILE"
        var exe_path=data_dict["properties"]['name']
        //remove sys files
        sys_file_found =false
        for (var sys_file of system_files)
        {
          if (exe_path.includes(sys_file))
          {
            sys_file_found = true
          }
        }
        if (sys_file_found)
        {
          continue
        }
        if ( search_or_click_for_file=='search' && filename[filename.length-1] != "*" )
        {
        if (exe_path.includes("/"))
        {
          var path_token=exe_path.split("/")
          var file_name=path_token[path_token.length-1]
          if(file_name!=filename && search_or_click_for_file=='search')
          {
            continue
          }
        }
        else
        {
          //console.log('absent')
          if (exe_path!=filename && search_or_click_for_file=='search')
          {
            continue
          }
        }
      }
      }
      if (type == "socket") {
        if (data_dict["properties"]['syscall']=='connect')
        {
          data_dict["properties"]['name'] = String(data_dict["properties"]['remote_address']) + ":" + String(data_dict["properties"]['remote_port'])
        }
        if (data_dict["properties"]['syscall']=='bind')
        {
          data_dict["properties"]['name'] = String(data_dict["properties"]['local_address']) + ":" + String(data_dict["properties"]['local_port'])
        }
        //data_dict["properties"]['name'] = data_dict["properties"]['exe']
        data_dict['label'] = "SOCKET"
      }
      if (type == "conn") {
        data_dict["properties"]['name'] = "zeek"
        data_dict['label'] = "ZEEK"
      }
      if (type == "dns") {
        data_dict["properties"]['name'] = "dns" + "," + String(data_dict["properties"]['query'])
        data_dict['label'] = "NETWORK"
      }
      if (type == "dhcp") {
        data_dict["properties"]['name'] = "dhcp"
        data_dict['label'] = "NETWORK"
      }
      if (type == "http") {
        data_dict["properties"]['name'] = "http" + "," + String(data_dict["properties"]['method']) + "," + String(data_dict["properties"]['uri'])
        data_dict['label'] = "NETWORK"
      }
      if (type == "ssl") {
        data_dict["properties"]['name'] = "ssl"
        data_dict['label'] = "NETWORK"
      }
      if (type == "file.log") {
        data_dict["properties"]['name'] = "file.log"
        data_dict['label'] = "NETWORK"
      }


      //var ts = data_dict['properties']['ts']
      //var host_ts = data_dict['properties']['host_ts']
      var dict_for_hash = JSON.parse(JSON.stringify(data_dict['properties']));
      if (data_dict['label'] != "ZEEK" && data_dict['label'] != "NETWORK") {
        delete dict_for_hash['host_ts']
      }
      var merge_socket = document.getElementById("merge_socket");

      var isChecked_merge_socket = merge_socket.checked;
      if (isChecked_merge_socket){
      if (data_dict['label'] == "SOCKET")
      {
        delete dict_for_hash['seuid']//merging of similar sockets
      }
    }

      delete dict_for_hash['ts']

      var hash = MD5(JSON.stringify(dict_for_hash))//merging of similar nodes
      
      //console.log(hash)
      if (merge_node_history.includes(hash)) {

        if (!data_list.includes(merge_node_dict[hash])) {
          data_list.push(merge_node_dict[hash])
        }

        //var x = 2
      }
      else {
        merge_node_history.push(hash)


        for (var key2 in data_dict['properties']) {

          data_dict['properties'][key2] = [{ 'id': 1, 'value': data_dict['properties'][key2], "label": key2 }]

        }
        data_dict['fx'] = val;
        data_list.push(data_dict)
        merge_node_dict[hash] = data_dict
      }
    }
    let limit_field = $('#limit_field').val();
    if (limit_field == "") {
      limit_field = node_visible_per_request_limit;
    }
    else if (limit_field < 0 || limit_field > node_visible_per_request_limit) {
      limit_field = node_visible_per_request_limit;
    }
    // removed_list=data_list.splice(limit_field)
    // console.log(removed_list)
    data_list = data_list.splice(0, limit_field)


    return data_list;

  }
  /////////edge manipulation to form correct structure for frontend

  function edge_manipulation_process_process(data, curr_node, inorout, from, to) {
    var edge_list = []
    for (var key of data) {
      var curr_edge_dict = {}

      //var curr_data = data[key] in
      var curr_data = key

      curr_edge_dict.id = edge_id
      edge_id = edge_id + 1
      if (from == "process" && to == "process" && inorout == "outbound") {
        curr_edge_dict.label = curr_data.properties.syscall[0].value

      }
      if (from == "process" && to == "process" && inorout == "inbound") {
        curr_edge_dict.label = curr_node.properties.syscall[0].value

      }
      if (from == "process" && to == "file") {

        curr_edge_dict.label = curr_data.properties.syscall[0].value
      }
      if (from == "process" && to == "socket") {

        curr_edge_dict.label = curr_data.properties.syscall[0].value
      }
      if (from == "socket" && to == "conn") {

        curr_edge_dict.label = 'correlation'
      }
      if (from == "conn" && to == "socket") {

        curr_edge_dict.label = 'correlation'
      }
      if (from == "conn" && to == "dns") {

        curr_edge_dict.label = 'network'
      }
      if (from == "conn" && to == "dhcp") {

        curr_edge_dict.label = 'network'
      }
      if (from == "conn" && to == "http") {

        curr_edge_dict.label = 'network'
      }
      if (from == "conn" && to == "ssl") {

        curr_edge_dict.label = 'network'
      }
      if (from == "http" && to == "orig_file.log") {

        curr_edge_dict.label = 'orig_network_file'
      }
      if (from == "http" && to == "resp_file.log") {

        curr_edge_dict.label = 'resp_network_file'
      }
      if (from == "file" && to == "process") {
        curr_edge_dict.label = curr_node.properties.syscall[0].value
      }
      if (from == "socket" && to == "process") {
        curr_edge_dict.label = curr_node.properties.syscall[0].value
      }


      curr_edge_dict.type = 'edge'
      curr_edge_dict.properies = { 'working': ['yes'] }

      if (inorout == "inbound") {
        curr_edge_dict.source = curr_data
        curr_edge_dict.target = curr_node

      }
      else {
        curr_edge_dict.source = curr_node
        curr_edge_dict.target = curr_data
      }
      edge_list.push(curr_edge_dict)
    }
    return edge_list
  }




  ////////////////////finding right node position////////////
  function find_node_position(position, direction, id) {


    if (node_position_history_forward.includes(id) && direction == 'forward') {
      //console.log("2")
      return position;
    }
    if (node_position_history_backward.includes(id) && direction == 'backward') {
      //console.log("3")
      return position;
    }

    if (direction == "forward") {
      var found_free = true;
      while (true) {
        if (node_position_list.includes(position)) {
          found_free = false;
        }
        if (found_free) {
          return position;
        }
        else {
          position = position + next_free_position;
          found_free = true;
        }
      }
    }
    if (direction == "backward") {
      let found_free = true;
      while (true) {
        if (node_position_list.includes(position)) {
          found_free = false;
        }
        if (found_free) {
          return position;
        }
        else {
          position = position - next_free_position;
          found_free = true;
        }
      }
    }
  }


  function click_query(d) {


    var combined_nodes = []
    var combined_edges = []
    var input_forward = document.getElementById("forward_tracking");
    var isChecked_forward = input_forward.checked;
    var input_backward = document.getElementById("backward_tracking");
    var isChecked_backward = input_backward.checked;
    


    if (d.label == "PROCESS") {
      if (isChecked_backward || isChecked_forward) {
        

        if (isChecked_backward) {
          var ppid_process = d.properties.ppid[0].value
          var host = d.properties.host[0].value

          var node_pos = d.fx - dist_x
          node_pos = find_node_position(node_pos, "backward", d.id)
          //find parent process

          var data = {
            "query": {
              "bool": {
                "must": [
                  {
                    "match": {
                      //"proto": "tcp"
                      //"_id":input_id
                      "pid": ppid_process
                    }
                    },
                {
                  "match": {
                    "host":host
                  }
                  }
                ]
              }
            }
            ,
            "size": node_limit_per_request
          }

          $.ajax({

            url: es_process_index_url,
            type: 'POST',

            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async: false,
            success: function (response) {
              var data = response.hits.hits;

              if (data.length != 0) {
                var process_node = data_manipulation(data, node_pos, "process")

                combined_nodes = combined_nodes.concat(process_node)

                var edges = edge_manipulation_process_process(process_node, d, "inbound", "process", "process")
                combined_edges = combined_edges.concat(edges)
              }


            }
          })

          node_position_list.push(node_pos)
          node_position_history_backward.push(d.id)
        }

        //////find  child pid process
        if (isChecked_forward) {
          var pid_process = d.properties.pid[0].value
          let host = d.properties.host[0].value
          let node_pos = d.fx + dist_x

          node_pos = find_node_position(node_pos, "forward", d.id)


          let data = {
            "query": {
              "bool": {
                "must": [
                  {
                    "match": {

                      "ppid": pid_process
                    }
                     },
                {
                  "match": {
                    "host":host
                  }

                  }
                ]
              }
            },
            "size": node_limit_per_request
          }

          $.ajax({

            url: es_process_index_url,
            type: 'POST',

            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async: false,
            success: function (response) {
              var data = response.hits.hits;
              //console.log("data",data)
              if (data.length != 0) {
                var process_node = data_manipulation(data, node_pos, "process")

                combined_nodes = combined_nodes.concat(process_node)

                var edges = edge_manipulation_process_process(process_node, d, "outbound", "process", "process")
                combined_edges = combined_edges.concat(edges)
              }


            }
          })

          //////find files related to the process
          //var pid_process = d.properties.pid[0].value
          data = {
            "query": {
              "bool": {
                "must": [
                  {
                    "match": {
                      //"proto": "tcp"
                      //"_id":input_id
                      "pid": pid_process
                    }
                    },
                {
                  "match": {
                    "host":host
                  }
                  }
                ]
              }
            }
            ,
            "size": node_limit_per_request
          }

          $.ajax({

            url: es_file_index_url,
            type: 'POST',

            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async: false,
            success: function (response) {
              var data = response.hits.hits;
              //console.log("data",data)
              if (data.length != 0) {
                var file_node = data_manipulation(data, node_pos, "file")
                //console.log("pid data",pid_process)
                combined_nodes = combined_nodes.concat(file_node)
                //console.log("combined_nodes",combined_nodes)
                var edges = edge_manipulation_process_process(file_node, d, "outbound", "process", "file")
                combined_edges = combined_edges.concat(edges)
              }


            }
          })

          //////find sockets related to the process
          //pid_process = d.properties.pid[0].value
          var uid =d.properties.uid[0].value



          data = {
            "query": {
              "bool": {
                "must": [
                  {
                    "match": {

                      "pid": pid_process
                    }
                    },
                {
                  "match": {
                    "host":host
                  }
                  },
                {
                  "match": {
                    "uid":uid
                  }
                  }
                ]
              }
            }
            ,
            "size": node_limit_per_request
          }

          $.ajax({

            url: es_socket_index_url,
            type: 'POST',

            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async: false,
            success: function (response) {
              var data = response.hits.hits;

              if (data.length != 0) {
                var socket_node = data_manipulation(data, node_pos, "socket")

                combined_nodes = combined_nodes.concat(socket_node)

                var edges = edge_manipulation_process_process(socket_node, d, "outbound", "process", "socket")
                combined_edges = combined_edges.concat(edges)
              }


            }
          })



          node_position_list.push(node_pos)
          node_position_history_forward.push(d.id)
        }
        // node_position_history.push(d.id)

        combined_nodes.push(d)

        var test_dic = { 'nodes': combined_nodes, 'links': combined_edges }

        graph_viz.refresh_data(test_dic, 1, d.id)

      }
    }


    //////////////////////////////handle socket node//////////////////////



    if (d.label == "SOCKET") {

      if (isChecked_backward || isChecked_forward) {
        if (isChecked_forward) {
          var seuid = d.properties.seuid[0].value

          let node_pos = d.fx + dist_x
          node_pos = find_node_position(node_pos, "forward", d.id)


          //////find zeek nodes attributed with the socket based on orig_seuid

          let data = {
            "query": {
              "match": {
                "orig_seuids": seuid
              }
            },
            "size": node_limit_per_request
          }

          $.ajax({

            url: es_zeek_index_url,
            type: 'POST',

            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async: false,
            success: function (response) {
              var data = response.hits.hits;

              if (data.length != 0) {
                var zeek_node = data_manipulation(data, node_pos, "conn")

                combined_nodes = combined_nodes.concat(zeek_node)

                var edges = edge_manipulation_process_process(zeek_node, d, "outbound", "socket", "conn")
                combined_edges = combined_edges.concat(edges)
              }


            }
          })

          //////find zeek nodes attributed with the socket based on resp_seuid


          data = {
            "query": {
              "match": {
                "resp_seuids": seuid
              }
            },
            "size": node_limit_per_request
          }


          $.ajax({

            url: es_zeek_index_url,
            type: 'POST',

            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async: false,
            success: function (response) {
              var data = response.hits.hits;

              if (data.length != 0) {
                var zeek_node = data_manipulation(data, node_pos, "conn")

                combined_nodes = combined_nodes.concat(zeek_node)

                var edges = edge_manipulation_process_process(zeek_node, d, "outbound", "socket", "conn")
                combined_edges = combined_edges.concat(edges)
              }


            }
          })


          node_position_list.push(node_pos)
          node_position_history_forward.push(d.id)

        }
        ///////find parent process related to the socket

        if (isChecked_backward) {
          var pid = d.properties.pid[0].value
          let host = d.properties.host[0].value
          let uid = d.properties.uid[0].value
          //console.log("ppid_process",ppid_process)
          let node_pos = d.fx - dist_x
          node_pos = find_node_position(node_pos, "backward", d.id)


          let data = {
            "query": {
              "bool": {
                "must": [
                  {
                    "match": {

                      "pid": pid
                    }
                    },
                {
                  "match": {
                    "host":host
                  }
                  },
                {
                  "match": {
                    "uid":uid
                  }
                  }
                ]
              }
            }
            ,
            "size": node_limit_per_request
          }

          $.ajax({

            url: es_process_index_url,
            type: 'POST',

            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async: false,
            success: function (response) {
              var data = response.hits.hits;

              if (data.length != 0) {
                var process_node = data_manipulation(data, node_pos, "process")

                combined_nodes = combined_nodes.concat(process_node)

                var edges = edge_manipulation_process_process(process_node, d, "inbound", "socket", "process")
                combined_edges = combined_edges.concat(edges)
              }


            }
          })


          node_position_list.push(node_pos)
          node_position_history_backward.push(d.id)
        }

        combined_nodes.push(d)

        let test_dic = { 'nodes': combined_nodes, 'links': combined_edges }

        graph_viz.refresh_data(test_dic, 1, d.id)

      }

    }



    if (d.label == "FILE") {

      if (isChecked_backward) {
        ///////////////find process related to the file
        let pid = d.properties.pid[0].value
        let host = d.properties.host[0].value

        let node_pos = d.fx - dist_x
        node_pos = find_node_position(node_pos, "backward", d.id)


        let data = {
          "query": {
            "bool": {
              "must": [
                {
                  "match": {

                    "pid": pid
                  }
                  },
                {
                  "match": {
                    "host":host
                  }
                }
              ]
            }
          }
          ,
          "size": node_limit_per_request
        }

        $.ajax({

          url: es_process_index_url,
          type: 'POST',

          contentType: "application/json;charset=UTF-8",
          dataType: 'json',
          data: JSON.stringify(data),
          processData: false,
          async: false,
          success: function (response) {
            var data = response.hits.hits;

            if (data.length != 0) {
              var process_node = data_manipulation(data, node_pos, "process")

              combined_nodes = combined_nodes.concat(process_node)

              var edges = edge_manipulation_process_process(process_node, d, "inbound", "file", "process")
              combined_edges = combined_edges.concat(edges)
            }


          }
        })


        node_position_list.push(node_pos)
        node_position_history_backward.push(d.id)

        combined_nodes.push(d)

        let test_dic = { 'nodes': combined_nodes, 'links': combined_edges }

        graph_viz.refresh_data(test_dic, 1, d.id)
      }
    }


    if (d.label == "ZEEK") {
      if (isChecked_backward || isChecked_forward) {
        if (isChecked_backward) {
          let node_pos = d.fx - dist_x
          node_pos = find_node_position(node_pos, "backward", d.id)

          ///////////////find socket attributed to zeek based on orig_seuid
          //var uid = d.properties.uid[0].value
          try {
            var orig_seuid = d.properties.orig_seuids[0].value

            for (var key in orig_seuid) {

              let data = {
                "query": {
                  "bool": {
                    "must": [
                      {
                        "match": {

                          "seuid": orig_seuid[key]
                        }
                      }
                    ]
                  }
                }
                ,
                "size": node_limit_per_request
              }

              $.ajax({

                url: es_socket_index_url,
                type: 'POST',

                contentType: "application/json;charset=UTF-8",
                dataType: 'json',
                data: JSON.stringify(data),
                processData: false,
                async: false,
                success: function (response) {
                  var data = response.hits.hits;

                  if (data.length != 0) {
                    var socket_node = data_manipulation(data, node_pos, "socket")

                    combined_nodes = combined_nodes.concat(socket_node)

                    var edges = edge_manipulation_process_process(socket_node, d, "inbound", "conn", "socket")
                    combined_edges = combined_edges.concat(edges)
                  }
                }
              })
            }
          }
          catch (err) {
            // console.log("resp",err) 
          }


          try {
            var resp_seuid = d.properties.resp_seuids[0].value
            ///////////////find socket attributed to zeek based on resp_seuid
            for (let key in orig_seuid) {

              let data = {
                "query": {
                  "bool": {
                    "must": [
                      {
                        "match": {

                          "seuid": resp_seuid[key]
                        }
                      }
                    ]
                  }
                }
                ,
                "size": node_limit_per_request
              }

              $.ajax({

                url: es_socket_index_url,
                type: 'POST',

                contentType: "application/json;charset=UTF-8",
                dataType: 'json',
                data: JSON.stringify(data),
                processData: false,
                async: false,
                success: function (response) {
                  var data = response.hits.hits;

                  if (data.length != 0) {
                    var socket_node = data_manipulation(data, node_pos, "socket")

                    combined_nodes = combined_nodes.concat(socket_node)

                    var edges = edge_manipulation_process_process(socket_node, d, "inbound", "conn", "socket")
                    combined_edges = combined_edges.concat(edges)
                  }


                }
              })





            }
          }
          catch (err) {
            // console.log("resp",err)
          }

          node_position_list.push(node_pos)
          node_position_history_backward.push(d.id)
        }

        // find network nodes related to the zeek log,both dns and dhcp, any new network logs may be added here
        if (isChecked_forward) {
          let uid = d.properties.uid[0].value
          let node_pos = d.fx + dist_x
          node_pos = find_node_position(node_pos, "forward", d.id)


          let data = {
            "query": {
              "bool": {
                "must": [
                  {
                    "match": {

                      "uid": uid
                    }
                  }
                ]
              }
            }
            ,
            "size": node_limit_per_request
          }

          $.ajax({

            url: es_dns_index_url,
            type: 'POST',

            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async: false,
            success: function (response) {
              var data = response.hits.hits;

              if (data.length != 0) {
                var network_node = data_manipulation(data, node_pos, "dns")

                combined_nodes = combined_nodes.concat(network_node)

                var edges = edge_manipulation_process_process(network_node, d, "outbound", "conn", "dns")
                combined_edges = combined_edges.concat(edges)
              }


            }
          })
          $.ajax({

            url: es_http_index_url,
            type: 'POST',

            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async: false,
            success: function (response) {
              var data = response.hits.hits;

              if (data.length != 0) {
                var network_node = data_manipulation(data, node_pos, "http")

                combined_nodes = combined_nodes.concat(network_node)

                var edges = edge_manipulation_process_process(network_node, d, "outbound", "conn", "http")
                combined_edges = combined_edges.concat(edges)
              }


            }
          })
          $.ajax({

            url: es_ssl_index_url,
            type: 'POST',

            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async: false,
            success: function (response) {
              var data = response.hits.hits;

              if (data.length != 0) {
                var network_node = data_manipulation(data, node_pos, "ssl")

                combined_nodes = combined_nodes.concat(network_node)

                var edges = edge_manipulation_process_process(network_node, d, "outbound", "conn", "ssl")
                combined_edges = combined_edges.concat(edges)
              }


            }
          })



          data = {
            "query": {
              "match": {
                "uids": uid
              }
            },
            "size": node_limit_per_request
          }

          $.ajax({

            url: es_dhcp_index_url,
            type: 'POST',

            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async: false,
            success: function (response) {
              var data = response.hits.hits;

              if (data.length != 0) {
                var network_node = data_manipulation(data, node_pos, "dhcp")

                combined_nodes = combined_nodes.concat(network_node)

                var edges = edge_manipulation_process_process(network_node, d, "outbound", "conn", "dhcp")
                combined_edges = combined_edges.concat(edges)
              }


            }
          })


          node_position_list.push(node_pos)
          node_position_history_forward.push(d.id)
        }

        combined_nodes.push(d)
        //console.log("combined_edges",combined_edges)
        let test_dic = { 'nodes': combined_nodes, 'links': combined_edges }
        //console.log("graphnew",test_dic)
        graph_viz.refresh_data(test_dic, 1, d.id)
      }

    }



    if (d.label == "NETWORK")
    {
      //if (d.name == 'http')
      if(d.properties.name[0].value.includes('http') )
      {
        if (isChecked_forward) {
          let node_pos = d.fx + dist_x
          node_pos = find_node_position(node_pos, "forward", d.id)

          ///////////////find socket attributed to zeek based on orig_seuid
          //var uid = d.properties.uid[0].value
          try {
            var orig_fuid = d.properties.orig_fuids[0].value

            for (var key in orig_fuid) {

              let data = {
                "query": {
                  "bool": {
                    "must": [
                      {
                        "match": {

                          "fuid": orig_fuid[key]
                        }
                      }
                    ]
                  }
                }
                ,
                "size": node_limit_per_request
              }

              $.ajax({

                url: es_networkfile_index_url,
                type: 'POST',

                contentType: "application/json;charset=UTF-8",
                dataType: 'json',
                data: JSON.stringify(data),
                processData: false,
                async: false,
                success: function (response) {
                  var data = response.hits.hits;

                  if (data.length != 0) {
                    var socket_node = data_manipulation(data, node_pos, "file.log")

                    combined_nodes = combined_nodes.concat(socket_node)

                    var edges = edge_manipulation_process_process(socket_node, d, "outbound", "http", "orig_file.log")
                    combined_edges = combined_edges.concat(edges)
                  }
                }
              })
            }
          }
          catch (err) {
            // console.log("resp",err) 
          }
          try {
            var resp_fuid = d.properties.resp_fuids[0].value

            for (var key in resp_fuid) {
             

              let data = {
                "query": {
                  "bool": {
                    "must": [
                      {
                        "match": {

                          "fuid": resp_fuid[key]
                        }
                      }
                    ]
                  }
                }
                ,
                "size": node_limit_per_request
              }

              $.ajax({

                url: es_networkfile_index_url,
                type: 'POST',

                contentType: "application/json;charset=UTF-8",
                dataType: 'json',
                data: JSON.stringify(data),
                processData: false,
                async: false,
                success: function (response) {
                  var data = response.hits.hits;

                  if (data.length != 0) {
                    var socket_node = data_manipulation(data, node_pos, "file.log")

                    combined_nodes = combined_nodes.concat(socket_node)

                    var edges = edge_manipulation_process_process(socket_node, d, "outbound", "http", "resp_file.log")
                    combined_edges = combined_edges.concat(edges)
                  }
                }
              })
            }
          }
          catch (err) {
            // console.log("resp",err) 
          }


          

          node_position_list.push(node_pos)
          node_position_history_backward.push(d.id)
        }
        combined_nodes.push(d)
        //console.log("combined_edges",combined_edges)
        let test_dic = { 'nodes': combined_nodes, 'links': combined_edges }
        //console.log("graphnew",test_dic)
        graph_viz.refresh_data(test_dic, 1, d.id)
      }
    }


  }
  return {

    search_query: search_query,
    click_query: click_query,

  }
})();