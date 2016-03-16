
// This will essentially be the machine object in the application.
//  In addition to these variables it will hold onto the buckets too.

conf = {
  // This will be backup directory name and log file name.
  name: 'name'

  // DNS or ip address
  ip: 'machine.bioneos.com',

  // Directories you would like to recursively duplicate on the server.
  inclusionPatterns: ['~'],

  // Directories and files and file regular expressions you would like to ignore in the backing up process.
  exclusionPatterns: ['*.mp3', '*.mp4', 'Downloads/'],
  // Describe the backup schedule
  // comma separated values are the days, parenthesis is amount of designated days backed up.
  // pipe separates any number of schedules. after semi colon = time to backup.
  schedule: '0,1,2,3,4,5,6(7)|1(5);3:00',
}

module.exports = config;
