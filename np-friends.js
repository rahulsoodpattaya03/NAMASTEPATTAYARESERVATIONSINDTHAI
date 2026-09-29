/* Namaste Pattaya Reservations: Find a buddy (one feature, clear purpose), Find My Friends & Bill Splitter */
(function(){
  var sb=window.supabase?window.supabase.createClient("https://mymtgbmcjbwsnetzwgoy.supabase.co","sb_publishable_ViFodxG8kAENr78Fyp-BwQ_iA_BfAD0"):null;
  var TITLE="Friends Location & Bill Splitter";
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function rer(list){list.forEach(function(f){try{if(typeof window[f]==="function")window[f]()}catch(e){}})}

  if(typeof INTENTS!=="undefined")INTENTS.forEach(function(i){if(i[0]==="dating")i[2]="Meet new people in social places"});
  if(typeof LNAV!=="undefined")LNAV.forEach(function(n){if(n[0]==="friend")n[1]="Meet new people"});
  var ht=document.querySelector('.hubtile[data-go="buddy"]');
  if(ht){var hb=ht.querySelector("b"),hs=ht.querySelector("small");if(hb)hb.textContent="Meet new people";if(hs)hs.textContent="Meet travellers, safely"}
  var ga=document.querySelector(".goldarea");
  if(ga){
    var dt=ga.querySelector('[data-g="dating"]');if(dt)dt.hidden=true;
    var gt=ga.querySelector(".gtiles");if(gt)gt.style.gridTemplateColumns="1fr 1fr";
    var gb=ga.querySelector('[data-g="buddy"] small');if(gb)gb.textContent="Meet travellers, safely";
    var gp=ga.querySelector(".gtop p");if(gp)gp.textContent="Meet travellers safely, find your friends and split bills.";
    var ft=ga.querySelector('[data-g="friend"]');if(ft){ft.querySelector("b").textContent="Friends & bill splitter";ft.querySelector("small").textContent="Find your group, share costs";ft.onclick=function(){openBoth("find")}}
  }
  rer(["renderIntents","renderLive","renderPeople","renderSwipe","renderLadies"]);

  var sec=document.getElementById("buddy");
  if(sec&&!document.getElementById("npPurpose")){
    var pc=document.createElement("div");pc.id="npPurpose";pc.className="lcard hl nppurpose";
    pc.innerHTML='<span class="k">OUR PURPOSE</span><h4>Meet new people is a social feature</h4>'+
      '<p>Meet new people helps travellers meet in groups and in public places: for a club night, a meal, sports or sightseeing. It is not an escort, companion or matchmaking service.</p>'+
      '<ul><li>18+ only. Meet only in public places.</li>'+
      '<li>No money, gifts or payment may be offered or asked for meeting anyone.</li>'+
      '<li>Offering or asking for paid companionship or sexual services is forbidden under Thai law (Prevention and Suppression of Prostitution Act B.E. 2539). Such accounts are removed and may be reported to the Thai police.</li>'+
      '<li>Report anyone who breaks these rules. We review every report.</li></ul>'+
      '<button class="pill on" id="npFindBtn" style="margin-top:12px">'+TITLE+'</button>';
    var t=sec.querySelector(".sectiontitle");if(t)t.insertAdjacentElement("afterend",pc);else sec.insertBefore(pc,sec.firstChild);
    pc.querySelector("#npFindBtn").onclick=function(){openBoth("find")};
  }
  var gate=document.getElementById("buddyGate");
  if(gate&&!document.getElementById("bRules")){
    var lab=document.createElement("label");lab.style.cssText="display:flex;gap:8px;align-items:flex-start;margin-top:10px;font-size:14px";
    lab.innerHTML='<input type="checkbox" id="bRules"> I agree to the Meet new people rules: social meetings in public places only, and no money or paid services of any kind.';
    var st=document.getElementById("bStart");if(st)st.insertAdjacentElement("beforebegin",lab);
    gate.addEventListener("click",function(e){
      if(!e.target.closest||!e.target.closest("#bStart"))return;
      if(!document.getElementById("bRules").checked){e.stopImmediatePropagation();e.preventDefault();var er=document.getElementById("bErr");if(er)er.textContent="Please agree to the Meet new people rules."}
    },true);
  }

  var BAD=/(money|cash|\bpay\b|\bpaid\b|payment|price|\brate\b|baht|฿|\btip\b|short ?time|long ?time|happy ending|escort|\bsex)/i;
  function blocked(){var i=panel.querySelector("#bIn");return i&&BAD.test(i.value)}
  function warn(){var w=panel.querySelector("#bWarn");if(!w){w=document.createElement("p");w.id="bWarn";w.className="err";var bar=panel.querySelector(".chatbar");if(bar)bar.insertAdjacentElement("afterend",w)}
    w.textContent="For everyone's safety, messages about money, payment or paid services are not allowed in Meet new people. Please keep it social."}
  panel.addEventListener("click",function(e){if(e.target.closest&&e.target.closest("#bSend")&&blocked()){e.stopImmediatePropagation();e.preventDefault();warn()}},true);
  panel.addEventListener("keydown",function(e){if(e.target&&e.target.id==="bIn"&&e.key==="Enter"&&blocked()){e.stopImmediatePropagation();e.preventDefault();warn()}},true);

  if(!sb)return;

  var user=null,code="",watchId=null,me=null,lastSend=0,stopTimer=null,chan=null,members=[],pending="";
  try{code=localStorage.getItem("np_find_code")||""}catch(e){}
  function saveCode(c){code=c;try{c?localStorage.setItem("np_find_code",c):localStorage.removeItem("np_find_code")}catch(e){}}
  function myName(){var m=(user&&user.user_metadata)||{};return String(m.name||((user&&user.email)||"Friend").split("@")[0]).split(/\s+/)[0]}
  function genCode(){var s="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",o="";for(var i=0;i<6;i++)o+=s[Math.floor(Math.random()*s.length)];return o}
  function dist(a,b,c,d){var R=6371000,r=Math.PI/180,x=(c-a)*r,y=(d-b)*r,h=Math.sin(x/2)*Math.sin(x/2)+Math.cos(a*r)*Math.cos(c*r)*Math.sin(y/2)*Math.sin(y/2);return 2*R*Math.asin(Math.sqrt(h))}
  function dir(a,b,c,d){var r=Math.PI/180,y=Math.sin((d-b)*r)*Math.cos(c*r),x=Math.cos(a*r)*Math.sin(c*r)-Math.sin(a*r)*Math.cos(c*r)*Math.cos((d-b)*r);var deg=(Math.atan2(y,x)/r+360)%360;return ["north","north-east","east","south-east","south","south-west","west","north-west"][Math.round(deg/45)%8]}
  function ago(t){var s=(Date.now()-new Date(t).getTime())/1000;return s<60?"just now":s<3600?Math.round(s/60)+" min ago":Math.round(s/3600)+" h ago"}
  function fmtD(m){return m<1000?Math.round(m)+" m":(m/1000).toFixed(1)+" km"}

  async function join(c){
    c=String(c||"").toUpperCase().replace(/[^A-Z0-9]/g,"");if(c.length<4)return "Enter the group code.";
    var r=await sb.from("np_finder").upsert({code:c,user_id:user.id,name:myName(),sharing:false});
    if(r.error)return r.error.message;saveCode(c);subscribe();return null;
  }
  async function leave(){stopShare();if(code&&user)await sb.from("np_finder").delete().eq("code",code).eq("user_id",user.id);saveCode("");if(chan){sb.removeChannel(chan);chan=null}members=[];render()}
  function startShare(){
    if(!navigator.geolocation){alert("Location is not available on this phone.");return}
    watchId=navigator.geolocation.watchPosition(function(p){
      me=p.coords;var now=Date.now();
      if(now-lastSend>15000){lastSend=now;sb.from("np_finder").upsert({code:code,user_id:user.id,name:myName(),lat:me.latitude,lng:me.longitude,acc:me.accuracy,sharing:true,updated_at:new Date().toISOString()}).then(function(){})}
      render();
    },function(){alert("Please allow location for this app so your group can find you.");stopShare()},{enableHighAccuracy:true,maximumAge:10000,timeout:20000});
    clearTimeout(stopTimer);stopTimer=setTimeout(stopShare,3*3600*1000);render();
  }
  function stopShare(){
    if(watchId!==null){navigator.geolocation.clearWatch(watchId);watchId=null}
    clearTimeout(stopTimer);lastSend=0;
    if(user&&code)sb.from("np_finder").update({sharing:false,lat:null,lng:null}).eq("code",code).eq("user_id",user.id).then(function(){});
    render();
  }
  async function load(){if(!code||!user)return;var r=await sb.from("np_finder").select("*").eq("code",code);members=r.data||[];render()}
  function subscribe(){
    if(chan){sb.removeChannel(chan);chan=null}
    if(!code||!user)return;
    chan=sb.channel("find-"+code).on("postgres_changes",{event:"*",schema:"public",table:"np_finder",filter:"code=eq."+code},load).subscribe();
    load();
  }
  function render(){
    var root=document.getElementById("fdRoot");if(!root)return;
    var h='<div></div><p class="about">Got separated from your group? Share your location with your friends only, and find each other fast.</p>';
    if(!user){
      h+='<p class="small">Log in first to use Friends location.</p><button class="cta" id="fdLog">Log in</button>';
    }else if(!code){
      h+='<button class="cta" id="fdNew">Start a group</button>'+
        '<p class="small" style="margin:14px 0 6px">Or join your friends with their code:</p>'+
        '<div class="post"><input id="fdIn" placeholder="e.g. K7Q2XM" autocapitalize="characters"><button id="fdJoin">Join</button></div><p class="err" id="fdE"></p>';
    }else{
      var link=location.origin+location.pathname+"#find/"+code;
      var sharing=watchId!==null;
      h+='<div class="lcard hl"><span class="k">YOUR GROUP CODE</span><div class="fdcode notranslate" translate="no">'+esc(code)+'</div>'+
        '<div class="fdbtns"><a class="pill on" target="_blank" rel="noopener" style="text-decoration:none" href="https://wa.me/?text='+encodeURIComponent("Join my group on Namaste Pattaya Reservations so we can find each other and split bills: "+link+" (code "+code+")")+'">Invite on WhatsApp</a></div></div>'+
        '<div class="lcard"><div class="lrow"><div><h4>'+(sharing?'<span class="fdlive">Sharing my location</span>':'Location sharing is off')+'</h4><p class="small">Only people in this group can see it. It stops automatically after 3 hours, when you tap Stop, or when you close the app.</p></div></div>'+
        '<div class="fdbtns">'+(sharing?'<button class="pill" id="fdStop">Stop sharing</button>':'<button class="pill on" id="fdStart">Share my location</button>')+'</div></div>'+
        '<h3 style="font-size:16px;margin:16px 0 8px">My group</h3>';
      var others=members.filter(function(m){return m.user_id!==user.id});
      if(!others.length)h+='<p class="small">No friends in this group yet. Send them the code or the WhatsApp invite.</p>';
      others.forEach(function(m){
        var line="Not sharing location",nav="";
        if(m.sharing&&m.lat!=null){
          line=me?(fmtD(dist(me.latitude,me.longitude,m.lat,m.lng))+" "+dir(me.latitude,me.longitude,m.lat,m.lng)+" · "+ago(m.updated_at)):("Sharing · "+ago(m.updated_at)+" · share your location to see the distance");
          nav='<a class="pill on" target="_blank" rel="noopener" style="text-decoration:none" href="https://www.google.com/maps/dir/?api=1&travelmode=walking&destination='+m.lat+','+m.lng+'">Navigate</a>';
        }
        h+='<div class="lcard"><div class="lrow"><div><h4>'+esc(m.name||"Friend")+'</h4><p class="small">'+esc(line)+'</p></div>'+nav+'</div></div>';
      });
      h+='<button class="linkbtn" id="fdLeave">Leave this group</button>';
    }
    root.innerHTML=h;
    var $=function(s){return root.querySelector(s)};
    if($("#fdLog"))$("#fdLog").onclick=function(){closeSheet();setTimeout(function(){var b=document.querySelector(".np-hbtn.user");if(b)b.click()},300)};
    if($("#fdNew"))$("#fdNew").onclick=async function(){this.disabled=true;var e=await join(genCode());if(e)alert(e)};
    if($("#fdJoin"))$("#fdJoin").onclick=async function(){var e=await join($("#fdIn").value);if(e)$("#fdE").textContent=e};
    if($("#fdStart"))$("#fdStart").onclick=startShare;
    if($("#fdStop"))$("#fdStop").onclick=stopShare;
    if($("#fdLeave"))$("#fdLeave").onclick=function(){if(confirm("Leave this group?"))leave()};
  }

  var tab="find",bills=[],bchan=null,bchanCode="";
  function B(n){n=Math.round(Number(n)||0);return "฿"+n.toLocaleString("en-US")}
  function inr(n){var r=(typeof INR_PER_THB!=="undefined")?INR_PER_THB:2.6;return "₹"+Math.round((Number(n)||0)*r).toLocaleString("en-IN")}
  async function loadBills(){
    if(!user||!code){renderBills();return}
    var m=await sb.from("np_finder").select("user_id,name").eq("code",code);members=m.data||members;
    var b=await sb.from("np_group_bills").select("*").eq("code",code).order("created_at",{ascending:false});bills=b.data||[];
    if(bchanCode!==code){if(bchan)sb.removeChannel(bchan);bchanCode=code;
      bchan=sb.channel("bills-"+code).on("postgres_changes",{event:"*",schema:"public",table:"np_group_bills",filter:"code=eq."+code},loadBills).subscribe()}
    renderBills();
  }
  function nameOf(id){if(user&&id===user.id)return "You";var m=members.find(function(x){return x.user_id===id});return m?(m.name||"Friend"):"Friend"}
  function settle(){
    var net={};members.forEach(function(m){net[m.user_id]=0});
    bills.forEach(function(b){var sw=b.split_with||[];if(!sw.length)return;var share=Number(b.amount)/sw.length;
      net[b.paid_by]=(net[b.paid_by]||0)+Number(b.amount);sw.forEach(function(u){net[u]=(net[u]||0)-share})});
    var cr=[],db=[];Object.keys(net).forEach(function(u){var v=Math.round(net[u]);if(v>0)cr.push([u,v]);else if(v<0)db.push([u,-v])});
    var out=[];cr.sort(function(a,b){return b[1]-a[1]});db.sort(function(a,b){return b[1]-a[1]});
    var i=0,j=0;while(i<db.length&&j<cr.length){var x=Math.min(db[i][1],cr[j][1]);if(x>0)out.push([db[i][0],cr[j][0],x]);db[i][1]-=x;cr[j][1]-=x;if(db[i][1]<=0)i++;if(cr[j][1]<=0)j++}
    return out;
  }
  function renderBills(){
    var root=document.getElementById("bsRoot");if(!root)return;
    if(!user){root.innerHTML='<p class="about">Log in first to split bills with your group.</p>';return}
    if(!code){root.innerHTML='<p class="about">Start or join a group in <b>Friends location</b> first. Then everyone in the group can add and split bills here.</p><button class="cta" id="bsGo">Go to Friends location</button>';
      root.querySelector("#bsGo").onclick=function(){tab="find";show()};return}
    var total=bills.reduce(function(s,b){return s+Number(b.amount)},0),st=settle(),myN=(user.user_metadata||{}).name||"Me";
    var h='<div class="lcard hl"><span class="k">GROUP '+esc(code)+'</span><h4>Total spent: '+B(total)+' <span class="small">('+inr(total)+')</span></h4><p class="small">'+members.length+' people in this group</p></div>'+
      '<h3 style="font-size:16px;margin:14px 0 8px">Add an expense</h3>'+
      '<div class="fields"><label class="full">What for<input id="bsW" placeholder="e.g. Table at Jalwa"></label>'+
      '<label>Amount (฿)<input id="bsA" inputmode="decimal" placeholder="6000"></label>'+
      '<label>Paid by<select id="bsP">'+members.map(function(m){return '<option value="'+m.user_id+'"'+(m.user_id===user.id?' selected':'')+'>'+esc(nameOf(m.user_id))+'</option>'}).join("")+'</select></label></div>'+
      '<p class="small" style="margin:8px 0 0">Split between</p><div class="chkl">'+members.map(function(m){return '<label><input type="checkbox" class="bsS" value="'+m.user_id+'" checked> '+esc(nameOf(m.user_id))+'</label>'}).join("")+'</div>'+
      '<button class="cta" id="bsAdd">Add expense</button><p class="err" id="bsE"></p>'+
      '<h3 style="font-size:16px;margin:16px 0 8px">Who owes whom</h3>'+
      (st.length?st.map(function(s){return '<div class="lcard"><div class="lrow"><span>'+esc(nameOf(s[0]))+' pays '+esc(nameOf(s[1]))+'</span><span class="bsamt">'+B(s[2])+'</span></div></div>'}).join("")+
        '<a class="pill on" style="display:inline-block;text-decoration:none;margin-top:4px" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent("Bill split ("+code+"), total "+B(total)+":\n"+st.map(function(s){return nameOf(s[0]).replace("You",myN)+" pays "+nameOf(s[1]).replace("You",myN)+" "+B(s[2])}).join("\n"))+'">Share on WhatsApp</a>'
        :'<p class="small">All settled. Nobody owes anything.</p>')+
      '<h3 style="font-size:16px;margin:16px 0 8px">Expenses</h3>'+
      (bills.length?bills.map(function(b){return '<div class="lcard"><div class="lrow"><div style="min-width:0"><h4>'+esc(b.what)+'</h4><p class="small">Paid by '+esc(nameOf(b.paid_by))+' · split '+(b.split_with||[]).length+' ways</p></div><span class="bsamt">'+B(b.amount)+'</span></div>'+
        (b.added_by===user.id?'<button class="linkbtn" data-del="'+b.id+'">Delete</button>':'')+'</div>'}).join(""):'<p class="small">No expenses yet.</p>');
    root.innerHTML=h;
    root.querySelector("#bsAdd").onclick=async function(){
      var E=root.querySelector("#bsE"),w=root.querySelector("#bsW").value.trim(),a=parseFloat(root.querySelector("#bsA").value.replace(/,/g,"")),p=root.querySelector("#bsP").value;
      var sw=[].map.call(root.querySelectorAll(".bsS:checked"),function(x){return x.value});
      if(!w){E.textContent="Say what the expense is for.";return}
      if(!(a>0)){E.textContent="Enter the amount in baht.";return}
      if(!sw.length){E.textContent="Pick at least one person to split with.";return}
      this.disabled=true;
      var r=await sb.from("np_group_bills").insert({code:code,what:w,amount:a,paid_by:p,split_with:sw});
      this.disabled=false;
      if(r.error){E.textContent=r.error.message;return}
      loadBills();
    };
    root.querySelectorAll("[data-del]").forEach(function(b){b.onclick=async function(){if(!confirm("Delete this expense?"))return;await sb.from("np_group_bills").delete().eq("id",b.dataset.del);loadBills()}});
  }

  function show(){
    var fd=document.getElementById("fdRoot"),bs=document.getElementById("bsRoot");if(!fd||!bs)return;
    document.querySelectorAll(".fbtabs [data-t]").forEach(function(b){b.setAttribute("aria-selected",b.dataset.t===tab)});
    fd.hidden=tab!=="find";bs.hidden=tab!=="bill";
    if(tab==="bill")loadBills();else load();
  }
  function openBoth(which){
    tab=which||tab;
    panel.innerHTML='<div class="fbhead"><h2 id="sheetTitle">'+TITLE+'</h2><button class="theme" id="fbX" aria-label="Close">'+ico("close")+'</button></div>'+
      '<div class="fbtabs" role="tablist"><button role="tab" data-t="find">Friends location</button><button role="tab" data-t="bill">Bill splitter</button></div>'+
      '<div class="pbody" id="fdRoot"></div><div class="pbody" id="bsRoot"></div>';
    panel.querySelector("#fbX").onclick=closeSheet;
    panel.querySelectorAll(".fbtabs [data-t]").forEach(function(b){b.onclick=function(){tab=b.dataset.t;show()}});
    sheet.classList.add("open");document.body.style.overflow="hidden";panel.scrollTop=0;
    render();show();
  }
  window.openFinder=function(){openBoth()};

  if(location.hash.indexOf("#find/")===0)pending=location.hash.slice(6);
  async function onUser(u){
    user=u;
    if(!u){stopShare();return}
    if(pending){var c=pending;pending="";await join(c);openBoth("find")}
    else if(code)subscribe();
  }
  sb.auth.getSession().then(function(r){onUser(r.data.session?r.data.session.user:null);if(!r.data.session&&pending)openBoth("find")});
  sb.auth.onAuthStateChange(function(e,s){var u=s?s.user:null;if((u&&u.id)!==(user&&user.id))onUser(u)});
})();

