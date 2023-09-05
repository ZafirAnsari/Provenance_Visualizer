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

// Module for setting the shape and actions of the nodes and edges.

var graphShapes = (function () {
	"use strict";

	d3.scaleOrdinal(d3.schemeCategory20);  //removed var color_palette = and commented the next line
	//var colored_prop = "none";
	var node_code_color = [];

	function node_size(d) {
		if ('size' in d) { return d.size; }
		else { return default_node_size; }
	}

	function node_stroke_width(d) {
		if ('stroke_width' in d) { return d.stroke_width; }
		else { return default_stroke_width; }
	}

	function node_color(d) {

		// 	if(d.label=="PROCESS")
		// 		{return "#23D9B7"}
		// 	if(d.label=="FILE")
		// 		{return "#F2E205"

		// }
		// if(d.label=="SOCKET")
		// 		{return "#F25D27"}

		// 	if(d.label=="REG_KEY")
		// 		{return "#F25D27"}
		// 	if(d.label=="NETWORK")
		// 		{return "#ce31bf"}

		// 	if(d.label=="ZEEK")
		// 		{return "#6B98F2"}
		// 	if(d.label=="ZEEKSUB")
		// 		{return "#0FF02B"}
		if (d.label == "PROCESS") { return "#41b6c4" }
		if (d.label == "FILE") {
			return "#253494"

		}
		if (d.label == "SOCKET") { return "#ffffcc" }

		if (d.label == "REG_KEY") { return "#F25D27" }
		if (d.label == "NETWORK") { return "#2c7fb8" }

		if (d.label == "ZEEK") { return "#a1dab4" }
		if (d.label == "ZEEKSUB") { return "#0FF02B" }


		return default_node_color;
	}

	function node_icon(d) {

		// 	if(d.label=="PROCESS")
		// 		{return "#23D9B7"}
		// 	if(d.label=="FILE")
		// 		{return "#F2E205"

		// }
		// if(d.label=="SOCKET")
		// 		{return "#F25D27"}

		// 	if(d.label=="REG_KEY")
		// 		{return "#F25D27"}
		// 	if(d.label=="NETWORK")
		// 		{return "#ce31bf"}

		// 	if(d.label=="ZEEK")
		// 		{return "#6B98F2"}
		// 	if(d.label=="ZEEKSUB")
		// 		{return "#0FF02B"}
		if (d.label == "PROCESS") 
			{ 

				// return "https://iconarchive.com/download/i6058/custom-icon-design/pretty-office-3/Process-Accept.ico" 
				// return "https://thumbs.dreamstime.com/z/process-gear-icon-outline-process-gear-vector-icon-color-flat-isolated-process-gear-icon-color-outline-vector-233769161.jpg"
				return "https://icon-icons.com/downloadimage.php?id=34801&root=325/ICO/256/&file=Letter-P-icon_34801.ico"
			}
		if (d.label == "FILE") {
			// return "https://icon-icons.com/downloadimage.php?id=193935&root=3178/ICO/512/&file=folder_file_icon_193935.ico"
			return "https://icon-icons.com/downloadimage.php?id=83383&root=1221/ICO/512/&file=1492608046-7-docs-document-file-data-google-suits_83383.ico"
		}
		if (d.label == "SOCKET") { return "https://icon-icons.com/downloadimage.php?id=123070&root=1990/ICO/512/&file=internetlanoutletplugportsockettelephone_123070.ico" }

		if (d.label == "REG_KEY") { return "https://github.com/favicon.ico" }
		if (d.label == "NETWORK") {

		 // return "https://icon-icons.com/downloadimage.php?id=102151&root=1483/ICO/512/&file=internet_102151.ico" 
		 return "https://icon-icons.com/downloadimage.php?id=210841&root=3361/ICO/512/&file=global_earth_grid_globe_communication_network_web_worldwide_world_internet_icon_210841.ico"

		}

		if (d.label == "ZEEK") { return "https://images.squarespace-cdn.com/content/v1/5a417d128c56a85fe950f45e/1581009748029-LS8T8C9PJJTCXVYOOZYG/zeek-logo-without-text.png?format=500w" }
		if (d.label == "ZEEKSUB") { return "https://github.com/favicon.ico" }


		return "https://github.com/favicon.ico";
	}



	function node_title(d) {
		if ('node_title' in d) { return d.node_title; }
		else { return d.label; }
	}

	function node_text(d) {
		if ('name' in d.properties) { return d.properties.name[0].value; }
		else { return d.label; }
	}

	function edge_stroke_width(d) {
		if ('stroke_width' in d) { return d.stroke_width; }
		else { return default_edge_stroke_width; }
	}

	function edge_color(d) {

		if ('color' in d) { return d.color; }
		else { return default_edge_color; }
	}


	// decorate the node
	function decorate_node(node, with_active_node) {
		// the node layout is defined here
		// node: the selection of nodes with their data
		// with_active_node: the Id of the active node if any

		var node_deco = node.append("g")
			.attr("class", "active_node").attr("ID", function (d) { return d.id; })
			.classed("node", true);

		// Attach the event listener
		attach_node_actions(node_deco);

		node_deco.moveToFront();

		// Create the circle shape
		var node_base_circle = node_deco.append("circle").classed("base_circle", true)
			.attr("r", node_size)
			.style("stroke-width", node_stroke_width)
			.style("stroke", "black")
			.attr("fill", node_color)
			.style("visibility", "hidden");





		node_base_circle.append("title").text(node_title);

		node_deco.append("text").classed("text_details", true)
			.attr("x", function (d) { return node_size(d) + 2; })
			.text(node_text)
			.style("visibility", "visible");

		

		// Add the node pin
		var node_pin = node_deco.append("circle").classed("Pin", true)
			.attr("r", function (d) { return node_size(d) / 2; })
			.attr("transform", function (d) { return "translate(" + (node_size(d) * 3 / 4) + "," + (-node_size(d) * 3 / 4) + ")"; })
			.attr("fill", node_color)
			.moveToBack()
			.style("visibility", "hidden");

		node_pin.on("click", graph_viz.graph_events.pin_it);

		// spot the active node and draw additional circle around it
		if (with_active_node) {
			d3.selectAll(".active_node").each(function (d) {
				if (d.id == with_active_node) {
					var n_radius = Number(d3.select(this).select(".base_circle").attr("r")) + active_node_margin;
					d3.select(this)
						.append("circle").classed("focus_node", true)
						.attr("r", n_radius)
						.attr("fill", node_color)
						.attr("opacity", active_node_margin_opacity)
						.moveToBack();
				}

			})
		}

		node_deco.append("image")
				    .attr("xlink:href", node_icon)
				    .attr("x", -8)
				    .attr("y", -8)
				    .attr("width", 26)
				    .attr("height", 26);

		return node_deco;
	}

	function attach_node_actions(node) {
		node.call(d3.drag()
			.on("start", graph_viz.graph_events.dragstarted)
			.on("drag", graph_viz.graph_events.dragged)
			.on("end", graph_viz.graph_events.dragended));


		node.on("click", graph_viz.graph_events.clicked)
			.on("mouseover", function () {
				d3.select(this).select(".Pin").style("visibility", "visible");

			})
			.on("mouseout", function () {
				var chosen_node = d3.select(this);
				if (!chosen_node.classed("pinned"))
					d3.select(this).select(".Pin").style("visibility", "hidden");
			});

	}

	function decorate_link(edges, edgepaths, edgelabels, node_deco) {

		var edges_deco = edges.append("path").attr("class", "edge").classed("active_edge", true)
			.attr("source_ID", function (d) { return d.source; })
			.attr("target_ID", function (d) { return d.target; })
			.attr("ID", function (d) { return d.id; })



		graph_viz.create_arrows(edges_deco);
		// Attach the arrows
		edges_deco.attr("marker-end", function (d) { return "url(#marker_" + d.id + ")" })
			.attr('stroke-width', edge_stroke_width)
			.append('title').text(function (d) { return 1; });

		// Attach the edge labels
		var e_label = create_edge_label(edgepaths, edgelabels);
		var edgepaths_deco = e_label[0];
		var edgelabels_deco = e_label[1];

		edgelabels_deco.append('textPath')
			.attr('class', 'edge_text')
			.attr('href', function (d, i) { return '#edgepath' + d.id })
			.style("text-anchor", "middle")
			.style("pointer-events", "none")
			.attr("startOffset", "50%")
			.text(function (d) { return d.label });



		return [edges_deco, edgepaths_deco, edgelabels_deco]
	}


	function create_edge_label(edgepaths, edgelabels) {
		var edgepaths_deco = edgepaths.append('path')
			.attr('class', 'edgepath').classed("active_edgepath", true)
			.attr('fill-opacity', 0)
			.attr('stroke-opacity', 0)
			.attr('id', function (d, i) { return 'edgepath' + d.id; })
			.attr("ID", function (d) { return d.id; })
			.style("pointer-events", "none");

		var edgelabels_deco = edgelabels.append('text')
			.attr('dy', -3)
			.style("pointer-events", "none")
			.style("visibility", "hidden")
			.attr('class', 'edgelabel').classed("active_edgelabel", true)
			.attr('id', function (d, i) { return 'edgelabel' + d.id })
			.attr("ID", function (d) { return d.id; })
			.attr('font-size', 10)
			.attr('fill', edge_label_color);


		return [edgepaths_deco, edgelabels_deco];


	}




	function decorate_old_elements(nb_layers) {
		// Decrease the opacity of nodes and edges when they get old

		for (var k = 0; k < nb_layers; k++) {
			d3.selectAll(".old_edge" + k)
				.style("opacity", function () { return 0.8 * (1 - k / nb_layers) });
			d3.selectAll(".old_node" + k)
				.style("opacity", function () { return 0.8 * (1 - k / nb_layers) });
			d3.selectAll(".old_edgelabel" + k)
				.style("opacity", function () { return 0.8 * (1 - k / nb_layers) });

		};
	}


	// https://github.com/wbkd/d3-extended
	d3.selection.prototype.moveToFront = function () {
		// move the selection to the front  
		return this.each(function () {
			this.parentNode.appendChild(this);
		});
	};

	d3.selection.prototype.moveToBack = function () {
		// move the selection to the back  
		return this.each(function () {
			var firstChild = this.parentNode.firstChild;
			if (firstChild) {
				this.parentNode.insertBefore(this, firstChild);
			}
		});
	};

	function show_names() {
		var text_to_show = d3.selectAll(".text_details");
		var input = document.getElementById("showName");
		var isChecked = input.checked;
		if (isChecked) {
			text_to_show.each(function (d) {
				if ((d3.select(this).style("fill")) != "red") {

					d3.select(this).style("visibility", "visible");
				}
			})
		}


		else { text_to_show.style("visibility", "hidden"); }
	}
	function show_names_edges() {

		var text_to_show_old = d3.selectAll(".edgelabel");
		var input = document.getElementById("showEdge");
		var isChecked = input.checked;
		if (isChecked) {

			text_to_show_old.each(function (d) {
				if ((d3.select(this).style("fill")) != "red") {

					d3.select(this).style("visibility", "visible");
				}
			})


		}
		else {

			text_to_show_old.style("visibility", "hidden");
		}
	}
	function hide_process_only(run_else) {
		var input = document.getElementById("hideProcess");
		var isChecked = input.checked;
		var names = document.getElementById("showName");
		var name_check = names.checked;
		var edge_name = document.getElementById("showEdge");
		var edge_name_check = edge_name.checked;

		var node_id_list = [];
		var edge_id_list = [];
		if (isChecked) {
			d3.selectAll(".node").each(function (d) {
				if ((d3.select(this).select(".base_circle").attr("fill")) == "#41b6c4") {

					d3.select(this).select(".base_circle").style("visibility", "hidden");
					d3.select(this).style("visibility", "hidden");
					d3.select(this).select(".text_details").style("visibility", "hidden").style("fill", "red");
					var id = d3.select(this).attr("ID");

					node_id_list.push(id)
				}
			})

			d3.selectAll(".edge").each(function (d) {
				if (node_id_list.includes(d3.select(this).attr("source_ID")) || node_id_list.includes(d3.select(this).attr("target_ID"))) {
					d3.select(this).style("visibility", "hidden");
					var id = d3.select(this).attr("ID");

					edge_id_list.push(id)
				}


			})

			d3.selectAll(".edgelabel").each(function (d) {

				if (edge_id_list.includes(d3.select(this).attr("ID"))) {

					d3.select(this).style("visibility", "hidden").style("fill", "red");


				}


			})

		}

		else {

			if (run_else) {

				d3.selectAll(".node").each(function (d) {
					if ((d3.select(this).select(".base_circle").attr("fill")) == "#41b6c4") {
						d3.select(this).select(".base_circle").style("visibility", "hidden");
						d3.select(this).style("visibility", "visible");
						if (name_check) {
							d3.select(this).select(".text_details").style("visibility", "visible").style("fill", "black");
						}
						else {
							d3.select(this).select(".text_details").style("fill", "black");
						}
						var id = d3.select(this).attr("ID");

						node_id_list.push(id)
					}
				})

				d3.selectAll(".edge").each(function (d) {
					if (node_id_list.includes(d3.select(this).attr("source_ID")) || node_id_list.includes(d3.select(this).attr("target_ID"))) {
						d3.select(this).style("visibility", "visible");
						var id = d3.select(this).attr("ID");

						edge_id_list.push(id)

					}


				})
				d3.selectAll(".edgelabel").each(function (d) {
					if (edge_id_list.includes(d3.select(this).attr("ID"))) {

						if (edge_name_check) {
							d3.select(this).style("visibility", "visible").style("fill", "black");
						}
						else {
							d3.select(this).style("fill", "black");
						}


					}


				})

				//hide_process_only()
				hide_zeek_only(false)
				hide_registry_only(false)
				hide_FILE_only(false)
				hide_network_only(false)
			}

		}

	}


	function hide_zeek_only(run_else) {
		var input = document.getElementById("hideZEEK");
		var isChecked = input.checked;
		var names = document.getElementById("showName");
		var name_check = names.checked;
		var edge_name = document.getElementById("showEdge");
		var edge_name_check = edge_name.checked;

		var node_id_list = [];
		var edge_id_list = [];
		if (isChecked) {
			d3.selectAll(".node").each(function (d) {
				if ((d3.select(this).select(".base_circle").attr("fill")) == "#a1dab4") {

					d3.select(this).select(".base_circle").style("visibility", "hidden");
					d3.select(this).style("visibility", "hidden");
					d3.select(this).select(".text_details").style("visibility", "hidden").style("fill", "red");
					var id = d3.select(this).attr("ID");

					node_id_list.push(id)
				}
			})

			d3.selectAll(".edge").each(function (d) {
				if (node_id_list.includes(d3.select(this).attr("source_ID")) || node_id_list.includes(d3.select(this).attr("target_ID"))) {
					d3.select(this).style("visibility", "hidden");
					var id = d3.select(this).attr("ID");

					edge_id_list.push(id)
				}


			})


			d3.selectAll(".edgelabel").each(function (d) {

				if (edge_id_list.includes(d3.select(this).attr("ID"))) {

					d3.select(this).style("visibility", "hidden").style("fill", "red");

				}


			})


		}

		else {
			if (run_else) {
				d3.selectAll(".node").each(function (d) {
					if ((d3.select(this).select(".base_circle").attr("fill")) == "#a1dab4") {
						d3.select(this).select(".base_circle").style("visibility", "hidden");
						d3.select(this).style("visibility", "visible");
						if (name_check) {
							d3.select(this).select(".text_details").style("visibility", "visible").style("fill", "black");
						}
						else {
							d3.select(this).select(".text_details").style("fill", "black");
						}

						var id = d3.select(this).attr("ID");

						node_id_list.push(id)
					}
				})

				d3.selectAll(".edge").each(function (d) {
					if (node_id_list.includes(d3.select(this).attr("source_ID")) || node_id_list.includes(d3.select(this).attr("target_ID"))) {
						d3.select(this).style("visibility", "visible");
						var id = d3.select(this).attr("ID");

						edge_id_list.push(id)
					}


				})

				d3.selectAll(".edgelabel").each(function (d) {
					if (edge_id_list.includes(d3.select(this).attr("ID"))) {

						if (edge_name_check) {
							d3.select(this).style("visibility", "visible").style("fill", "black");
						}
						else {
							d3.select(this).style("fill", "black");
						}


					}


				})

				hide_process_only(false)
				//hide_zeek_only()
				hide_registry_only(false)
				hide_FILE_only(false)
				hide_network_only(false)
			}
		}

	}

	//hide socket
	function hide_registry_only(run_else) {
		var input = document.getElementById("hideRegistry");
		var isChecked = input.checked;
		var names = document.getElementById("showName");
		var name_check = names.checked;
		var edge_name = document.getElementById("showEdge");
		var edge_name_check = edge_name.checked;

		var node_id_list = [];
		var edge_id_list = [];
		if (isChecked) {
			d3.selectAll(".node").each(function (d) {
				if ((d3.select(this).select(".base_circle").attr("fill")) == "#ffffcc") {

					d3.select(this).select(".base_circle").style("visibility", "hidden");
					d3.select(this).style("visibility", "hidden");
					d3.select(this).select(".text_details").style("visibility", "hidden").style("fill", "red");
					var id = d3.select(this).attr("ID");

					node_id_list.push(id)
				}
			})

			d3.selectAll(".edge").each(function (d) {
				if (node_id_list.includes(d3.select(this).attr("source_ID")) || node_id_list.includes(d3.select(this).attr("target_ID"))) {
					d3.select(this).style("visibility", "hidden");
					var id = d3.select(this).attr("ID");

					edge_id_list.push(id)
				}


			})


			d3.selectAll(".edgelabel").each(function (d) {

				if (edge_id_list.includes(d3.select(this).attr("ID"))) {

					d3.select(this).style("visibility", "hidden").style("fill", "red");


				}


			})


		}

		else {
			if (run_else) {
				d3.selectAll(".node").each(function (d) {
					if ((d3.select(this).select(".base_circle").attr("fill")) == "#ffffcc") {
						d3.select(this).select(".base_circle").style("visibility", "hidden");
						d3.select(this).style("visibility", "visible");
						if (name_check) {
							d3.select(this).select(".text_details").style("visibility", "visible").style("fill", "black");
						}
						else {
							d3.select(this).select(".text_details").style("fill", "black");
						}

						var id = d3.select(this).attr("ID");

						node_id_list.push(id)
					}
				})

				d3.selectAll(".edge").each(function (d) {
					if (node_id_list.includes(d3.select(this).attr("source_ID")) || node_id_list.includes(d3.select(this).attr("target_ID"))) {
						d3.select(this).style("visibility", "visible");
						var id = d3.select(this).attr("ID");

						edge_id_list.push(id)
					}


				})

				d3.selectAll(".edgelabel").each(function (d) {
					if (edge_id_list.includes(d3.select(this).attr("ID"))) {

						if (edge_name_check) {
							d3.select(this).style("visibility", "visible").style("fill", "black");
						}
						else {
							d3.select(this).style("fill", "black");
						}


					}


				})

				hide_process_only(false)
				hide_zeek_only(false)
				//hide_registry_only()
				hide_FILE_only(false)
				hide_network_only(false)
			}

		}

	}

	function hide_FILE_only(run_else) {
		var input = document.getElementById("hideFILE");
		var isChecked = input.checked;
		var names = document.getElementById("showName");
		var name_check = names.checked;
		var edge_name = document.getElementById("showEdge");
		var edge_name_check = edge_name.checked;

		var node_id_list = [];
		var edge_id_list = [];
		if (isChecked) {
			d3.selectAll(".node").each(function (d) {
				if ((d3.select(this).select(".base_circle").attr("fill")) == "#253494") {

					d3.select(this).select(".base_circle").style("visibility", "hidden");
					d3.select(this).style("visibility", "hidden");

					// d3.select(this).select(".image").style("visibility", "hidden");
					d3.select(this).select(".text_details").style("visibility", "hidden").style("fill", "red");
					var id = d3.select(this).attr("ID");

					node_id_list.push(id)
				}
			})

			d3.selectAll(".edge").each(function (d) {
				if (node_id_list.includes(d3.select(this).attr("source_ID")) || node_id_list.includes(d3.select(this).attr("target_ID"))) {
					d3.select(this).style("visibility", "hidden");
					var id = d3.select(this).attr("ID");

					edge_id_list.push(id)
				}


			})



			d3.selectAll(".edgelabel").each(function (d) {

				if (edge_id_list.includes(d3.select(this).attr("ID"))) {

					d3.select(this).style("visibility", "hidden").style("fill", "red");


				}


			})


		}

		else {
			if (run_else) {
				d3.selectAll(".node").each(function (d) {
					if ((d3.select(this).select(".base_circle").attr("fill")) == "#253494") {
						d3.select(this).select(".base_circle").style("visibility", "hidden");
						d3.select(this).style("visibility", "visible");
						if (name_check) {
							d3.select(this).select(".text_details").style("visibility", "visible").style("fill", "black");
						}
						else {
							d3.select(this).select(".text_details").style("fill", "black");
						}

						var id = d3.select(this).attr("ID");

						node_id_list.push(id)
					}
				})

				d3.selectAll(".edge").each(function (d) {
					if (node_id_list.includes(d3.select(this).attr("source_ID")) || node_id_list.includes(d3.select(this).attr("target_ID"))) {
						d3.select(this).style("visibility", "visible");
						var id = d3.select(this).attr("ID");

						edge_id_list.push(id)

					}


				})

				d3.selectAll(".edgelabel").each(function (d) {
					if (edge_id_list.includes(d3.select(this).attr("ID"))) {

						if (edge_name_check) {
							d3.select(this).style("visibility", "visible").style("fill", "black");
						}
						else {
							d3.select(this).style("fill", "black");
						}


					}


				})

				hide_process_only(false)
				hide_zeek_only(false)
				hide_registry_only(false)
				//hide_FILE_only()
				hide_network_only(false)
			}

		}

	}

	function hide_network_only(run_else) {
		var input = document.getElementById("hideNETWORK");
		var isChecked = input.checked;
		var names = document.getElementById("showName");
		var name_check = names.checked;
		var edge_name = document.getElementById("showEdge");
		var edge_name_check = edge_name.checked;

		var node_id_list = [];
		var edge_id_list = [];
		if (isChecked) {
			d3.selectAll(".node").each(function (d) {
				if ((d3.select(this).select(".base_circle").attr("fill")) == "#2c7fb8") {

					d3.select(this).select(".base_circle").style("visibility", "hidden");
					d3.select(this).style("visibility", "hidden");
					d3.select(this).select(".text_details").style("visibility", "hidden").style("fill", "red");
					var id = d3.select(this).attr("ID");

					node_id_list.push(id)
				}
			})

			d3.selectAll(".edge").each(function (d) {
				if (node_id_list.includes(d3.select(this).attr("source_ID")) || node_id_list.includes(d3.select(this).attr("target_ID"))) {
					d3.select(this).style("visibility", "hidden");
					var id = d3.select(this).attr("ID");

					edge_id_list.push(id)
				}


			})



			d3.selectAll(".edgelabel").each(function (d) {

				if (edge_id_list.includes(d3.select(this).attr("ID"))) {

					d3.select(this).style("visibility", "hidden").style("fill", "red");


				}


			})


		}

		else {
			if (run_else) {
				d3.selectAll(".node").each(function (d) {
					if ((d3.select(this).select(".base_circle").attr("fill")) == "#2c7fb8") {
						d3.select(this).select(".base_circle").style("visibility", "hidden");
						d3.select(this).style("visibility", "visible");
						if (name_check) {
							d3.select(this).select(".text_details").style("visibility", "visible").style("fill", "black");
						}
						else {
							d3.select(this).select(".text_details").style("fill", "black");
						}
						var id = d3.select(this).attr("ID");

						node_id_list.push(id)
					}
				})

				d3.selectAll(".edge").each(function (d) {
					if (node_id_list.includes(d3.select(this).attr("source_ID")) || node_id_list.includes(d3.select(this).attr("target_ID"))) {
						d3.select(this).style("visibility", "visible");
						var id = d3.select(this).attr("ID");

						edge_id_list.push(id)
					}


				})

				d3.selectAll(".edgelabel").each(function (d) {
					if (edge_id_list.includes(d3.select(this).attr("ID"))) {

						if (edge_name_check) {
							d3.select(this).style("visibility", "visible").style("fill", "black");
						}
						else {
							d3.select(this).style("fill", "black");
						}


					}


				})


				hide_process_only(false)
				hide_zeek_only(false)
				hide_registry_only(false)
				hide_FILE_only(false)
				//hide_network_only()
			}

		}

	}


	return {
		show_names: show_names,
		show_names_edges: show_names_edges,
		decorate_node: decorate_node,
		decorate_link: decorate_link,
		node_color: node_color,
		node_size: node_size,
		edge_color: edge_color,
		node_stroke_width: node_stroke_width,
		create_edge_label: create_edge_label,
		decorate_old_elements: decorate_old_elements,
		hide_process_only: hide_process_only,
		hide_network_only: hide_network_only,
		hide_FILE_only: hide_FILE_only,
		hide_registry_only: hide_registry_only,
		hide_zeek_only: hide_zeek_only,
		node_icon: node_icon,



	};

})();
