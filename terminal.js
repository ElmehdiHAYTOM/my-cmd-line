$(function() {
  
    $('.prompt').html('root@lekssays:~# ');

  var term = new Terminal('#input-line .cmdline', '#container output');
  term.init();
  
});

var util = util || {};
util.toArray = function(list) {
  return Array.prototype.slice.call(list || [], 0);
};

var Terminal = Terminal || function(cmdLineContainer, outputContainer) {
  window.URL = window.URL || window.webkitURL;
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

  var cmdLine_ = document.querySelector(cmdLineContainer);
  var output_ = document.querySelector(outputContainer);

  const CMDS_ = [
    'whoami', 'education', 'interests', 'love' ,'contact', , 'clear', 'help' 
  ];
  
  var fs_ = null;
  var cwd_ = null;
  var history_ = [];
  var histpos_ = 0;
  var histtemp_ = 0;

  window.addEventListener('click', function(e) {
    cmdLine_.focus();
  }, false);

  cmdLine_.addEventListener('click', inputTextClick_, false);
  cmdLine_.addEventListener('keydown', historyHandler_, false);
  cmdLine_.addEventListener('keydown', processNewCommand_, false);

  //
  function inputTextClick_(e) {
    this.value = this.value;
  }

  //
  function historyHandler_(e) {
    if (history_.length) {
      if (e.keyCode == 38 || e.keyCode == 40) {
        if (history_[histpos_]) {
          history_[histpos_] = this.value;
        } else {
          histtemp_ = this.value;
        }
      }

      if (e.keyCode == 38) { // up
        histpos_--;
        if (histpos_ < 0) {
          histpos_ = 0;
        }
      } else if (e.keyCode == 40) { // down
        histpos_++;
        if (histpos_ > history_.length) {
          histpos_ = history_.length;
        }
      }

      if (e.keyCode == 38 || e.keyCode == 40) {
        this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
        this.value = this.value; // Sets cursor to end of input.
      }
    }
  }

  //
  function processNewCommand_(e) {

    if (e.keyCode == 9) { // tab
      e.preventDefault();
      // Implement tab suggest.
    } else if (e.keyCode == 13) { // enter
      // Save shell history.
      if (this.value) {
        history_[history_.length] = this.value;
        histpos_ = history_.length;
      }

      // Duplicate current input and append to output section.
      var line = this.parentNode.parentNode.cloneNode(true);
      line.removeAttribute('id')
      line.classList.add('line');
      var input = line.querySelector('input.cmdline');
      input.autofocus = false;
      input.readOnly = true;
      output_.appendChild(line);

      if (this.value && this.value.trim()) {
        var args = this.value.split(' ').filter(function(val, i) {
          return val;
        });
        var cmd = args[0].toLowerCase();
        args = args.splice(1); // Remove cmd from arg list.
      }

      switch (cmd) {
        case 'clear':
          output_.innerHTML = '';
          this.value = '';
          return;
        case 'help':
          var result = "<h2>Help</h2><p><b>whoami</b>: display all my information.<br><b>education</b>: display all my information about my education.<br><b>interests</b>: display all my interests.<br><b>love</b>: are you curious about my love?<br><b>contact</b>: Say hi<br><b>clear</b>: clear terminal<br><b>help</b>: display this menu.</p>";
          output(result);
          break;
        case 'education':
          var result = "<h3>Education</h3>"+"<p>Electrical Engineering at ENSAM Rabat, Morocco(In progress)<br>Preparatory Course at ENSAM Rabat, Morocco 2021/2023<br>Baccalaureate in Mathematics in 2020/2021 from Ibn abdoun High School in Khouribga, Morocco";
          output(result);
          break;
        /*
                case 'programming':
                  var result = "<h3>Competitive Programmer</h3><p>6th Place in the Moroccan Collegiate Programming Contest 2017 with my team \"Slowpoke\"<br>Finalist of the Arab Collegiate Programming Contest 2017 with my team \"Slowpoke\"<br>Judge and Problem Setter at Code IT 2016, Ecole Hassania des Traveaux Publics, Casablanca, Morocco<br>Problem Setter Girls Code I 2016 (ENSIAS, Rabat) and Girls Code II 2017 (UIR, Rabat)<br>Winner of the Moroccan Collegiate Programming Contest 2016 with my team “PastGlory“<br>Finalist of the Arab Collegiate Programming Contest 2016 with my team “PastGlory“ <br>Contestant in the Moroccan Collegiate Programming Contest 2015 with my team “return 0;“<p>"+"<h3> Web Developer and Entrepreneur</h3>Web Development Tutor – E-nitiate Summer Camp 2016<br>Web Development Tutor – Computer Science for Innovation Club – Web Development Workshops<br>NASA Apps Space Challenge – 1st Place in Morocco<br>Brackets Project – An Open-Source Contests Management Platform<br>Altair Project – An Open-Source API for Intelligent Drone Driving<br>oudadOS – An Open-Source Lightweight Operating System for Educational Purposes<br>More projects on my <a href=\"https://github.com/Lekssays\">Github</a></p>";
                  output(result);
                  break;
        */
        case 'interests': 
          var result = "<h3>Interests</h3><p>Algorithms, Data Structures, Problem Solving , Football, Communication, Internet of Things , Volunteering, Traveling, Open Source Technologies...</p>";
          output(result);
          break;
        /*
                case 'blog':
                  var result = "<h3>I regulary share my thought on my <a href=\"https://blog.lekssays.com/\">Blog</a></h3>";
                  output(result);
                  break;
        */
        case 'contact':
          var result = "<h3>Contact</h3><h4>Email: elmehdihaytom@gmail.com<br>linkedIN: linkedin.com/in/elmehdi-haytom-00a202219/<br>Instagram: eel_mehdii</h4>";
          output(result);
          break;
        case 'whoami':
            var result = "<h1>HAYTOM Elmehdi</h1><p>Electrical engineering student AT ENSAM Rabat</p><p>I am 20 years old. I am from Khouribga.";
          output(result);
          break;
        
        case 'love':
          output("<h3>404...<br>private</h3>");
          break;
        case 'nada':
            output("<h3>Love...</h3>");
            break;
        default:
          if (cmd) {
            output(cmd + ': command not found');
          }
      };

      window.scrollTo(0, getDocHeight_());
      this.value = ''; // Clear/setup line for next input.
    }
  }

  //
  function formatColumns_(entries) {
    var maxName = entries[0].name;
    util.toArray(entries).forEach(function(entry, i) {
      if (entry.name.length > maxName.length) {
        maxName = entry.name;
      }
    });

    var height = entries.length <= 3 ?
        'height: ' + (entries.length * 15) + 'px;' : '';

    // 12px monospace font yields ~7px screen width.
    var colWidth = maxName.length * 7;

    return ['<div class="ls-files" style="-webkit-column-width:',
            colWidth, 'px;', height, '">'];
  }

  //
  function output(html) {
    output_.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
  }

  // Cross-browser impl to get document's height.
  function getDocHeight_() {
    var d = document;
    return Math.max(
        Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
        Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
        Math.max(d.body.clientHeight, d.documentElement.clientHeight)
    );
  }

  //
  return {
    init: function() {
      output('<h1>HAYTOM Elmehdi </h1><h3>Electrical engineering student<br></h3><p>Enter "help" for more information.</p>');
    },
    output: output
  }
};