/* ===== service names (on screen); Skydiving removed ===== */
(function(){
  try{
    if(typeof CATS!=="undefined")for(var i=CATS.length-1;i>=0;i--)if(CATS[i][0]==="skydiving")CATS.splice(i,1);
    if(typeof TYPES!=="undefined"){var ti=TYPES.indexOf("Skydiving");if(ti>-1)TYPES.splice(ti,1)}
    if(typeof COMMISSION_CATS!=="undefined"){var ci=COMMISSION_CATS.indexOf("skydiving");if(ci>-1)COMMISSION_CATS.splice(ci,1)}
    if(typeof CATNAME!=="undefined")delete CATNAME.skydiving;
  }catch(e){}
  var REN={"Golf":"Golf & Shooting Range","Shopping & Markets":"Namaste Shopping","Event & Party Planning":"Events, Groups & Gala Parties","Desi Chai & Spices":"Indian Groceries","Chai & Spices":"Indian Groceries","Desi Chai and Spices":"Indian Groceries"};
  function fixText(el){[].forEach.call(el.childNodes,function(n){if(n.nodeType===3){var t=n.textContent.trim();if(REN[t])n.textContent=REN[t]}})}
  function fix(){
    document.querySelectorAll("#cats .cat, #chips .chip, #mapCat option, #svcPage h2, #svcPage h3").forEach(fixText);
    /* Skydiving removed: take away any Skydiving tile, chip or option added earlier */
    document.querySelectorAll("#cats .cat, #chips .chip, #mapCat option").forEach(function(el){if(el.textContent.trim()==="Skydiving")el.remove()});
  }
  var busy=false;
  new MutationObserver(function(){if(busy)return;busy=true;requestAnimationFrame(function(){busy=false;fix()})})
    .observe(document.body,{childList:true,subtree:true});
  fix();
})();

