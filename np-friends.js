/* Namaste Pattaya Reservations: Find a buddy (one feature, clear purpose), Find My Friends & Bill Splitter */
(function(){
  var sb=window.supabase?window.supabase.createClient("https://mymtgbmcjbwsnetzwgoy.supabase.co","sb_publishable_ViFodxG8kAENr78Fyp-BwQ_iA_BfAD0"):null;
  var TITLE="Friends Location & Bill Splitter";
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function rer(list){list.forEach(function(f){try{if(typeof window[f]==="function")window[f]()}catch(e){}})}

  if(typeof INTENTS!=="undefined")INTENTS.forEach(function(i){if(i[0]==="dating")i[2]="Meet new people in social places"});
  if(typeof LNAV!=="undefined")LNAV.forEach(function(n){if(n[0]==="friend")n[1]="Find a buddy"});
  var ht=document.querySelector('.hubtile[data-go="buddy"]');
  if(ht){var hb=ht.querySelector("b"),hs=ht.querySelector("small");if(hb)hb.textContent="Find a buddy";if(hs)hs.textContent="Meet travellers, safely"}
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
    pc.innerHTML='<span class="k">OUR PURPOSE</span><h4>Find a buddy is a social feature</h4>'+
      '<p>It helps travellers meet in groups and in public places: for a club night, a meal, sports or sightseeing. It is not an escort, companion or matchmaking service.</p>'+
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
    lab.innerHTML='<input type="checkbox" id="bRules"> I agree to the Find a buddy rules: social meetings in public places only, and no money or paid services of any kind.';
    var st=document.getElementById("bStart");if(st)st.insertAdjacentElement("beforebegin",lab);
    gate.addEventListener("click",function(e){
      if(!e.target.closest||!e.target.closest("#bStart"))return;
      if(!document.getElementById("bRules").checked){e.stopImmediatePropagation();e.preventDefault();var er=document.getElementById("bErr");if(er)er.textContent="Please agree to the Find a buddy rules."}
    },true);
  }

  var BAD=/(money|cash|\bpay\b|\bpaid\b|payment|price|\brate\b|baht|฿|\btip\b|short ?time|long ?time|happy ending|escort|\bsex)/i;
  function blocked(){var i=panel.querySelector("#bIn");return i&&BAD.test(i.value)}
  function warn(){var w=panel.querySelector("#bWarn");if(!w){w=document.createElement("p");w.id="bWarn";w.className="err";var bar=panel.querySelector(".chatbar");if(bar)bar.insertAdjacentElement("afterend",w)}
    w.textContent="For everyone's safety, messages about money, payment or paid services are not allowed in Find a buddy. Please keep it social."}
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
  var REN={"Golf":"Golf & Shooting Range","Shopping & Markets":"Namaste Shopping","Event & Party Planning":"Events, Groups & Gala Parties"};
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
      var r=await sb.functions.invoke("bright-responder",{body:{messages:hist.concat([{role:"user",text:t}]),venues:venues(),lang:lang}});
      if(!r.error&&r.data&&r.data.reply)res=r.data;
    }catch(e){}
    typing.remove();
    if(!res)return _ask(q);
    var ids=(res.ids||[]).filter(function(id){return typeof CLUBS!=="undefined"&&CLUBS.some(function(c){return c.id===id})});
    hist.push({role:"user",text:t},{role:"model",text:res.reply});if(hist.length>12)hist=hist.slice(-12);
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
