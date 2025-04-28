(function () {
  /*START FUNC*/
  const CONFIG_THEME = 'app_theme';
  const CONFIG_SIDEBAR = 'app_sidebar';
  const CLASS_OPENED = "sidebar-opened";
  const CLASS_DARK = "dark";
  const CLASS_POPUP = "sidebar-popup";
  
  console.log("**** Start js layout")
  function initThemes(){
      let classList = document.documentElement.classList;
      let classList2 = document.body.classList;
  
      let value = localStorage.getItem(CONFIG_THEME);
      if(value && value === CLASS_DARK){
        classList.add(CLASS_DARK);
      }
      else classList.remove(CLASS_DARK);
  
      value = localStorage.getItem(CONFIG_SIDEBAR);
      if(value && value === "1"){
        classList2.add(CLASS_OPENED);
      }
      else classList2.remove(CLASS_OPENED);       
    }
    function toggleTheme() {
      let classList = document.documentElement.classList;
      if(classList.contains(CLASS_DARK)){
        classList.remove(CLASS_DARK)
        localStorage.setItem(CONFIG_THEME, "");
      }
      else {
        classList.add(CLASS_DARK);
        localStorage.setItem(CONFIG_THEME, CLASS_DARK);
      }
    }
    function toggleSidebar() {  
      let classList = document.body.classList;
      if (window.innerWidth <= 769) {
        // mobile width Resolution is 1024x768 or above
        classList.toggle(CLASS_POPUP);
        return;
      }
      if(classList.contains(CLASS_OPENED)){
        classList.remove(CLASS_OPENED)
        localStorage.setItem(CONFIG_SIDEBAR, "0");
      }
      else {
        classList.add(CLASS_OPENED);
        localStorage.setItem(CONFIG_SIDEBAR, "1");
      }
      //document.documentElement.classList.toggle("sidebar-opened");
    }
    function closeSidebar() {
      document.body.classList.remove(CLASS_POPUP);
    }
  
    function initScript(){
      document.addEventListener("click", function(e) {
          let elm = e.target.closest(".cmd");
          if(!elm) return;
          let cmd = elm.dataset.cmd;
          if(!cmd) return;
          let Klass = elm.dataset.class;
          if(!Klass) return;
          elm.classList.toggle(Klass);
        });
    }
  
  
  initThemes();
  initScript();
  document.body.classList.remove('notvisible');
  
  window.toggleTheme = toggleTheme;
  window.toggleSidebar = toggleSidebar;
  window.closeSidebar=closeSidebar;
  /*END FUNC*/
  })();