/* ===== home: Namaste Gold (Meet new people) + Friends Location & Bill Splitter for everyone ===== */
(function(){
  function vip(){try{return typeof isVIP==="function"&&!!isVIP()}catch(e){return false}}
  function css(){
    if(document.getElementById("npGoldCss"))return;
    var st=document.createElement("style");st.id="npGoldCss";
    st.textContent='.gperks{margin:12px 0 0;padding:0;list-style:none}.gperks li{display:flex;gap:8px;align-items:flex-start;padding:6px 0;font-size:14px;color:var(--ink)}.gperks li::before{content:"";flex:0 0 8px;height:8px;margin-top:7px;border-radius:50%;background:linear-gradient(135deg,#FFF1C6,#B9904A)}'+
      '.gshoot{width:100%;margin-top:8px;border:1px solid rgba(233,216,166,.5);border-radius:999px;padding:11px;background:transparent;color:#E9D8A6;font-weight:600}'+
      '.npflb{width:100%;margin:0 0 24px}.npflb .hubtile{width:100%}';
    document.head.appendChild(st);
  }
  function run(){
    css();
    var ga=document.querySelector(".goldarea");
    if(ga){
      var b=ga.querySelector('[data-g="buddy"]');
      if(b){b.querySelector("b").textContent="Meet new people";b.querySelector("small").textContent="Unlimited likes and swipes, shown first"}
      var d=ga.querySelector('[data-g="dating"]');if(d)d.hidden=true;
      var f=ga.querySelector('[data-g="friend"]');if(f)f.hidden=true;
      var gt=ga.querySelector(".gtiles");if(gt)gt.style.gridTemplateColumns="1fr";
      var gp=ga.querySelector(".gtop p");if(gp)gp.textContent="Premium access for our most valued guests.";
      if(!ga.querySelector(".gperks")){
        var ul=document.createElement("ul");ul.className="gperks";
        ul.innerHTML='<li>Unlimited likes and swipes in Meet new people, and your profile shown first</li>'+
          '<li>All Elite packages</li>'+
          '<li>Elite and luxury services (yacht, private jet, VIP concierge) with priority booking</li>'+
          '<li>One luxury photo and video shoot every month with our photographer</li>';
        (gt||ga).insertAdjacentElement("afterend",ul);
        var sh=document.createElement("button");sh.className="gshoot";sh.id="npShoot";
        ul.insertAdjacentElement("afterend",sh);
        sh.onclick=shoot;
      }
      paintShoot();
    }
    /* Friends Location & Bill Splitter: for everyone, its own tile under the gold area */
    if(ga&&!document.getElementById("npFLB")){
      var w=document.createElement("div");w.className="npflb";w.id="npFLB";
      w.innerHTML='<button class="hubtile">'+(typeof ico==="function"?'<span>'+ico("map")+'</span>':'')+'<b>Friends Location &amp; Bill Splitter</b><small>Free for everyone · find your group and share costs</small></button>';
      ga.insertAdjacentElement("afterend",w);
      w.querySelector("button").onclick=function(){if(typeof window.openFinder==="function")openFinder()};
    }
    var ht=document.querySelector('.hubtile[data-go="buddy"]');
    if(ht){var hb=ht.querySelector("b"),hs=ht.querySelector("small");if(hb)hb.textContent="Meet new people";if(hs)hs.textContent="Social meetups, safely"}
    var stt=document.querySelector("#buddy .sectiontitle");if(stt)stt.textContent="Meet new people";
    var ph=document.querySelector("#npPurpose h4");if(ph)ph.textContent="Meet new people is a social feature";
    var fb=document.getElementById("npFindBtn");if(fb)fb.textContent="Friends Location & Bill Splitter";
  }
  /* monthly luxury shoot for Gold members */
  function month(){var d=new Date();return d.getFullYear()+"-"+(d.getMonth()+1)}
  function paintShoot(){
    var sh=document.getElementById("npShoot");if(!sh)return;
    var done=false;try{done=localStorage.getItem("np_shoot_month")===month()}catch(e){}
    sh.textContent=!vip()?"Monthly luxury shoot · Gold members":(done?"This month's luxury shoot is booked":"Book my luxury shoot this month");
    sh.disabled=vip()&&done;
  }
  function shoot(){
    if(!vip()){var p=document.getElementById("premBtn");if(p)p.click();return}
    try{if(localStorage.getItem("np_shoot_month")===month())return}catch(e){}
    if(typeof bookings!=="undefined"&&typeof store!=="undefined"){
      var who="";try{who=(JSON.parse(localStorage.getItem("np_buddy")||"null")||{}).name||""}catch(e){}
      bookings.unshift({code:"NP"+Math.random().toString(36).slice(2,7).toUpperCase(),club:"vip",pkg:"Monthly luxury photo and video shoot (Gold)",guests:1,date:new Date().toISOString(),time:"To be planned",name:who||"Gold member",phone:"",total:0,cat:"concierge"});
      store.set("np_bookings",bookings);
      if(typeof renderBookings==="function")try{renderBookings()}catch(e){}
    }
    try{localStorage.setItem("np_shoot_month",month())}catch(e){}
    alert("Your luxury shoot request is in. Our team will contact you to plan the date and place.");
    paintShoot();
  }
  run();window.addEventListener("load",run);setTimeout(run,1500);setTimeout(paintShoot,3000);
})();

/* ===== Meet new people: 10 free likes/swipes per 24 hours, unlimited for Gold ===== */
(function(){
  var LIM=10,KEY="np_swipes",DAY=864e5;
  function vip(){try{return typeof isVIP==="function"&&!!isVIP()}catch(e){return false}}
  function used(){var a=[];try{a=JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){}var n=Date.now();return a.filter(function(t){return n-t<DAY})}
  function add(){var a=used();a.push(Date.now());try{localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}}
  function left(){return vip()?Infinity:Math.max(0,LIM-used().length)}
  function hoursLeft(){var a=used();if(!a.length)return 0;return Math.max(1,Math.ceil((DAY-(Date.now()-a[0]))/36e5))}
  function counter(){
    var sw=document.querySelector(".swbtns");if(!sw)return;
    var c=document.getElementById("npLikes");
    if(!c){c=document.createElement("p");c.id="npLikes";c.className="small";c.style.cssText="text-align:center;margin:0 0 10px";sw.insertAdjacentElement("afterend",c)}
    c.textContent=vip()?"Gold member · unlimited likes and swipes · shown first":("Free likes and swipes left today: "+left()+" of "+LIM+" · Gold = unlimited");
  }
  function blockMsg(){
    if(typeof panel==="undefined")return;
    panel.innerHTML='<div class="pbody"><div style="display:flex;justify-content:space-between;align-items:center"><h2 id="sheetTitle" style="font-size:20px">Daily limit reached</h2><button class="theme" id="lmX" aria-label="Close">'+(typeof ico==="function"?ico("close"):"×")+'</button></div>'+
      '<p class="about">You have used your '+LIM+' free likes and swipes. More in about '+hoursLeft()+' hours.</p>'+
      '<p class="about">Namaste Gold members get unlimited likes and swipes, and are shown first.</p>'+
      '<button class="cta" id="lmGold">Become a Gold member</button></div>';
    panel.querySelector("#lmX").onclick=closeSheet;
    panel.querySelector("#lmGold").onclick=function(){closeSheet();setTimeout(function(){var p=document.getElementById("premBtn");if(p)p.click()},300)};
    sheet.classList.add("open");document.body.style.overflow="hidden";
  }
  if(typeof decide==="function"){
    var _d=decide;
    decide=function(p,yes,card){
      if(!vip()&&left()<=0){if(card){card.style.transform=""}blockMsg();counter();return}
      if(!vip())add();
      _d(p,yes,card);counter();
    };
  }
  var people=document.getElementById("people");
  if(people)people.addEventListener("click",function(e){
    var j=e.target.closest&&e.target.closest(".join");if(!j||/chat/i.test(j.textContent))return;
    if(!vip()&&left()<=0){e.stopImmediatePropagation();e.preventDefault();blockMsg();return}
    if(!vip())add();setTimeout(counter,50);
  },true);
  if(typeof renderSwipe==="function"){var _rs=renderSwipe;renderSwipe=function(){_rs();counter()}}
  counter();setTimeout(counter,1500);
})();

/* ===== Elite package: Gold members only ===== */
(function(){
  function vip(){try{return typeof isVIP==="function"&&!!isVIP()}catch(e){return false}}
  function gate(){
    if(typeof pSel==="undefined"||pSel!=="elite"||vip())return;
    var el=document.getElementById("pbuild");if(!el)return;
    var req=el.querySelector("#pReq");if(!req||req.dataset.np)return;
    req.dataset.np="1";req.textContent="Gold members only · Become Gold";
    req.onclick=function(){var p=document.getElementById("premBtn");if(p)p.click()};
    var n=document.createElement("p");n.className="small";n.style.color="var(--amber)";
    n.textContent="The Elite package is included for Namaste Gold members.";
    req.insertAdjacentElement("beforebegin",n);
  }
  if(typeof renderPackages==="function"){var _rp=renderPackages;renderPackages=function(){_rp();gate()}}
  gate();
})();

