
// configuration

//elastic search index corresponding to a particular label

//datatheftexam.txt
//const file_index = 'file_index_attack_one_new_vfour';
// const process_index = 'process_index_attack_one_new_vfour';
// const socket_index = 'socket_index_attack_one_new_vfour';
// const zeek_index = 'zeek_index_attack_one_new_vfour';
// const dhcp_index = 'dhcp_index_attack_one_new_vfour';
// const dns_index = 'dns_index_attack_one_new_vfour';
// const http_index = 'http_index_attack_one_new_vfour';
// const ssl_index = 'ssl_index_attack_one_new_vfour';
// const networkfile_index ='networkfile_index_attack_one_new_vfour';

// const file_index = 'agent_file_events';
// const process_index = 'agent_process_events';
// const socket_index = 'agent_socket_events';
// const zeek_index = 'conn';
// const dhcp_index = 'dhcp';
// const dns_index = 'dns';
// const http_index = 'http';
// const ssl_index = 'ssl';
// const networkfile_index ='files';


//mtivpaperf
const file_index = 'motiv_f_file';
const process_index = 'motiv_f_process';
const socket_index = 'motiv_f_socket';
const zeek_index = 'motiv_f_conn';
const dhcp_index = 'motiv_f_dhcp';
const dns_index = 'motiv_f_dns';
const http_index = 'motiv_f_http';
const ssl_index = 'motiv_f_ssl';
const networkfile_index = 'motiv_f_nfile';


// const file_index = 'test_case_file';
// const process_index = 'test_case_process';
// const socket_index = 'test_case_socket';
// const zeek_index = 'test_case_conn';
// const dhcp_index = 'test_case_dhcp';
// const dns_index = 'test_case_dns';
// const http_index = 'test_case_http';
// const ssl_index = 'test_case_ssl';
// const networkfile_index ='test_case_files';


// link to elastic search on port 9200
//for attack
const es_file_index_url = 'http://localhost:9200/'.concat(file_index.concat('/_doc/_search'));
const es_process_index_url = 'http://localhost:9200/'.concat(process_index.concat('/_doc/_search'));
const es_socket_index_url = 'http://localhost:9200/'.concat(socket_index.concat('/_doc/_search'));
const es_zeek_index_url = 'http://localhost:9200/'.concat(zeek_index.concat('/_doc/_search'));
const es_dhcp_index_url = 'http://localhost:9200/'.concat(dhcp_index.concat('/_doc/_search'));
const es_dns_index_url = 'http://localhost:9200/'.concat(dns_index.concat('/_doc/_search'));
const es_http_index_url = 'http://localhost:9200/'.concat(http_index.concat('/_doc/_search'));
const es_ssl_index_url = 'http://localhost:9200/'.concat(ssl_index.concat('/_doc/_search'));
const es_networkfile_index_url = 'http://localhost:9200/'.concat(networkfile_index.concat('/_doc/_search'));

// above links after concatination
//const es_file_index_url = 'http://localhost:9200/file_index_attack_one_new_vtwo/_doc/_search';
// const es_process_index_url  ='http://localhost:9200/process_index_attack_one_new_vtwo/_doc/_search';
// const es_socket_index_url='http://localhost:9200/socket_index_attack_one_new_vtwo/_doc/_search';
// const es_zeek_index_url='http://localhost:9200/zeek_index_attack_one_new_vtwo/_doc/_search';
// const es_dhcp_index_url='http://localhost:9200/dhcp_index_attack_one_new_vtwo/_doc/_search';
// const es_dns_index_url='http://localhost:9200/dns_index_attack_one_new_vtwo/_doc/_search';






// Graph configuration
const default_nb_of_layers = 20;// the number of layers after which the first layer vanishes
const node_limit_per_request = 60;//how much nodes are coming from es per request
const node_visible_per_request_limit = 100;//how many nodes are visible per request

// Simulation
const force_strength = -900;//electrostatic charge between nodes (repulsion if begative)
const link_strength = 0.4;//pushes linked nodes further or apart
//positioning force towards the axis
const force_x_strength = 0.05;
const force_y_strength = 0.05;

// Nodes
const default_node_size = 10;
const default_stroke_width = 1;
const default_node_color = "#80E810";
const active_node_margin = 6;
const active_node_margin_opacity = 0.3;
//initial position
var search_fx = 210;//position of the very first node(s)
var dist_x = 150;// initial distance between active node and its new neighbours
var next_free_position = 50; //incremented value to find the next free position for nodes to prevent overlap

// Edges
const default_edge_stroke_width = 3;
const default_edge_color = "#959595";
const edge_label_color = "#111";
const use_curved_edges = false;

// system files (if you want to exclude them out)

const system_files = ["so", "lib", "null", "Not Found"]