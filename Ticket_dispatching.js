var gr = new GlideRecord('sys_user_grmember'); 
var group_gr = new GlideRecord('sys_user_group') 
var user_gr = new GlideRecord('sys_user'); 
var user_gr_main = new GlideRecord('sys_user')
var whom_gr = new GlideRecord('u_to_whom_last_assign'); 
var whom_gr_insert = new GlideRecord('u_to_whom_last_assign'); 
var apac_table = new GlideRecord('u_apac_shift')
var amer_table = new GlideRecord('u_amer_shift')
var emea_table = new GlideRecord('u_emea_shift')

// var amer_gr = new GlideRecord('u_amer_shift'); 
// var amer_gr_insert = new GlideRecord('u_amer_shift'); 

//to whom_the ticket assigned last table 
var group_sys_id = current.assignment_group.toString();  //5b78aff447b84210ac155d0f536d436e 
var sys_id_incident = current.sys_id.toString(); //a18ae7f447b84210ac155d0f536d436c 


//utc timing
var current_time_str = new GlideTime();
current_time_str.getTime();
gs.log(current_time_str);

var time_formate_hour = current_time_str.getByFormat('hh');
var time_formate_min = current_time_str.getByFormat('mm');
var time_formate_sec = current_time_str.getByFormat('ss');

gs.log(time_formate_hour);
gs.log(time_formate_min);
gs.log(time_formate_sec);

var start_amer_hour = 14;
var end_amer_hour = 22;
var start_apac_hour = 22;
var end_apac_hour = 6;
var start_emea_hour = 6;
var end_amer_hour = 14;

function getregion(time_formate_hour, time_formate_min, time_formate_sec){
    if(time_formate_hour > 14 && time_formate_hour < 22){
        return u_amer_shift;
    }
    else if(time_formate_hour > 22 && time_formate_hour < 6){
        return u_apac_shift;
    }
    else {return u_emea_shift;
    }
        
}

// gs.log(current_time_str.getByFormat('hh:mm:ss'));
// gs.log(current_time_str_format);

//quering the u_to_whom_last_assign table content: if below code done, we can access all the field in this. 
whom_gr.addQuery('u_group_id','CONTAINS', group_sys_id); 
whom_gr.query(); 

gr.addQuery('group',group_sys_id);
gr.query(); 

var AMER = [];
var APAC = [];
var EMEA = [];

while(gr.next()){
// Gets User's User_Name from User Table
    user_gr.get(gr.user.toString());
    
// Checking which users go to which Table
    switch (user_gr.u_shift.toString()){
        case "AMER":
            AMER.push(gr.user.u_shift.toString());
            break;
        case "APAC":
            APAC.push(gr.user.u_shift.toString())
            break;
        case "EMEA":
            EMEA.push(gr.user.u_shift.toString())
            break;
    }
}

AMER.toString(),"u_amer_shift", group_sys_id;
APAC.toString(),"u_apac_shift", group_sys_id;
EMEA.toString(),"u_emea_shift", group_sys_id;


// gs.log("current group sys id " + group_sys_id); 

//check if the table contains 1 value atleast: 
//if true : if condition will run 
//if false: else conditon will create a new group with 
if(whom_gr.getRowCount() == 1) 
{ 
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
gs.log(names)
for(i=0;i<names.length;i++){
    user_gr_main.get(names[i])
    user_gr_main.query();
    user_gr_main.next();{
    group_shift = (user_gr_main.u_shift)
    }
}
whom_gr_insert.initialize(); 
whom_gr_insert.setValue('u_group_id', group_sys_id); 
whom_gr_insert.setValue('u_member_list_dict', names); 
whom_gr_insert.insert(); 
gs.log("do not exists"); 
} 

var shift_times = ['AMER', 'APAC', 'EMEA'];

flag = 0;
name_list = [];
while(gr_user.next()){
   var list = (gr_user.sys_id.toString());
    name_list.push(list);
}
gs.log(name_list)

for(i=0;i<name_list.length;i++){

if(flag == 3){
    flag = 0;
}
gr_user.get(name_list[i]);
gr_user.setValue('u_shift', shift_times[flag]);
gr_user.update();

flag ++;
}

function assigned_to_incident_ticket(sys_id_incident,next_assignee_name)//inc_sys_id - this sh cm ins the parameters 
{ 
    user_gr.addQuery('user_name',next_assignee_name); 
    user_gr.query(); 
    user_gr.next(); 
    var user_sys_id = user_gr.sys_id.toString(); 

    var inc_gr = new GlideRecord('incident'); //sys_id = a18ae7f447b84210ac155d0f536d436c 
    inc_gr.get(sys_id_incident);
    inc_gr.setValue('assigned_to', user_sys_id); 
    inc_gr.update();   

} 
//gives the names as a array in the username function() in the u_member_list;
function username(){ 
    var user_names_gio = []; 
    gr.addQuery('group',group_sys_id);
    gr.query(); 

while(gr.next()){ 
    user_names_gio.push(gr.user.toString()); 
 } 
return user_names_gio; 

} 

var apac_table = new GlideRecord('u_apac_shift');
apac_table.initialize();
apac_table.setValue('u_group_name', sys_id_incident);
apac_table.setValue('u_group_members', names)
apac_table.insert();

var amer_table = new GlideRecord('u_amer_shift');
amer_table.initialize();
amer_table.setValue('u_group_name', sys_id_incident);
amer_table.setValue('u_group_members', names)
amer_table.insert();

var emea_table = new GlideRecord('u_emea_shift');
emea_table.initialize();
emea_table.setValue('u_group_name', sys_id_incident);
emea_table.setValue('u_group_members', names)
emea_table.insert();