/* ===== Raju Guide: real AI (Gemini) through the Supabase "raju" function; old Raju stays as backup ===== */
(function(){
  if(typeof ask!=="function"||!window.supabase)return;
  var sb=window.supabase.createClient("https://mymtgbmcjbwsnetzwgoy.supabase.co","sb_publishable_ViFodxG8kAENr78Fyp-BwQ_iA_BfAD0");
  var CRISIS=/suicid|kill myself|end my life|want to die|self.?harm|hopeless|unsafe|follow(ing|ed)? me|harass|attack|spiked|drugged|rape|assault|kidnap|emergency|accident|injur|bleed|unconscious|chest pain|overdose|passport|stolen|robbed/i;
  var hist=[];
  function venues(){
    if(typeof CLUBS==="undefined")return "";
    return CLUBS.map(function(c){var paid=(c.pkgs||[]).map(function(p){return p.p}).filter(Boolean),from=paid.length?Math.min.apply(null,paid):0;
      return [c.id,c.name,c.cat,c.area,c.open,c.music||c.sub||"",from||"on request",c.type||""].join("|")}).join("\n");
  }
  var _ask=ask;
  ask=async function(q){
    var t=String(q||"").trim();
    if(!t||CRISIS.test(t)||typeof localAnswer!=="function")return _ask(q);
    var typing=document.createElement("div");typing.className="msg bot";typing.textContent="Raju is typing…";
    if(typeof chatEl!=="undefined"){chatEl.appendChild(typing);typing.scrollIntoView({block:"end"})}
    var res=null;
    try{
      var lang="en";try{lang=localStorage.getItem("np_lang")||"en"}catch(e){}
      var call=sb.functions.invoke("bright-responder",{body:{messages:hist.concat([{role:"user",text:t}]),venues:venues(),lang:lang}});
      var timeout=new Promise(function(ok){setTimeout(function(){ok({error:"timeout"})},15000)});
      var r=await Promise.race([call,timeout]);
      if(r&&!r.error&&r.data&&r.data.reply)res=r.data;
    }catch(e){}
    typing.remove();
    if(!res){try{return await _ask(q)}catch(e){if(typeof addMsg==="function")addMsg("bot","Sorry bhai, my network is slow right now. Please ask me again in a moment.");return}}
    var ids=(res.ids||[]).filter(function(id){return typeof CLUBS!=="undefined"&&CLUBS.some(function(c){return c.id===id})});
    hist.push({role:"user",text:t},{role:"model",text:res.reply});window.__npLastReply=res.reply;if(hist.length>12)hist=hist.slice(-12);
    var old=localAnswer;localAnswer=function(){return {text:res.reply,ids:ids}};
    try{await _ask(q)}finally{localAnswer=old}
  };
})();

/* ===== Aurora AI for everyone; only Namaste Gold (premium) members can choose other app colours ===== */
(function(){
  function premium(){try{return (typeof isVIP==="function"&&!!isVIP())||(typeof isPremium==="function"&&!!isPremium())}catch(e){return false}}
  function auroraKey(){
    if(typeof SKINS==="undefined")return null;
    for(var i=0;i<SKINS.length;i++){var s=SKINS[i];if(/aurora/i.test(String(s[0])+" "+String(s[1])))return s[0]}
    return null;
  }
  var k=auroraKey();if(!k)return;
  function apply(){
    if(document.documentElement.dataset.skin===k)return;
    if(typeof applySkin==="function"){try{applySkin(k);return}catch(e){}}
    document.documentElement.dataset.skin=k;
  }
  function enforce(){
    if(premium()){
      var chosen=null;try{chosen=localStorage.getItem("np_skin_user")}catch(e){}
      if(!chosen)apply();
    }else apply();
  }
  enforce();window.addEventListener("load",enforce);setTimeout(enforce,1500);setTimeout(enforce,4000);
  /* normal users: the App colours screen becomes a Gold perk */
  if(typeof panel!=="undefined")new MutationObserver(function(){
    if(premium())return;
    if(!panel.querySelector(".pskin")||panel.querySelector("#npSkinGold"))return;
    panel.innerHTML='<div class="pbody" id="npSkinGold"><div style="display:flex;justify-content:space-between;align-items:center"><h2 id="sheetTitle" style="font-size:20px">App colours</h2><button class="theme" id="skX" aria-label="Close">'+(typeof ico==="function"?ico("close"):"×")+'</button></div>'+
      '<p class="about">Your app uses the Aurora AI look.</p><p class="about">Choosing your own app colours is a Namaste Gold perk.</p>'+
      '<button class="cta" id="skGold">Become a Gold member</button></div>';
    panel.querySelector("#skX").onclick=closeSheet;
    panel.querySelector("#skGold").onclick=function(){closeSheet();setTimeout(function(){var b=document.getElementById("premBtn");if(b)b.click()},300)};
    enforce();
  }).observe(panel,{childList:true,subtree:true});
  /* add the perk to the Gold list */
  function perk(){var ul=document.querySelector(".gperks");if(ul&&!ul.querySelector("[data-np-skin]")){var li=document.createElement("li");li.dataset.npSkin="1";li.textContent="Choose your own app colours";ul.appendChild(li)}}
  perk();setTimeout(perk,1600);
})();


