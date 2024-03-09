var gr = newGlideRecord('sys_user_grmember');
var group_gr = new GlideRecord('sys_user_group')
var user_gr = new GlideRecord('sys_user');
var whom_gr = new GlideRecord('u_to_whom_last_assign');
var whom_gr_insert = new GlideRecord('u_to_whom_last_assign');

//to whom_the ticket assigned last table
var group = current.assignment_group.toString(); //5b78aff447b84210ac155d0f536d436e
var sys_id_incident = "a18ae7f447b84210ac155d0f536d436c"; //a18ae7f447b84210ac155d0f536d436c

//quering the u_to_whom_last_assign table content: if below code done, we can access all the field in this.
whom_gr.addQuery('u_group_id','CONTAINS',group);
whom_gr.query();
gs.log("cuurent group sys id " + group);

//check if the table contains 1 value atleast:
//if true : if condition will run
//if false: else conditon will create a new group with
if(whom_gr.getRowCount() == 1){
   
whom_gr.next();

var members = whom_gr.u_member_list_dict.toString();
var members_list = members.split(",");
   
var next_assignee_number_in_listcolumn;

if(whom_gr.u_last_assign == members_list.length - 1){
             
next_assignee_number_in_listcolumn = 0;
}   
else{
      
next_assignee_number_in_listcolumn = whom_gr.u_last_assign + 1;
}
   
gs.log(next_assignee_number_in_listcolumn);
   
var next_assignee_name = members_list[next_assignee_number_in_listcolumn];
   
whom_gr.setValue('u_last_assign', next_assignee_number_in_listcolumn);
whom_gr.updateMultiple();

assigned_to_incident_ticket(sys_id_incident,next_assignee_name);


}
else{
var names = username();
whom_gr_insert.initialize();
whom_gr_insert.setValue('u_group_id', group);
whom_gr_insert.setValue('u_member_list_dict', names);
whom_gr_insert.insert();
gs.log("do not exists");
}


function assigned_to_incident_ticket(inc_sys_id,next_assignee_name){
   
user_gr.addQuery('user_name',next_assignee_name);
   
user_gr.query();
   
user_gr.next();
   
var user_sys_id = user_gr.sys_id.toString();

var inc_gr = new GlideRecord('incident'); //sys_id = a18ae7f447b84210ac155d0f536d436c
   
inc_gr.get(inc_sys_id);
   
inc_gr.setValue('assigned_to', user_sys_id);
   ß
inc_gr.setValue('assignment_group', group_gr.sys_id)//asdfghjkl;************
   
inc_gr.update();
}
function
username(){

var user_gr = new GlideRecord('sys_user');


var user_names_gio = [];
 
gr.addQuery('group',group);
gr.query();
 
while(gr.next()){
   
user_gr.get(gr.user);
   
user_names_gio.push(user_gr.user_name.toString());
 }
return user_names_gio.toString();
}