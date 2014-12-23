pm2-realtime
============

monitor the project run by pm2 ,can monitor the logs and operate the process

two ways to use

1. call api 
   /logs/:pmId  with the known pm process id , can get its real-time logs , default will get the last 30 lines(can be configured)
  
  /process/:pmId  get the process information (runnging status, memory, cpu usage)

 /os  get the os information from pm 
 
 /process/:processId  get the process(os process , not only process run by pm)  usage
2. use socket(not finished)