/* ===== Raju voice mode: speak to Raju (mic) and hear his answers (speaker). Uses the phone's own voice, free. ===== */
(function(){
  if(typeof ask!=="function")return;
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition,TTS=window.speechSynthesis;
  var LANGS={en:"en-IN",hi:"hi-IN",pa:"pa-IN",gu:"gu-IN",ta:"ta-IN",mr:"mr-IN",th:"th-TH"};
  var voiceOn=false,fromMic=false,rec=null;
  try{voiceOn=localStorage.getItem("np_raju_voice")==="1"}catch(e){}
  function appLang(){var l="en";try{l=localStorage.getItem("np_lang")||"en"}catch(e){}return LANGS[l]||"en-IN"}
  function detect(t){
    if(/[\u0E00-\u0E7F]/.test(t))return "th-TH";
    if(/[\u0A00-\u0A7F]/.test(t))return "pa-IN";
    if(/[\u0A80-\u0AFF]/.test(t))return "gu-IN";
    if(/[\u0B80-\u0BFF]/.test(t))return "ta-IN";
    if(/[\u0900-\u097F]/.test(t))return appLang()==="mr-IN"?"mr-IN":"hi-IN";
    return "en-IN";
  }
  var MALE=/male|\bman\b|rishi|hemant|madhur|ravi|prabhat|kiran|arjun|aarav|niranjan|valluvar|mohan|hid-|hie-|end-|enm-|ene-/i;
  var FEMALE=/female|woman|lekha|veena|swara|kalpana|heera|priya|neerja|aditi|ananya|sapna|pooja|premwadee|kanya|hia-|hic-/i;
  function voicesFor(lang){var vs=(TTS&&TTS.getVoices())||[];var ex=vs.filter(function(x){return x.lang&&x.lang.replace("_","-").toLowerCase()===lang.toLowerCase()});return ex.length?ex:vs.filter(function(x){return x.lang&&x.lang.slice(0,2).toLowerCase()===lang.slice(0,2)})}
  function pickVoice(lang){
    var list=voicesFor(lang);if(!list.length)return null;
    var saved=null;try{saved=localStorage.getItem("np_raju_voice_"+lang.slice(0,2))}catch(e){}
    if(saved){var s0=list.find(function(x){return x.name===saved});if(s0)return s0}
    return list.find(function(x){return MALE.test(x.name)})||list.find(function(x){return !FEMALE.test(x.name)&&x.localService!==false})||list.find(function(x){return !FEMALE.test(x.name)})||list[0];
  }
  function speak(t,forceLang){
    if(!TTS||!t)return;
    try{
      TTS.cancel();
      var clean=String(t).replace(/[*_#>`]/g,"").replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,"");
      var u=new SpeechSynthesisUtterance(clean);u.lang=forceLang||detect(clean);
      var v=pickVoice(u.lang);if(v)u.voice=v;
      var male=v&&MALE.test(v.name);
      u.pitch=male?0.95:0.8;   /* deeper voice when the phone has no male voice */
      u.rate=0.95;             /* a little slower = clearer */
      TTS.speak(u);
    }catch(e){}
  }
  /* let the user choose Raju's voice: each tap on the voice button tries the next voice */
  function nextVoice(btn){
    var lang=appLang(),list=voicesFor(lang);
    if(!list.length){alert("This phone has no voice for this language. Add one in the phone's Text-to-speech settings.");return}
    var cur=pickVoice(lang),i=list.indexOf(cur),nx=list[(i+1)%list.length];
    try{localStorage.setItem("np_raju_voice_"+lang.slice(0,2),nx.name)}catch(e){}
    btn.title="Voice "+((i+1)%list.length+1)+" of "+list.length;
    speak(lang==="hi-IN"?"Namaste bhai, main Raju hoon. Kya ye awaaz theek hai?":"Namaste, I am Raju. Does this voice sound good?",lang);
  }
  function lastBotText(){
    if(typeof chatEl==="undefined")return "";
    var kids=[].slice.call(chatEl.children).reverse();
    for(var i=0;i<kids.length;i++){var k=kids[i];if(/bot|raju|them/i.test(k.className)&&k.textContent.trim()&&!/typing/i.test(k.textContent))return k.textContent.trim()}
    return "";
  }
  var _ask=ask;
  ask=async function(q){
    window.__npLastReply=null;
    var r=await _ask(q);
    if(voiceOn||fromMic){setTimeout(function(){speak(window.__npLastReply||lastBotText())},200)}
    fromMic=false;
    return r;
  };
  var MIC='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
  var SPK_ON='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/></svg>';
  var SPK_OFF='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';
  if(!document.getElementById("npVoiceCss")){
    var st=document.createElement("style");st.id="npVoiceCss";
    st.textContent='.npvbtn{flex:0 0 auto;width:48px;height:48px;border-radius:50%;border:1px solid var(--line,rgba(255,255,255,.2));background:var(--surface,rgba(255,255,255,.06));color:var(--ink,#fff);display:inline-flex;align-items:center;justify-content:center;margin:0 4px;cursor:pointer}.npvbtn.on{border-color:#FF8A2A;color:#FF8A2A}.npvbtn.rec{background:#E5484D;color:#fff;border-color:#E5484D;animation:npvp 1s infinite}@keyframes npvp{50%{box-shadow:0 0 0 8px rgba(229,72,77,.25)}}';
    document.head.appendChild(st);
  }
  function attach(){
    var inp=document.querySelector('input[placeholder*="Hindi bhi"],input[placeholder^="Ask anything"],textarea[placeholder^="Ask anything"]');
    if(!inp||inp.dataset.npVoice)return;
    inp.dataset.npVoice="1";
    var mic=document.createElement("button");mic.type="button";mic.className="npvbtn";mic.setAttribute("aria-label","Talk to Raju");mic.innerHTML=MIC;
    var spk=document.createElement("button");spk.type="button";spk.className="npvbtn"+(voiceOn?" on":"");spk.setAttribute("aria-label","Raju reads answers aloud");spk.innerHTML=voiceOn?SPK_ON:SPK_OFF;
    var vb=document.createElement("button");vb.type="button";vb.className="npvbtn";vb.setAttribute("aria-label","Change Raju's voice");vb.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="8" r="4"/><path d="M3 21c0-4 3-6 6-6s6 2 6 6M17 7a4 4 0 0 1 0 6M20 5a7 7 0 0 1 0 10"/></svg>';
    vb.onclick=function(){nextVoice(vb)};
    inp.insertAdjacentElement("afterend",vb);inp.insertAdjacentElement("afterend",spk);inp.insertAdjacentElement("afterend",mic);
    spk.onclick=function(){
      voiceOn=!voiceOn;try{localStorage.setItem("np_raju_voice",voiceOn?"1":"0")}catch(e){}
      spk.className="npvbtn"+(voiceOn?" on":"");spk.innerHTML=voiceOn?SPK_ON:SPK_OFF;
      if(!voiceOn&&TTS)TTS.cancel();else speak(appLang()==="hi-IN"?"नमस्ते! अब मैं बोलकर जवाब दूँगा।":"Namaste! I will read my answers out loud now.");
    };
    mic.onclick=function(){
      if(!SR){alert("Voice typing doesn't work in this browser. Please use Chrome.");return}
      if(rec){rec.stop();return}
      if(TTS)TTS.cancel();
      var ph=inp.placeholder,finalText="";
      rec=new SR();rec.lang=appLang();rec.interimResults=true;rec.maxAlternatives=1;
      mic.classList.add("rec");inp.placeholder="Listening… speak now";
      rec.onresult=function(e){var t="";for(var i=0;i<e.results.length;i++)t+=e.results[i][0].transcript;inp.value=t;if(e.results[e.results.length-1].isFinal)finalText=t};
      rec.onerror=function(e){if(e.error==="not-allowed")alert("Please allow the microphone for this app to talk to Raju.")};
      rec.onend=function(){mic.classList.remove("rec");inp.placeholder=ph;rec=null;
        var t=(finalText||inp.value).trim();if(t){inp.value="";fromMic=true;ask(t)}};
      try{rec.start()}catch(e){mic.classList.remove("rec");inp.placeholder=ph;rec=null}
    };
  }
  var busy=false;
  new MutationObserver(function(){if(busy)return;busy=true;requestAnimationFrame(function(){busy=false;attach()})}).observe(document.body,{childList:true,subtree:true});
  attach();
  if(TTS&&TTS.onvoiceschanged!==undefined)TTS.onvoiceschanged=function(){};
})();

/* ===== Passwords: "Change password" when logged in, "Forgot password?" on the login screen, and the reset link from email ===== */
(function(){
  if(!window.supabase||typeof panel==="undefined")return;
  var sb=window.supabase.createClient("https://mymtgbmcjbwsnetzwgoy.supabase.co","sb_publishable_ViFodxG8kAENr78Fyp-BwQ_iA_BfAD0");
  function X(){return typeof ico==="function"?ico("close"):"×"}
  function openSheet(html){
    panel.innerHTML='<div class="pbody" id="npPw">'+html+'</div>';
    sheet.classList.add("open");document.body.style.overflow="hidden";panel.scrollTop=0;
    var x=panel.querySelector("#pwX");if(x)x.onclick=closeSheet;
  }
  function form(title,intro){
    openSheet('<div style="display:flex;justify-content:space-between;align-items:center"><h2 id="sheetTitle" style="font-size:20px">'+title+'</h2><button class="theme" id="pwX" aria-label="Close">'+X()+'</button></div>'+
      '<p class="about">'+intro+'</p><div class="fields">'+
      '<label class="full">New password<input id="pw1" type="password" autocomplete="new-password" placeholder="At least 8 characters"></label>'+
      '<label class="full">Type it again<input id="pw2" type="password" autocomplete="new-password"></label></div>'+
      '<button class="cta" id="pwSave">Save new password</button><p class="err" id="pwE"></p>');
    panel.querySelector("#pwSave").onclick=async function(){
      var a=panel.querySelector("#pw1").value,b=panel.querySelector("#pw2").value,E=panel.querySelector("#pwE");
      if(a.length<8){E.textContent="Use at least 8 characters, with letters and numbers.";return}
      if(!/[a-z]/i.test(a)||!/\d/.test(a)){E.textContent="Use both letters and numbers.";return}
      if(a!==b){E.textContent="The two passwords are different.";return}
      this.disabled=true;
      var r=await sb.auth.updateUser({password:a});
      this.disabled=false;
      if(r.error){E.textContent=r.error.message;return}
      openSheet('<div style="display:flex;justify-content:space-between;align-items:center"><h2 id="sheetTitle" style="font-size:20px">Password changed</h2><button class="theme" id="pwX" aria-label="Close">'+X()+'</button></div><p class="about">Your new password is saved. Use it next time you log in.</p>');
    };
  }
  window.npChangePassword=function(){form("Change password","Choose a new password for your account.")};
  /* reset link from email opens the app here */
  sb.auth.onAuthStateChange(function(ev){if(ev==="PASSWORD_RECOVERY")setTimeout(function(){form("Set a new password","Welcome back. Choose a new password for your account.")},400)});
  function forgot(emailInput){
    var em=(emailInput&&emailInput.value||"").trim();
    openSheet('<div style="display:flex;justify-content:space-between;align-items:center"><h2 id="sheetTitle" style="font-size:20px">Forgot password</h2><button class="theme" id="pwX" aria-label="Close">'+X()+'</button></div>'+
      '<p class="about">Enter your email. We will send you a link to choose a new password.</p><div class="fields"><label class="full">Email<input id="fpE" type="email" autocomplete="email" value="'+em.replace(/"/g,"")+'"></label></div>'+
      '<button class="cta" id="fpGo">Send reset link</button><p class="err" id="fpMsg"></p>');
    panel.querySelector("#fpGo").onclick=async function(){
      var e=panel.querySelector("#fpE").value.trim(),M=panel.querySelector("#fpMsg");
      if(!/^\S+@\S+\.\S+$/.test(e)){M.textContent="Please enter a valid email.";return}
      this.disabled=true;
      var r=await sb.auth.resetPasswordForEmail(e,{redirectTo:location.origin+location.pathname});
      this.disabled=false;
      M.style.color="var(--ok)";M.textContent=r.error?"":"If this email has an account, the reset link is on its way. Check your inbox and spam folder.";
      if(r.error){M.style.color="";M.textContent=r.error.message}
    };
  }
  /* add the buttons to the existing account and login screens */
  var busy=false;
  new MutationObserver(function(){
    if(busy)return;busy=true;requestAnimationFrame(function(){busy=false;
      if(panel.querySelector("#npPw"))return;
      var btns=[].slice.call(panel.querySelectorAll("button"));
      var out=btns.find(function(b){return /log ?out/i.test(b.textContent)});
      if(out&&!panel.querySelector("#npChangePw")){
        var c=document.createElement("button");c.id="npChangePw";c.className=out.className||"pill";c.textContent="Change password";
        c.style.marginRight="8px";out.insertAdjacentElement("beforebegin",c);c.onclick=function(){npChangePassword()};
      }
      var pw=panel.querySelector('input[type="password"]');
      if(pw&&!out&&!panel.querySelector("#npForgot")&&!/forgot/i.test(panel.textContent)){
        var em=panel.querySelector('input[type="email"]');
        var f=document.createElement("button");f.id="npForgot";f.type="button";f.className="linkbtn";f.textContent="Forgot password?";
        f.style.cssText="display:block;margin:8px 0 0";
        (pw.closest("label")||pw).insertAdjacentElement("afterend",f);
        f.onclick=function(){forgot(em)};
      }
    });
  }).observe(panel,{childList:true,subtree:true});
})();

/* ===== Anonymous analytics: 8 key steps, plus an "App analytics" report for admins ===== */
(function(){
  if(!window.supabase)return;
  var sb=window.supabase.createClient("https://mymtgbmcjbwsnetzwgoy.supabase.co","sb_publishable_ViFodxG8kAENr78Fyp-BwQ_iA_BfAD0");
  var sid="";try{sid=localStorage.getItem("np_sid")||"";if(!sid){sid=Math.random().toString(36).slice(2)+Date.now().toString(36);localStorage.setItem("np_sid",sid)}}catch(e){}
  var last={};
  function track(ev,detail){
    var k=ev+"|"+(detail||"");var now=Date.now();if(last[k]&&now-last[k]<3000)return;last[k]=now;
    try{sb.from("np_events").insert({event:ev,detail:detail?String(detail).slice(0,80):null,sid:sid}).then(function(){},function(){})}catch(e){}
  }
  window.npTrack=track;
  /* 1. app opened (once per visit) */
  try{if(!sessionStorage.getItem("np_open")){sessionStorage.setItem("np_open","1");track("app_open")}}catch(e){track("app_open")}
  /* 2. service opened */
  if(typeof window.openService==="function"){var _os=window.openService;window.openService=function(cat){track("service_open",cat);return _os.apply(this,arguments)};try{openService=window.openService}catch(e){}}
  /* 3. place viewed (tap on a venue card) */
  document.addEventListener("click",function(e){
    var card=e.target.closest&&e.target.closest(".art, .card, [data-id]");if(!card)return;
    var nm=card.querySelector&&card.querySelector(".name");var name=nm?nm.textContent.trim():"";
    if(!name||typeof CLUBS==="undefined")return;
    var c=CLUBS.find(function(x){return x.name===name});if(c)track("place_view",c.id);
  },true);
  /* 4. booking form opened */
  if(typeof panel!=="undefined")new MutationObserver(function(){
    if(panel.dataset.npBk)return;
    if(panel.querySelector('input[type="date"]')&&/guest|people|persons|pax/i.test(panel.textContent)){panel.dataset.npBk="1";track("booking_start")}
  }).observe(panel,{childList:true,subtree:true});
  if(typeof sheet!=="undefined")new MutationObserver(function(){if(!sheet.classList.contains("open")&&typeof panel!=="undefined")delete panel.dataset.npBk}).observe(sheet,{attributes:true,attributeFilter:["class"]});
  /* 5. booking sent */
  if(typeof store!=="undefined"&&typeof store.set==="function"){
    var _set=store.set,prev=(typeof bookings!=="undefined"&&bookings)?bookings.length:0;
    store.set=function(key,val){
      try{if(key==="np_bookings"&&Array.isArray(val)){if(val.length>prev&&val[0]&&!/Monthly luxury/.test(val[0].pkg||""))track("booking_sent",val[0].club||"");prev=val.length}}catch(e){}
      return _set.apply(this,arguments);
    };
  }
  /* 6. Raju used */
  if(typeof ask==="function"){var _a=ask;ask=function(q){track("raju_used");return _a.apply(this,arguments)}}
  /* 7. Gold tapped   8. shared */
  document.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("a,button");if(!b)return;
    if(b.id==="premBtn")track("gold_tap");
    var href=b.getAttribute&&b.getAttribute("href")||"";
    if(/wa\.me|whatsapp|share|invite|refer/i.test(href+" "+b.textContent)&&!/sharing my location|share my location|stop sharing/i.test(b.textContent)){
      var where=b.closest("section[id]");track("share",where?where.id:(document.getElementById("fdRoot")?"friends":"app"));
    }
  },true);

  /* ---- report for admins ---- */
  var isAdmin=null;
  function checkAdmin(){return sb.rpc("np_is_admin").then(function(r){isAdmin=!r.error&&r.data===true;return isAdmin},function(){isAdmin=false;return false})}
  sb.auth.onAuthStateChange(function(){isAdmin=null});
  var NAMES={app_open:"Opened the app",service_open:"Opened a service",place_view:"Viewed a place",booking_start:"Started a booking",booking_sent:"Sent a booking",raju_used:"Asked Raju",gold_tap:"Tapped Gold",share:"Shared a link"};
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  async function report(days){
    panel.innerHTML='<div class="pbody" id="npRep"><div style="display:flex;justify-content:space-between;align-items:center"><h2 id="sheetTitle" style="font-size:20px">App analytics</h2><button class="theme" id="rpX" aria-label="Close">'+(typeof ico==="function"?ico("close"):"×")+'</button></div>'+
      '<div class="chips" style="margin:10px 0"><button class="pill'+(days===1?' on':'')+'" data-d="1">Today</button> <button class="pill'+(days===7?' on':'')+'" data-d="7">7 days</button> <button class="pill'+(days===30?' on':'')+'" data-d="30">30 days</button></div><div id="rpBody"><p class="small">Loading…</p></div></div>';
    sheet.classList.add("open");document.body.style.overflow="hidden";
    panel.querySelector("#rpX").onclick=closeSheet;
    panel.querySelectorAll("[data-d]").forEach(function(b){b.onclick=function(){report(+b.dataset.d)}});
    var r=await sb.rpc("np_event_report",{days:days}),body=panel.querySelector("#rpBody");if(!body)return;
    if(r.error){body.innerHTML='<p class="err">'+esc(r.error.message)+'</p>';return}
    var tot={},ppl={},svc={},plc={};
    (r.data||[]).forEach(function(x){tot[x.event]=(tot[x.event]||0)+Number(x.n);ppl[x.event]=(ppl[x.event]||0)+Number(x.people);
      if(x.event==="service_open"&&x.detail)svc[x.detail]=(svc[x.detail]||0)+Number(x.n);
      if(x.event==="place_view"&&x.detail)plc[x.detail]=(plc[x.detail]||0)+Number(x.n)});
    var base=ppl.app_open||0;
    function row(ev){var p=ppl[ev]||0;var pc=base?Math.round(p*100/base)+"%":"";return '<div class="lrow" style="padding:10px 0;border-top:1px solid var(--line)"><span>'+NAMES[ev]+'</span><span><b>'+p+'</b> people <span class="small">'+pc+'</span></span></div>'}
    function top(obj,label){var a=Object.keys(obj).sort(function(x,y){return obj[y]-obj[x]}).slice(0,5);if(!a.length)return "";
      return '<h3 style="font-size:16px;margin:16px 0 6px">'+label+'</h3>'+a.map(function(k){return '<div class="lrow" style="padding:6px 0"><span>'+esc(k)+'</span><b>'+obj[k]+'</b></div>'}).join("")}
    var svcN={};Object.keys(svc).forEach(function(k){svcN[(typeof CATNAME!=="undefined"&&CATNAME[k])||k]=svc[k]});
    var plcN={};Object.keys(plc).forEach(function(k){var c=typeof CLUBS!=="undefined"&&CLUBS.find(function(x){return x.id===k});plcN[c?c.name:k]=plc[k]});
    body.innerHTML='<h3 style="font-size:16px;margin:6px 0">Booking journey</h3>'+["app_open","service_open","place_view","booking_start","booking_sent"].map(row).join("")+
      '<h3 style="font-size:16px;margin:16px 0 6px">Other actions</h3>'+["raju_used","gold_tap","share"].map(row).join("")+
      top(svcN,"Top services")+top(plcN,"Top places")+
      '<p class="small" style="margin-top:14px">Anonymous counts only: no names, emails or locations. "People" means different phones or browsers.</p>';
  }
  window.npReport=function(){report(7)};
  if(typeof panel!=="undefined")new MutationObserver(function(){
    if(panel.querySelector("#npRepBtn")||panel.querySelector("#npRep"))return;
    var out=[].slice.call(panel.querySelectorAll("button")).find(function(b){return /log ?out/i.test(b.textContent)});if(!out)return;
    var go=function(){if(panel.querySelector("#npRepBtn"))return;var b=document.createElement("button");b.id="npRepBtn";b.className=out.className||"pill";b.textContent="App analytics";b.style.marginRight="8px";out.insertAdjacentElement("beforebegin",b);b.onclick=function(){report(7)}};
    if(isAdmin===true)go();else if(isAdmin===null)checkAdmin().then(function(a){if(a)go()});
  }).observe(panel,{childList:true,subtree:true});
})();

/* ===== Tagline: "Bharat ke liye, ek Bhartiye ka tohfa" everywhere in the app ===== */
(function(){
  var MAP=[
    [/Bhartiyon ke liye,? ek Bhartiya ka tohfa/gi,"Bharat ke liye, ek Bhartiye ka tohfa"],
    [/भारतीयों के लिए,? एक भारतीय का तोहफ़ा/g,"भारत के लिए, एक भारतीय का तोहफ़ा"],
    [/भारतीयों के लिए,? एक भारतीय का तोहफा/g,"भारत के लिए, एक भारतीय का तोहफ़ा"]
  ];
  function fix(root){
    var w=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT,null),n;
    while((n=w.nextNode())){
      var t=n.nodeValue;if(!t||t.indexOf("tohfa")<0&&t.indexOf("तोहफ")<0&&!/Bhartiy/i.test(t))continue;
      var u=t;MAP.forEach(function(m){u=u.replace(m[0],m[1])});
      if(u!==t)n.nodeValue=u;
    }
  }
  fix();
  var busy=false;
  new MutationObserver(function(){if(busy)return;busy=true;requestAnimationFrame(function(){busy=false;fix()})}).observe(document.body,{childList:true,subtree:true,characterData:true});
})();


/* ===== Service pages: popular options & estimated prices (from the catalog list) ===== */
(function(){
  var P={"grocery":[["Premium Assam CTC Tea (500g)",280,"per item","Strong, full-bodied black tea perfect for making traditional masala chai. Available at Little India shops near Walking Street."],["Everest Garam Masala (100g)",95,"per item","Authentic spice blend imported from India. Found in grocery stores along Pattaya Second Road."],["Fresh Masala Chai Service",40,"per person","Hot, ginger-infused milk tea served at street-side stalls in the Phratamnak area."],["Basmati Rice - Premium Long Grain (5kg)",550,"per item","Aged aromatic rice suitable for biryani. Available at Indian specialty marts in Central Pattaya."],["Whole Green Cardamom (100g)",220,"per item","High-quality pods for flavoring sweets and tea. Sourced from wholesalers in South Pattaya."],["Amul Pure Ghee (1L)",750,"per item","Clarified butter essential for Indian cooking. Stocked at major Indian grocers near Beach Road."],["Haldiram's Namkeen Snacks",85,"per item","Assorted savory snacks like Bhujia and Navratan Mix. Popular item in Jomtien Indian convenience stores."],["Maggi 2-Minute Noodles (Indian Masala Flavor)",35,"per item","The classic Indian spicy instant noodle. Available at most specialty Desi shops in the city center."],["MDH Turmeric Powder (200g)",110,"per item","Pure ground turmeric for daily cooking. Found in the spice aisle of Indian markets in Naklua."]],"indian":[["Ali Baba Tandoori & Curry",1200,"avg for 2","Iconic themed restaurant with extensive North Indian menu located on Central Pattaya Road."],["Karma Indian",900,"avg for 2","Modern Indian dining with a focus on authentic spices, situated in the Pratamnak Hill area."],["Madras Darbar",600,"avg for 2","Specializing in South Indian delicacies and Biryani, located near Second Road."],["Amritsari Kulcha Corner",400,"avg for 2","Casual spot famous for authentic stuffed kulchas and North Indian street food in South Pattaya."],["Tandoori Flames",1100,"avg for 2","Premium beachfront dining experience featuring tandoori specialties on Beach Road."],["Indus Restaurant",1500,"avg for 2","Fine dining establishment offering Mughlai cuisine and elegant atmosphere in North Pattaya."],["Govindam Indian Veg Restaurant",500,"avg for 2","Pure vegetarian Indian cuisine featuring Thalis and Jain options, located in Central Pattaya."],["Chutney Indian",1300,"avg for 2","Upscale Indian dining located within the Avani Resort area, known for fusion appetizers."],["Royal India Pattaya",800,"avg for 2","Traditional North Indian favorites served in a cozy setting near Walking Street."]],"restaurants":[["Horizon Rooftop Restaurant & Bar",3500,"avg for 2","Fine dining with panoramic ocean views on the 34th floor of Hilton Pattaya, Beach Road."],["The Glass House Silver",1800,"avg for 2","Upscale beachfront dining featuring fresh seafood and international cuisine in North Pattaya (Wongamat)."],["Mum Aroi Naklua",1200,"avg for 2","Famous local seafood institution located directly on the water in the Naklua area."],["Bruno's Restaurant & Wine Bar",2500,"avg for 2","Long-standing European fine dining located in Jomtien."],["Leng Kee Restaurant",600,"avg for 2","Popular 24-hour Chinese-Thai fusion spot on Central Pattaya Road, famous for duck and seafood."],["Sugar Hut Restaurant",1500,"avg for 2","Authentic Thai cuisine served in a traditional teak wood setting surrounded by forest in Phra Tamnak Hill."],["Fat Belly Pattaya",900,"avg for 2","Cozy bistro offering high-quality comfort food in the Naklua/North Pattaya area."],["Café des Amis",4000,"avg for 2","Exclusive French fine dining and steakhouse set in a romantic garden villa off Thappraya Road."]],"hotels":[["Hilton Pattaya",8500,"per night","Luxury high-rise hotel located directly above Central Festival Mall with infinity pool and panoramic sea views in Central Pattaya."],["Grande Centre Point Space Pattaya",6200,"per night","Space-themed luxury resort featuring a massive water park and futuristic design located in North Pattaya near Terminal 21."],["Siam Bayshore Resort",3800,"per night","Tropical garden resort located at the quiet end of Walking Street, offering easy access to the nightlife and Bali Hai Pier."],["Royal Wing Suites & Spa",12500,"per night","Ultra-exclusive 5-star luxury suites with private beach access and personalized butler service located on Pratumnak Hill."],["Hard Rock Hotel Pattaya",4500,"per night","Iconic rock-themed hotel featuring a large sand-bottom pool and regular foam parties on Beach Road."],["InterContinental Pattaya Resort",7500,"per night","Upscale oceanfront resort offering private villas and a secluded atmosphere in the Phra Tamnak area."],["Holiday Inn Pattaya",4200,"per night","Family-friendly modern hotel with all rooms offering sea views, located at the northern end of Beach Road."],["Rabbit Resort Pattaya",5500,"per night","Charming Thai-style boutique resort set in lush gardens directly on Dongtan Beach, Jomtien."],["Arbour Hotel and Residence",3200,"per night","Modern luxury residence with rooftop sunset views in Central Pattaya."],["Pullman Pattaya Hotel G",4800,"per night","Stylish lifestyle resort with a private beach club and chic design located on Wongamat Beach."]],"spa":[["Traditional Thai Massage",300,"per hour","Authentic full-body stretching and pressure point massage, located in Central Pattaya."],["Aromatherapy Oil Massage",600,"per hour","Relaxing essential oil treatment at a boutique spa on Pratumnak Hill."],["Foot Reflexology Session",250,"per hour","Targeted foot and lower leg massage, available at various Beach Road locations."],["Luxury Spa Package",2500,"per person","3-hour session including body scrub, milk bath, and oil massage in North Pattaya."],["Aloe Vera After-Sun Massage",500,"per hour","Soothing treatment for sun-exposed skin, popular at Jomtien Beach spas."],["Four-Hands Oil Massage",1200,"per hour","Synchronized massage by two therapists for ultimate relaxation, Central Pattaya."],["Hot Stone Therapy",1500,"per 90 mins","Deep tissue healing using heated volcanic stones, located in Naklua area."],["Herbal Compress Massage",800,"per 90 mins","Traditional Thai heat treatment using steamed herbal pouches, South Pattaya."],["Deep Tissue Sports Massage",900,"per hour","Intense muscle recovery treatment near the Darkside (East Pattaya) fitness hubs."]],"tours":[["Koh Larn Speedboat Day Trip",1500,"per person","Full day trip including lunch and snorkeling equipment. Departures from Bali Hai Pier."],["Private Luxury Catamaran Charter",28000,"per day","Private cruise to Monkey Island and Koh Khram for up to 15 people. Ocean Marina Yacht Club."],["Sanctuary of Truth Guided Tour",500,"per person","Cultural tour of the iconic all-wood architectural marvel in Naklua, North Pattaya."],["Pattaya Elephant Jungle Sanctuary",2500,"per person","Ethical interaction program including feeding and mud spa. Located in the Pattaya outskirts."],["Tiffany's Cabaret Show VIP Gold",1600,"per person","Premium seating for the world-famous ladyboy cabaret show on Pattaya Second Road."],["Nong Nooch Tropical Garden Entry",800,"per person","Access to botanical gardens and cultural shows. Located in Na Chom Thian."],["Ramayana Water Park Full Day Pass",1100,"per person","All-day access to Thailand's largest water park. Located near Khao Chi Chan."],["ATV Off-Road Adventure",2800,"per person","2-hour guided off-road tour through jungle tracks and plantations in East Pattaya."],["Floating Market Cultural Tour",400,"per person","Entrance and boat ride through the Pattaya Floating Market on Sukhumvit Road."],["Coral Island Parasailing & Sea Walk",2200,"per person","Adventure bundle including underwater walking and parasailing at Koh Larn."]],"water":[["Parasailing Adventure at Koh Larn",800,"per person","Includes speedboat transfer from Bali Hai Pier and a 5-minute flight over the Gulf."],["Jet Ski Rental Jomtien Beach",1500,"per 30 mins","Self-drive jet ski experience along the Jomtien coastline with safety briefing."],["Banana Boat Ride Pattaya Beach",600,"per person","Group fun activity for up to 6 people, located near Central Pattaya Beach."],["Flyboard Experience",2500,"per 20 mins","Hydro-flight activity with professional instructor at the south end of Jomtien."],["Scuba Diving Discovery Trip",3500,"per person","Full day trip to Near Islands for beginners, includes equipment and lunch."],["Kitesurfing Lesson",4000,"per day","Introductory course at Na Jomtien, best during the windy season (Nov-Feb)."],["Sea Walker Experience",1200,"per person","Underwater walking at Koh Larn coral reefs, suitable for non-swimmers."],["Wakeboarding at Thai Wake Park",1350,"per day","Cable wakeboarding facility located in the Nong Prue area of East Pattaya."],["Stand Up Paddleboard (SUP) Rental",400,"per hour","Relaxing paddle boarding available at the quiet Wong Amat Beach."],["Windsurfing Rental & Gear",700,"per hour","Available at the Pattaya Water Sports Club in Jomtien."]],"golf":[["Siam Country Club - Old Course",4500,"per person","World-class championship course and home of the LPGA Thailand. Located in Pong, East Pattaya."],["Siam Country Club - Plantation",4000,"per person","Challenging 27-hole layout with spectacular views of the Gulf of Thailand. Located in East Pattaya."],["Laem Chabang International Country Club",3500,"per person","Jack Nicklaus designed course with mountain, lake, and valley loops. Located in Sriracha area."],["Chee Chan Golf Resort",5000,"per person","Luxury links-style course with views of the famous Buddha Mountain. Located in Na Jomtien."],["Phoenix Gold Golf & Country Club",2800,"per person","Renovated 27-hole course with easy access from the city. Located in Huay Yai."],["Burapha Golf Club",2200,"per person","Large 36-hole complex popular for tournaments and group outings. Located in Sriracha."],["Pattana Sports Resort",2500,"per person","Extensive sports complex with 27 holes and excellent facilities. Located in Khao Mai Kaew."],["St. Andrews 2000 Golf Club",3200,"per person","Extremely challenging par-74 course with two par-6 holes. Located in Rayong/Ban Chang area."],["Plutaluang Navy Golf Course",1200,"per person","Budget-friendly historic course managed by the Royal Thai Navy. Located in Sattahip."]],"yacht":[["Luxury Sailing Catamaran 45ft",35000,"per day","Private charter for up to 15 people, includes snorkeling gear and soft drinks. Departs from Ocean Marina Yacht Club."],["Speedboat Island Hopper",12000,"per day","Twin-engine speedboat perfect for fast trips to Koh Larn and Koh Sak. Departs from Bali Hai Pier."],["Azimut 60 Luxury Motor Yacht",125000,"per day","Ultra-luxury experience with air-conditioned cabins and professional crew. Na Jomtien area."],["Sunset Dinner Cruise",2500,"per person","Shared evening cruise with buffet dinner and live music around Pattaya Bay."],["Fishing Charter Boat",15000,"per day","Equipped with sonar and fishing gear for deep-sea trips to Koh Khram. Departs from Jomtien Beach."],["Party Catamaran with DJ",55000,"per day","Large capacity boat for up to 40 guests, features premium sound system and dance floor. Ocean Marina."],["Traditional Wooden Junk Boat",28000,"per day","Authentic Thai style boat for a relaxed, scenic cruise to the outer islands. Departs Bali Hai Pier."],["VIP Jet Ski Safari",4500,"per person","Guided 3-hour tour visiting 3 different islands on high-performance jet skis. Jomtien area."],["Princess 42 Flybridge",75000,"per day","Elegant motor yacht with flybridge seating, ideal for small groups and families. Ocean Marina."]],"rental":[["Honda PCX 160cc",500,"per day","Modern automatic scooter, ideal for city commuting. Available for pickup in Central Pattaya."],["Toyota Fortuner 4x4",2200,"per day","Large 7-seater SUV suitable for family trips. Includes full insurance. Located near Jomtien Beach."],["Honda Click 125i",250,"per day","Budget-friendly and fuel-efficient scooter. Popular choice for solo travelers in South Pattaya."],["Kawasaki Ninja 400",1200,"per day","Entry-level sportbike for enthusiasts. Requires valid motorcycle license. Shop located on Sukhumvit Road."],["Toyota Vios Automatic",1000,"per day","Reliable sedan for local driving. Weekly discounts available. Office near Pattaya Klang."],["Honda Forza 350",800,"per day","Premium maxi-scooter with large storage and comfort for long rides. Available in Naklua area."],["Ford Ranger Wildtrak",1800,"per day","Powerful pickup truck for heavy-duty use or excursions. Delivery to hotels in Pratumnak Hill."],["Ducati Monster 821",3500,"per day","High-performance naked bike for experienced riders. Security deposit required. Located in East Pattaya."],["MG ZS Compact SUV",1300,"per day","Modern crossover with Apple CarPlay and sunroof. Great for shopping trips. Central Pattaya location."]],"airport":[["Sedan (Toyota Camry) - Suvarnabhumi to Pattaya",1500,"per trip","Private executive sedan for up to 3 passengers including tolls. Direct to any hotel in Pattaya City."],["VIP Van (Toyota Commuter) - Suvarnabhumi to Pattaya",2200,"per trip","Spacious van for up to 9 passengers with luggage. Ideal for groups or families heading to Jomtien or Central Pattaya."],["Luxury MPV (Toyota Alphard) - Suvarnabhumi to Pattaya",4500,"per trip","Premium chauffeur service with captain seats. Includes VIP meet and greet at Gate 3."],["Standard Sedan - Don Mueang (DMK) to Pattaya",2000,"per trip","Private transfer from DMK Airport to Pattaya. Includes expressway fees."],["Shared Minibus - Suvarnabhumi to Pattaya",400,"per person","Budget-friendly scheduled shuttle service dropping off at major Pattaya intersections."],["Private SUV (Fortuner) - U-Tapao to Pattaya",800,"per trip","Quick transfer from U-Tapao Rayong-Pattaya International Airport to South Pattaya or Sattahip."],["VIP Van - Don Mueang (DMK) to Pattaya",2800,"per trip","Large group transfer from DMK. Features modified interior and entertainment system."],["Mercedes S-Class - Suvarnabhumi to Pattaya",7500,"per trip","Ultimate luxury transfer for high-profile guests. Professional English-speaking driver."],["Late Night Surcharge - All Routes",200,"per trip","Additional fee for pickups scheduled between 00:00 and 05:00."]],"shopping":[["Central Festival Pattaya Beach",1500,"avg for 2","Premium beachfront mall on Beach Road featuring international brands and a luxury cinema."],["Terminal 21 Pattaya",800,"avg for 2","Airport-themed shopping destination in North Pattaya with global zones and affordable food court."],["Pattaya Floating Market",200,"per person","Cultural shopping experience on Sukhumvit Road featuring traditional crafts and river snacks."],["Thepprasit Night Market",500,"avg for 2","Pattaya's most famous weekend market located on Thepprasit Road, known for street food and clothing."],["Mike Shopping Mall",600,"avg for 2","Budget-friendly air-conditioned mall on 2nd Road specializing in souvenirs and local fashion."],["Jomtien Night Market",400,"avg for 2","Relaxed evening market near Jomtien Beach, popular for street food, seafood and beachwear."],["Royal Garden Plaza",1200,"avg for 2","Iconic mall with the airplane facade on Beach Road, home to Ripley's Believe It or Not."],["Tree Town Market",700,"avg for 2","Open-air lifestyle market in Soi Buakhao area with a focus on bars, food stalls, and trendy accessories."],["Outlet Mall Pattaya",2500,"avg for 2","Discounted brand name sportswear and fashion located at the intersection of Thepprasit and Sukhumvit."]],"events":[["Luxury Pool Villa Party Package",15000,"per day","Includes sound system, DJ, and basic decorations for a private villa in Jomtien."],["Professional Event Host/MC",5000,"per event","English and Thai speaking host for corporate events or private parties in Central Pattaya."],["Premium BBQ Catering Service",1200,"per person","Full-service seafood and meat BBQ setup with private chef, available city-wide."],["Private Yacht Party Coordination",45000,"per day","Full planning for a 20-person yacht party departing from Ocean Marina, including catering and staff."],["Custom Birthday Decoration Set",3500,"per item","Balloon arches, banners, and LED lighting setup for hotel rooms or villas in Pratumnak."],["Professional Event Photographer",6000,"per 4 hours","High-quality event coverage and edited digital photos for parties in the Pattaya area."],["Traditional Thai Dance Performance",7500,"per event","Cultural performance group for weddings or corporate dinners in North Pattaya."],["Sound and Lighting Equipment Rental",9000,"per day","Full PA system, stage lights, and technician support for medium-sized outdoor events."]],"medical":[["Bangkok Hospital Pattaya - General Consultation",2500,"per person","Standard doctor consultation fee at a premium international hospital in North Pattaya."],["Fascino Pharmacy - IV Drip Rehydration",1800,"per person","Rehydration or vitamin infusion service located on North Pattaya Road."],["Pattaya Memorial Hospital - ER Visit",3500,"per person","Average cost for minor emergency treatment and basic medication in Central Pattaya."],["Pattaya City Hospital - General Checkup",800,"per person","Affordable government-run hospital facility located on Soi Buakhao."],["Jomtien Medical Clinic - Flu Shot",950,"per person","Standard influenza vaccination service at a private clinic in Jomtien Beach area."],["Dental Smile Pattaya - Teeth Cleaning",1200,"per person","Professional scaling and polishing at a modern dental clinic on Second Road."],["Lab Check Pattaya - STD Screening",2200,"per person","Discreet and fast blood testing services located in South Pattaya."],["Home Call Doctor Service",4000,"per person","24/7 mobile medical service providing hotel or villa visits throughout Pattaya."]],"concierge":[["VIP Fast Track Airport Meet & Greet",1500,"per person","Expedited immigration and luggage assistance at Suvarnabhumi Airport with private transfer coordination to Pattaya."],["Luxury Mercedes S-Class Airport Transfer",3500,"per trip","Premium chauffeur service from Bangkok airports directly to your hotel or villa in Pattaya."],["Private Yacht Charter - 45ft Catamaran",45000,"per day","Full day private sailing to Koh Larn and Koh Phai, includes crew, snorkeling gear, and soft drinks. Departs Ocean Marina."],["Private Villa Chef Service",3500,"per meal","Professional Thai or International chef to prepare a custom dinner at your private villa in Pratumnak or Jomtien."],["24/7 Personal Security Detail",8000,"per day","Professional, discreet close-protection officer for high-profile guests visiting nightlife venues."],["Luxury Pool Party Coordination",15000,"per event","Full event planning including DJ, catering and decor for private villas in East Pattaya."],["Helicopter Transfer BKK to Pattaya",65000,"per flight","The ultimate arrival experience. 40-minute flight landing at a private helipad near North Pattaya."],["Multilingual Personal Assistant",4000,"per day","Local expert to assist with shopping, translations, and bookings throughout Pattaya City."]]};
  function esc(s){return String(s||"").replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function catNow(){var s=history.state;if(s&&s.np==="s"&&s.cat)return s.cat;var h=location.hash;return h.indexOf("#s/")===0?decodeURIComponent(h.slice(3)):null}
  if(!document.getElementById("npProdCss")){
    var st=document.createElement("style");st.id="npProdCss";
    st.textContent='.npprod{margin:22px 0 8px}.npprod h3{font-size:17px;margin:0 0 4px}.npprod .npnote{font-size:12px;opacity:.7;margin:0 0 12px}'+
      '.npitem{border:1px solid var(--line,rgba(255,255,255,.14));background:var(--surface,rgba(255,255,255,.05));border-radius:14px;padding:12px 14px;margin:0 0 10px}'+
      '.npitem .nprow{display:flex;justify-content:space-between;gap:10px;align-items:baseline}.npitem b{font-size:15px}'+
      '.npitem .npprice{flex:0 0 auto;font-weight:700;color:#E9B949;white-space:nowrap}.npitem .npunit{font-size:12px;opacity:.7;font-weight:400}'+
      '.npitem p{margin:6px 0 0;font-size:13px;opacity:.85;line-height:1.4}';
    document.head.appendChild(st);
  }
  function fmt(n){return n.toLocaleString("en-US")}
  function render(){
    var svc=document.getElementById("svcPage");if(!svc||svc.hidden)return;
    var cat=catNow(),list=cat&&P[cat];
    var old=svc.querySelector(".npprod");
    if(old&&old.dataset.cat===cat)return;
    if(old)old.remove();
    if(!list||!list.length)return;
    var box=document.createElement("div");box.className="npprod";box.dataset.cat=cat;
    box.innerHTML='<h3>Popular options & prices</h3><p class="npnote">Estimated prices in Thai Baht. The final price is confirmed when you book.</p>'+
      list.map(function(it){return '<div class="npitem"><div class="nprow"><b>'+esc(it[0])+'</b><span class="npprice">≈ ฿'+fmt(it[1])+' <span class="npunit">'+esc(it[2])+'</span></span></div><p>'+esc(it[3])+'</p></div>'}).join("");
    var grid=svc.querySelector("#svcGrid");
    if(grid&&grid.parentNode===svc){var after=grid.nextSibling;while(after&&after.nodeType===1&&after.classList.contains("empty"))after=after.nextSibling;svc.insertBefore(box,after)}
    else svc.appendChild(box);
  }
  var busy=false;
  function sched(){if(busy)return;busy=true;requestAnimationFrame(function(){busy=false;render()})}
  var svc=document.getElementById("svcPage");
  if(svc)new MutationObserver(sched).observe(svc,{childList:true,subtree:true,attributes:true,attributeFilter:["hidden"]});
  window.addEventListener("hashchange",sched);window.addEventListener("popstate",sched);
  render();setTimeout(render,1500);
})();

/* ===== Restaurant orders: send new restaurant bookings to the restaurant dashboard (restaurant.html) ===== */
(function(){
  if(!window.supabase||typeof store==="undefined"||typeof store.set!=="function")return;
  var CATS_FOR_DASH=["restaurants","indian"];
  var sb=window.supabase.createClient("https://mymtgbmcjbwsnetzwgoy.supabase.co","sb_publishable_ViFodxG8kAENr78Fyp-BwQ_iA_BfAD0");
  var sent={};
  function s(v,n){return v==null?null:String(v).slice(0,n)}
  function send(b){
    try{
      if(!b||!b.code||sent[b.code])return;
      var c=(typeof CLUBS!=="undefined")?CLUBS.find(function(x){return x.id===b.club}):null;
      var cat=b.cat||(c&&c.cat)||"";
      if(CATS_FOR_DASH.indexOf(cat)<0)return;
      sent[b.code]=1;
      var g=parseInt(b.guests,10);
      sb.from("np_orders").insert({code:s(b.code,20),venue_id:s(b.club,60),venue_name:s(c?c.name:b.club,120),category:s(cat,40),
        customer_name:s(b.name,80),customer_phone:s(b.phone,30),package:s(b.pkg,200),guests:isNaN(g)?null:Math.max(0,Math.min(500,g)),
        booking_date:s(b.date,40),booking_time:s(b.time,40),total:Number(b.total)>=0?Number(b.total):null,note:s(b.note||b.notes||b.request,500)})
        .then(function(r){if(r&&r.error){delete sent[b.code];console.warn("order not sent",r.error.message)}});
    }catch(e){}
  }
  var _set=store.set,prev=(typeof bookings!=="undefined"&&bookings)?bookings.length:0;
  store.set=function(key,val){
    try{if(key==="np_bookings"&&Array.isArray(val)){if(val.length>prev)send(val[0]);prev=val.length}}catch(e){}
    return _set.apply(this,arguments);
  };
})();

/* ===== Account screen: "Restaurant dashboard" button for admins and restaurant owners/staff ===== */
(function(){
  if(!window.supabase||typeof panel==="undefined")return;
  var sb=window.supabase.createClient("https://mymtgbmcjbwsnetzwgoy.supabase.co","sb_publishable_ViFodxG8kAENr78Fyp-BwQ_iA_BfAD0");
  var allowed=null,checking=false,uid=null;
  function check(cb){
    if(checking)return;checking=true;
    sb.auth.getSession().then(function(r){
      var s=r.data&&r.data.session;
      if(!s){allowed=false;uid=null;checking=false;return}
      if(uid===s.user.id&&allowed!==null){checking=false;cb();return}
      uid=s.user.id;
      sb.rpc("np_my_venues").then(function(v){allowed=!v.error&&!!(v.data&&v.data.length);
        if(!allowed)return sb.rpc("np_is_admin").then(function(a){allowed=!a.error&&a.data===true});
      }).then(function(){checking=false;cb()},function(){checking=false});
    });
  }
  function add(){
    if(panel.querySelector("#npRestDash"))return;
    var out=[].slice.call(panel.querySelectorAll("button")).find(function(b){return /log ?out/i.test(b.textContent)});
    if(!out)return;
    check(function(){
      if(!allowed||panel.querySelector("#npRestDash"))return;
      var o=[].slice.call(panel.querySelectorAll("button")).find(function(b){return /log ?out/i.test(b.textContent)});if(!o)return;
      var b=document.createElement("button");b.id="npRestDash";b.type="button";b.className=o.className||"pill";b.textContent="Restaurant dashboard";
      b.style.cssText="display:block;margin:0 0 10px";
      var anchor=panel.querySelector("#npChangePw")||o;anchor.insertAdjacentElement("beforebegin",b);
      b.onclick=function(){location.href="restaurant.html"};
    });
  }
  var busy=false;
  new MutationObserver(function(){if(busy)return;busy=true;requestAnimationFrame(function(){busy=false;add()})}).observe(panel,{childList:true,subtree:true});
  sb.auth.onAuthStateChange(function(){allowed=null;uid=null});
})();
