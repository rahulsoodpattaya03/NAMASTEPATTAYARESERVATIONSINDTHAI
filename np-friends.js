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
  function inr(n){var r=(typeof INR_PER_THB!=="undefined")?INR_PER_THB:2.89;return "₹"+Math.round((Number(n)||0)*r).toLocaleString("en-IN")}
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
    /* Friends Location & Bill Splitter: moved to the All services grid (29 Sep 2026) */
    var oldFLB=document.getElementById("npFLB");if(oldFLB)oldFLB.remove();
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
  /* Raju's own original character (1 Oct 2026). Not based on any real actor or film character. */
  var PERSONA="RAJU'S CHARACTER (always stay in this character): You are Raju, Namaste Pattaya's own friendly local guide, an original character. "+
    "You are a warm Indian 'bhai' who has lived in Pattaya for many years and knows every street, club, Indian restaurant, beach and shortcut. "+
    "Speak warm, simple Hinglish (mix easy Hindi and English) unless the guest writes in another language; then answer in their language. "+
    "Be a little filmy and cheerful, but always respectful. Greet with 'Namaste ji' at the start of a new chat. Call guests 'sir', 'madam' or 'bhai' naturally. "+
    "Keep answers short and useful (2 to 5 short lines on a phone). "+
    "FILMI STYLE: you love Bollywood and talk with filmi flair. In about half of your replies (never in emergencies or serious problems), add ONE short filmi one-liner of your own. "+
    "Use Raju's own signature lines, or write new original ones in the same style: 'Tension mat lo, Raju hai na!' / 'Pattaya aaye ho, toh yaadein le kar hi jaoge!' / "+
    "'Raju ke hote hue, aapka plan kabhi flop nahi hoga.' / 'Table book karo, baaki picture Raju sambhal lega.' / 'Yeh Pattaya hai bhai, yahan raatein bhi Bollywood jitni lambi hoti hain.' / "+
    "'Dost ka saath aur Raju ki planning, hit hi hit!' / 'Khana veg ho ya non-veg, swaad full-on filmi hoga!' / 'Sunset dekhna hai? 6 baje beach pe aaiye, scene ready hai.' / "+
    "'Safety pehle, masti baad mein. Yeh Raju ka usool hai.' / 'Aap mehmaan ho, aur Pattaya aapka stage!' / 'Kal ka episode bhi plan kar dein?'. "+
    "Only use these or new original lines: never copy or slightly change real dialogues from films, and never quote song lyrics. "+
    "When it really helps, end with one short tip starting with 'Raju ki salah:' (for example safety, timing, Grab taxi, dress code, carrying passport copy). "+
    "Values: safety first, honest advice, never pushy, never flirt, always respectful to women, never help with anything illegal. "+
    "Never say you are a real person, a film character or any actor, and never quote film dialogues or song lyrics. If asked who you are: 'Main Raju hoon, Namaste Pattaya ka apna guide.' "+
    "In any emergency, drop the jokes: be calm and clear, and give Tourist Police 1155 and ambulance 1669.";
  /* Raju language (7 Oct 2026): Raju follows the language chosen in the app menu, and uses ONLY the app's 7 languages */
  var NP_LANGS={en:"English",hi:"Hindi (Devanagari script)",pa:"Punjabi (Gurmukhi script)",gu:"Gujarati (Gujarati script)",ta:"Tamil (Tamil script)",mr:"Marathi (Devanagari script)",th:"Thai (Thai script)"};
  function npLangRule(l){
    if(!NP_LANGS[l])l="en";
    return "LANGUAGE RULE (most important, this overrides any other language instruction, including the character's Hinglish line): "+
      "The guest chose "+NP_LANGS[l]+" in the app menu, so reply in "+NP_LANGS[l]+". "+
      (l==="en"?"You may keep a few friendly words like 'ji', 'bhai' or 'Namaste', but the reply must be in English. ":"Write the whole reply in that language and script, including filmi lines and 'Raju ki salah' (translate them). Venue names, phone numbers and prices stay as they are. ")+
      "Only if the guest clearly writes in another one of these 7 languages (English, Hindi, Punjabi, Gujarati, Tamil, Marathi, Thai) may you reply in that one. "+
      "Never reply in any other language. If the guest writes in a language outside these 7, reply in "+NP_LANGS[l]+".\n\n";
  }
  /* read Raju's answer in any format Supabase sends (JSON, text or file) */
  async function npReadReply(r){
    try{
      if(!r||r.error==="timeout")return null;
      var d=r.data;
      if(!d&&r.error&&r.error.context&&typeof r.error.context.text==="function"){try{d=await r.error.context.text()}catch(e){}}
      if(d&&typeof Blob!=="undefined"&&d instanceof Blob)d=await d.text();
      if(typeof d==="string"){var txt=d.trim();try{d=JSON.parse(txt)}catch(e){d=txt&&txt.charAt(0)!=="<"?{reply:txt,ids:[]}:null}}
      if(d&&typeof d==="object"){var rep=d.reply||d.text||d.answer||d.message;if(typeof rep==="string"&&rep.trim())return {reply:rep.trim(),ids:Array.isArray(d.ids)?d.ids:[]}}
    }catch(e){}
    return null;
  }
  var NP_TYPING={en:"Raju is typing…",hi:"राजू लिख रहा है…",pa:"ਰਾਜੂ ਲਿਖ ਰਿਹਾ ਹੈ…",gu:"રાજુ લખી રહ્યો છે…",ta:"ராஜு எழுதுகிறார்…",mr:"राजू लिहित आहे…",th:"ราจูกำลังพิมพ์…"};
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
    var typing=document.createElement("div");typing.className="msg bot";typing.textContent=(function(){var l="en";try{l=localStorage.getItem("np_lang")||"en"}catch(e){}return NP_TYPING[l]||NP_TYPING.en})();
    if(typeof chatEl!=="undefined"){chatEl.appendChild(typing);typing.scrollIntoView({block:"end"})}
    var res=null;
    try{
      var lang="en";try{lang=localStorage.getItem("np_lang")||"en"}catch(e){}
      var extra=window.__npOrderInfo||"";window.__npOrderInfo=null;
      var npBody={messages:hist.concat([{role:"user",text:t+(extra?"\n\n[System order lookup, not written by the customer. Tell the customer this clearly and kindly in their language: "+extra+"]":"")}]),venues:npLangRule(lang)+"EXTRA RULES YOU MUST FOLLOW (Thai law): 1) Thai alcohol law (2025) bans alcohol advertising: never recommend, describe, price or promote alcoholic drinks, bottles, brands, cocktails, happy hours or drink deals. You may name a venue and its table/experience; if asked about drinks, say the venue shares its menu on site. 2) Never give prices for hospitals, clinics, treatments or medicines, and never recommend medicines. For health issues, suggest a licensed hospital or pharmacy by name/area only; for emergencies, call 1669.\n\n"+PERSONA+"\n\n"+venues(),lang:lang};
      var call=sb.functions.invoke("bright-responder",{body:npBody});
      var timeout=new Promise(function(ok){setTimeout(function(){ok({error:"timeout"})},35000)});
      var r=await Promise.race([call,timeout]);
      res=await npReadReply(r);
      /* one quick retry if the first answer failed (not after a timeout) */
      if(!res&&!(r&&r.error==="timeout")){
        var call2=sb.functions.invoke("bright-responder",{body:npBody});
        var r2=await Promise.race([call2,new Promise(function(ok){setTimeout(function(){ok({error:"timeout"})},25000)})]);
        res=await npReadReply(r2);
      }
    }catch(e){}
    typing.remove();
    if(!res&&extra)res={reply:extra,ids:[]};
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
  /* Talking option switched OFF on Rahul's order (7 Oct 2026). Code kept, not deleted. To turn it back on, change false to true. */
  var NP_RAJU_TALK=false;
  if(!NP_RAJU_TALK){try{if(window.speechSynthesis)window.speechSynthesis.cancel()}catch(e){}return}
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
    [/भारतीयों के लिए,? एक भारतीय का तोहफा/g,"भारत के लिए, एक भारतीय का तोहफ़ा"],
    /* add "Jai Hind" after the tagline (only once) */
    [/(Bharat ke liye, ek Bhartiye ka tohfa)(?![.!]?\s*[·|,-]?\s*Jai Hind)/gi,"$1. Jai Hind"],
    [/(भारत के लिए, एक भारतीय का तोहफ़ा)(?![।.!]?\s*[·|,-]?\s*जय हिन्द)/g,"$1। जय हिन्द"]
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
  /* LEGAL: no medical prices (medical ads need DoHSS approval); estimated prices shown to admins only until partners confirm them */
  delete P.medical;
  if(P.restaurants)P.restaurants.forEach(function(it){it[0]=it[0].replace(/\s*&\s*Wine Bar$/i,"").replace(/\s*&\s*Bar$/i,"")});
  var adminOK=false;
  (function(){try{if(!window.supabase)return;var c=window.supabase.createClient("https://mymtgbmcjbwsnetzwgoy.supabase.co","sb_publishable_ViFodxG8kAENr78Fyp-BwQ_iA_BfAD0");
    function chk(){c.rpc("np_is_admin").then(function(r){var was=adminOK;adminOK=!r.error&&r.data===true;if(was!==adminOK){var o=document.querySelector("#svcPage .npprod");if(o)o.remove();sched()}})}
    chk();c.auth.onAuthStateChange(function(){setTimeout(chk,100)})}catch(e){}})();
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
    var cat=catNow(),list=cat&&P[cat];if(cat==="restaurants")list=(P.indian||[]).filter(function(it){return /pure veg|vegetarian/i.test(it[0]+" "+it[3])});
    var old=svc.querySelector(".npprod");
    if(old&&old.dataset.cat===cat)return;
    if(old)old.remove();
    if(!list||!list.length||!adminOK)return;
    var box=document.createElement("div");box.className="npprod";box.dataset.cat=cat;
    box.innerHTML='<h3>Popular options & prices</h3><p class="npnote">🔒 Admin preview only – customers cannot see this until each business confirms its prices and agrees to be listed.</p>'+
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
      var base={code:s(b.code,20),venue_id:s(b.club,60),venue_name:s(c?c.name:b.club,120),category:s(cat,40),
        customer_name:s(b.name,80),customer_phone:s(b.phone,30),package:s(b.pkg,200),guests:isNaN(g)?null:Math.max(0,Math.min(500,g)),
        booking_date:s(b.date,40),booking_time:s(b.time,40),total:Number(b.total)>=0?Number(b.total):null,note:s(b.note||b.notes||b.request,500)};
      var row=base;
      if(b.order_type&&b.order_type!=="dine_in"){row=Object.assign({},base,{order_type:b.order_type,delivery_address:s(b.address,300)})}
      sb.from("np_orders").insert(row).then(function(r){
        if(r&&r.error&&row!==base){
          /* database not updated yet for delivery: send without it, keep the info in the note */
          var nb=Object.assign({},base,{note:s(((b.order_type==="delivery"?"DELIVERY to: "+(b.address||""):"TAKEAWAY")+" | "+(base.note||"")),500)});
          return sb.from("np_orders").insert(nb);
        }
        return r;
      }).then(function(r){if(r&&r.error){delete sent[b.code];console.warn("order not sent",r.error.message)}});
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

/* ===== TEST restaurant for trying the restaurant dashboard (remove before launch) ===== */
(function(){
  if(typeof CLUBS==="undefined")return;
  if(CLUBS.some(function(c){return c.id==="np-test-restaurant"}))return;
  CLUBS.push({id:"np-test-restaurant",name:"Namaste Test Kitchen (TEST)",cat:"indian",area:"Central Pattaya",open:"12:00 – 23:00",
    sub:"Indian restaurant",music:"Indian restaurant",type:"Restaurant",tags:["Test","Indian food"],
    about:"This is a TEST restaurant to try the restaurant dashboard. Bookings here are not real.",
    art:["#E5861A","#2A1A3A"],photo:"photos/Xindianrestaurants.jpg",hosts:["Test host"],
    pkgs:[{n:"Table for 2",d:"Test booking",p:0,left:99},{n:"Table for 4",d:"Test booking",p:0,left:99},{n:"Group dinner (8+)",d:"Test booking",p:0,left:99}]});
  ["renderGrid","renderRail","renderCats","renderMap"].forEach(function(f){try{if(typeof window[f]==="function")window[f]()}catch(e){}});
})();

/* ===== Restaurants: Dine-in / Takeaway / Delivery choice in the booking form; no DJ song request or photo-on-screen for restaurants ===== */
(function(){
  if(typeof CLUBS==="undefined"||typeof store==="undefined")return;
  var FOOD=["restaurants","indian"],lastPlace=null,choice={type:"dine_in",addr:""};
  var BTN=/book|send|confirm|request|reserve|बुक/i;
  var CLUBONLY=/(song|dj|music)[^.]{0,20}request|request[^.]{0,20}(song|dj|music)|(photo|picture|pic|name|message|video)[^.]{0,20}on (the )?(big |led )?screen|screen (message|shout|display)|led screen/i;
  function vis(el){return !!(el&&el.offsetParent!==null)}
  function isFood(c){return !!(c&&FOOD.indexOf(c.cat)>-1)}
  document.addEventListener("click",function(e){
    var card=e.target.closest&&e.target.closest(".art, .card, [data-id]");if(!card)return;
    var id=card.dataset&&card.dataset.id,nm=card.querySelector&&card.querySelector(".name"),name=nm?nm.textContent.trim():"";
    var c=CLUBS.find(function(x){return (id&&x.id===id)||(name&&x.name===name)});if(c)lastPlace=c;
  },true);
  function venueIn(root){
    var hs=root.querySelectorAll("h1,h2,h3,h4,#sheetTitle,.name,.vname,.title");
    for(var i=0;i<hs.length;i++){var t=hs[i].textContent.trim();var c=CLUBS.find(function(x){return x.name&&(t===x.name||t.indexOf(x.name)===0)});if(c)return c}
    var txt=root.textContent||"";
    var m=CLUBS.filter(function(x){return x.name&&x.name.length>3&&txt.indexOf(x.name)>-1}).sort(function(a,b){return b.name.length-a.name.length})[0];
    return m||lastPlace;
  }
  function containerOf(el){return el.closest(".pbody")||el.closest("#panel")||el.closest(".sheet")||el.closest("section")||el.parentElement}
  if(!document.getElementById("npDelCss")){
    var st=document.createElement("style");st.id="npDelCss";
    st.textContent='.npdel{margin:12px 0}.npdel .npdl{font-weight:600;margin:0 0 6px}.npdel .npseg{display:flex;gap:6px}.npdel .npseg button{flex:1;padding:10px 6px;border-radius:12px;border:1px solid var(--line,rgba(255,255,255,.2));background:var(--surface,rgba(255,255,255,.05));color:var(--ink,#fff);font-weight:600}'+
      '.npdel .npseg button[aria-pressed="true"]{border-color:#E5861A;background:rgba(229,134,26,.18);color:#E5861A}.npdel textarea{width:100%;margin-top:8px;border-radius:12px;border:1px solid var(--line,rgba(255,255,255,.2));background:var(--surface,rgba(255,255,255,.05));color:var(--ink,#fff);padding:10px;min-height:64px;font:inherit}'+
      '.npdel .nploc{margin-top:6px;background:none;border:0;color:#E5861A;font-weight:600;padding:4px 0}.npdel small{display:block;opacity:.7;margin-top:4px}';
    document.head.appendChild(st);
  }
  function makeBox(){
    choice={type:"dine_in",addr:""};
    var box=document.createElement("div");box.className="npdel";
    box.innerHTML='<p class="npdl">How do you want your food?</p><div class="npseg" role="group" aria-label="Order type"><button type="button" data-t="dine_in" aria-pressed="true">Dine-in</button><button type="button" data-t="takeaway" aria-pressed="false">Takeaway</button><button type="button" data-t="delivery" aria-pressed="false">Delivery</button></div>'+
      '<div class="npaddr" hidden><textarea placeholder="Delivery address: hotel name, room number, street"></textarea><button type="button" class="nploc">📍 Add my current location</button><small>The restaurant will call you to confirm the order and delivery time.</small></div>';
    var addr=box.querySelector(".npaddr"),ta=box.querySelector("textarea");
    [].forEach.call(box.querySelectorAll("[data-t]"),function(b){b.onclick=function(e){e.preventDefault();
      choice.type=b.dataset.t;[].forEach.call(box.querySelectorAll("[data-t]"),function(x){x.setAttribute("aria-pressed",x===b?"true":"false")});
      addr.hidden=choice.type!=="delivery";if(!addr.hidden)ta.focus();
    }});
    ta.oninput=function(){choice.addr=ta.value.trim()};
    box.querySelector(".nploc").onclick=function(e){e.preventDefault();
      if(!navigator.geolocation){alert("Location is not available on this phone.");return}
      navigator.geolocation.getCurrentPosition(function(p){
        var link="https://maps.google.com/?q="+p.coords.latitude.toFixed(6)+","+p.coords.longitude.toFixed(6);
        ta.value=(ta.value.trim()?ta.value.trim()+"\n":"")+link;choice.addr=ta.value.trim();
      },function(){alert("Please allow location for this app, or type your address.")},{enableHighAccuracy:true,timeout:10000});
    };
    return box;
  }
  function hideClubExtras(root){
    [].forEach.call(root.querySelectorAll("label,button,li,.addon,.opt,.chk,.extra,.row,p,div,span"),function(el){
      if(el.dataset.npHid||el.closest(".npdel")||el.closest("[data-np-hid]"))return;
      var t=(el.textContent||"").trim();if(!t||t.length>160||!CLUBONLY.test(t))return;
      /* hide the smallest block that holds this option */
      var kids=[].slice.call(el.children).filter(function(k){return CLUBONLY.test(k.textContent||"")});
      if(kids.length)return;
      var row=el.closest("label,li,.addon,.opt,.chk,.extra")||el;
      row.dataset.npHid="1";row.style.display="none";
    });
  }
  function scan(){
    /* booking forms: any visible date field, or a visible booking button */
    var anchors=[].slice.call(document.querySelectorAll('input[type="date"],input[type="datetime-local"]')).filter(function(d){return vis(d)&&!d.closest("#dash")});
    if(!anchors.length)anchors=[].slice.call(document.querySelectorAll("button")).filter(function(b){return vis(b)&&BTN.test(b.textContent)&&!b.closest("#dash,.npdel,nav,header,#pkgs,.pkg")&&/guest|people|person|pax|table|date|time/i.test((containerOf(b)||{}).textContent||"")});
    anchors.forEach(function(el){
      var box=containerOf(el);if(!box)return;
      var c=venueIn(box);if(!isFood(c))return;
      hideClubExtras(box);
      if(box.querySelector(".npdel"))return;
      var at=el.tagName==="INPUT"?(el.closest("label")||el):el;
      at.insertAdjacentElement("beforebegin",makeBox());
    });
    /* restaurant page / package list outside the form */
    var cur=lastPlace;
    if(isFood(cur))[].forEach.call(document.querySelectorAll(".pbody,#panel,section"),function(sec){if(vis(sec)&&venueIn(sec)===cur)hideClubExtras(sec)});
  }
  /* don't send a delivery order without an address */
  document.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("button");if(!b||b.closest(".npdel"))return;
    var box=containerOf(b);if(!box||!box.querySelector(".npdel"))return;
    if(BTN.test(b.textContent)&&choice.type==="delivery"&&!choice.addr){
      e.preventDefault();e.stopImmediatePropagation();alert("Please add your delivery address.");var ta=box.querySelector(".npdel textarea");if(ta)ta.focus();
    }
  },true);
  var busy=false;
  new MutationObserver(function(){if(busy)return;busy=true;setTimeout(function(){busy=false;try{scan()}catch(e){}},120)}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:["hidden","class"]});
  /* add the choice to the booking before it is saved and sent to the restaurant */
  var _set=store.set,prev=(typeof bookings!=="undefined"&&bookings)?bookings.length:0;
  store.set=function(key,val){
    try{
      if(key==="np_bookings"&&Array.isArray(val)){
        if(val.length>prev&&val[0]){
          var b=val[0],c=CLUBS.find(function(x){return x.id===b.club});
          if(isFood(c)&&choice.type!=="dine_in"){
            b.order_type=choice.type;if(choice.type==="delivery")b.address=choice.addr;
            b.pkg=(choice.type==="delivery"?"Delivery · ":"Takeaway · ")+(b.pkg||"");
          }
          choice={type:"dine_in",addr:""};
        }
        prev=val.length;
      }
    }catch(e){}
    return _set.apply(this,arguments);
  };
})();

/* ===== Restaurant partners: open the restaurant dashboard instead of the club dashboard ===== */
(function(){
  if(!window.supabase||typeof go!=="function")return;
  var sb=window.supabase.createClient("https://mymtgbmcjbwsnetzwgoy.supabase.co","sb_publishable_ViFodxG8kAENr78Fyp-BwQ_iA_BfAD0");
  var rest=false;
  function isRest(u){var m=(u&&u.user_metadata)||{};return m.role==="partner"&&/restaurant|food|cafe/i.test(String(m.venue_type||""))}
  function check(){sb.auth.getSession().then(function(r){var s=r.data&&r.data.session;rest=!!(s&&isRest(s.user));
    var d=document.getElementById("dash");if(rest&&d&&!d.hidden)location.href="restaurant.html"})}
  var _go=go;
  go=function(t){if(t==="dash"&&rest){location.href="restaurant.html";return}return _go.apply(this,arguments)};
  sb.auth.onAuthStateChange(function(){setTimeout(check,50)});
  check();
})();

/* ===== Raju: order status. Customer asks "where is my order" or gives an order number (NP…) ===== */
(function(){
  if(typeof ask!=="function"||!window.supabase)return;
  var sb=window.supabase.createClient("https://mymtgbmcjbwsnetzwgoy.supabase.co","sb_publishable_ViFodxG8kAENr78Fyp-BwQ_iA_BfAD0");
  var FOOD=["restaurants","indian"];
  var CODE=/\bNP[A-Z0-9]{5}\b/gi;
  var ASKS=/(order|booking|delivery|deliver|khana|food|parcel|takeaway|table|ऑर्डर|बुकिंग|खाना)/i;
  var WHAT=/(status|where|when|kab|kahan|kaha|kidhar|ready|confirm|number|update|late|abhi tak|kitni der|kitna time|pahunch|aaya|aayega|track|कहाँ|कब|स्टेटस)/i;
  var SAY={new:"the restaurant has received it and will confirm it very soon",confirmed:"the restaurant has confirmed it",in_progress:"the restaurant is preparing it now",done:"it is completed",cancelled:"it was cancelled by the restaurant – please contact our team on WhatsApp"};
  function myCodes(){
    try{
      var list=(typeof bookings!=="undefined"&&Array.isArray(bookings))?bookings:[];
      return list.filter(function(b){var c=(typeof CLUBS!=="undefined")?CLUBS.find(function(x){return x.id===b.club}):null;return FOOD.indexOf(b.cat||(c&&c.cat))>-1&&b.code})
        .slice(0,3).map(function(b){return String(b.code).toUpperCase()});
    }catch(e){return []}
  }
  function mins(t){var m=Math.round((Date.now()-new Date(t))/60000);return m<1?"just now":m<60?m+" min ago":Math.round(m/60)+" h ago"}
  async function lookup(q){
    var typed=(String(q).match(CODE)||[]).map(function(c){return c.toUpperCase()});
    var codes=typed.length?typed:myCodes();
    if(!codes.length)return "No restaurant order was found on this phone. Ask the customer for their order number – it starts with NP and is shown in My bookings.";
    var r=await sb.rpc("np_order_status",{codes:codes});
    if(r.error)return null;
    if(!r.data||!r.data.length)return typed.length?"No order was found with number "+typed.join(", ")+". Ask the customer to check the number in My bookings (it starts with NP), or to message our team on WhatsApp.":"The order has not reached the restaurant yet. Ask the customer to wait a minute and ask again, or to message our team on WhatsApp.";
    return r.data.map(function(o){
      var kind=o.order_type==="delivery"?"delivery order":o.order_type==="takeaway"?"takeaway order":"table booking";
      var extra=o.order_type==="delivery"&&o.staff_assigned&&(o.status==="in_progress"||o.status==="confirmed")?" A delivery person has been assigned.":"";
      return "Order "+o.code+" ("+kind+" at "+(o.venue_name||"the restaurant")+"): "+(SAY[o.status]||o.status)+". Last update "+mins(o.updated_at)+"."+extra;
    }).join(" ")+" The restaurant will call the customer if anything changes.";
  }
  var _ask=ask;
  ask=async function(q){
    var t=String(q||"");
    CODE.lastIndex=0;
    var isOrder=CODE.test(t)||(ASKS.test(t)&&WHAT.test(t));CODE.lastIndex=0;
    if(isOrder){try{var info=await Promise.race([lookup(t),new Promise(function(ok){setTimeout(function(){ok(null)},6000)})]);if(info)window.__npOrderInfo=info}catch(e){}}
    try{return await _ask.apply(this,arguments)}finally{window.__npOrderInfo=null}
  };
})();

/* ===== Partner sign-up: restaurant photo (required for restaurants) ===== */
(function(){
  if(typeof panel==="undefined"||!window.supabase)return;
  var sb=window.supabase.createClient("https://mymtgbmcjbwsnetzwgoy.supabase.co","sb_publishable_ViFodxG8kAENr78Fyp-BwQ_iA_BfAD0");
  var KEY="np_pending_venue_photo",photo=null;
  function isRestType(v){return /restaurant|food|cafe/i.test(String(v||""))}
  function shrink(file,cb){
    var img=new Image(),url=URL.createObjectURL(file);
    img.onload=function(){var m=1280,w=img.width,h=img.height,k=Math.min(1,m/Math.max(w,h));
      var cv=document.createElement("canvas");cv.width=Math.round(w*k);cv.height=Math.round(h*k);cv.getContext("2d").drawImage(img,0,0,cv.width,cv.height);
      URL.revokeObjectURL(url);cb(cv.toDataURL("image/jpeg",0.82))};
    img.onerror=function(){URL.revokeObjectURL(url);cb(null)};img.src=url;
  }
  function build(){
    var t=panel.querySelector("#ppT"),go=panel.querySelector("#ppGo");
    if(!t||!go||panel.querySelector("#npVPhoto"))return;
    photo=null;
    var lab=document.createElement("label");lab.className="full";lab.id="npVPhotoWrap";
    lab.innerHTML='Photo of your restaurant<input id="npVPhoto" type="file" accept="image/*"><span id="npVPrev" style="display:block;margin-top:6px"></span>';
    (t.closest("label")||t).insertAdjacentElement("afterend",lab);
    function show(){lab.style.display=isRestType(t.value)?"":"none"}
    t.addEventListener("change",show);show();
    lab.querySelector("#npVPhoto").onchange=function(e){var f=e.target.files&&e.target.files[0];if(!f)return;
      shrink(f,function(d){photo=d;lab.querySelector("#npVPrev").innerHTML=d?'<img src="'+d+'" alt="Restaurant photo preview" style="width:100%;max-height:180px;object-fit:cover;border-radius:12px">':"Could not read this photo, please choose another."})};
    go.addEventListener("click",function(e){
      if(!isRestType(t.value))return;
      if(!photo){e.preventDefault();e.stopImmediatePropagation();var m=panel.querySelector("#ppM");if(m)m.textContent="Please add a photo of your restaurant.";return}
      var em=panel.querySelector("#ppE");try{localStorage.setItem(KEY,JSON.stringify({email:(em?em.value.trim().toLowerCase():""),data:photo}))}catch(err){}
    },true);
  }
  var busy=false;
  new MutationObserver(function(){if(busy)return;busy=true;requestAnimationFrame(function(){busy=false;build()})}).observe(panel,{childList:true,subtree:true});
  /* upload the saved photo as soon as the restaurant is signed in (here or on restaurant.html) */
  window.npUploadVenuePhoto=async function(client,user){
    try{
      var raw=localStorage.getItem(KEY);if(!raw)return null;var p=JSON.parse(raw);
      if(p.email&&user.email&&p.email!==user.email.toLowerCase())return null;
      var blob=await (await fetch(p.data)).blob(),path=user.id+"/venue.jpg";
      var up=await client.storage.from("partner-photos").upload(path,blob,{upsert:true,contentType:"image/jpeg"});
      if(up.error)return null;
      var url=client.storage.from("partner-photos").getPublicUrl(path).data.publicUrl+"?v="+Date.now();
      var md=user.user_metadata||{};
      var ins=await client.from("np_partner_requests").insert({email:user.email,venue_name:md.venue||null,venue_type:md.venue_type||null,contact_name:md.name||null,phone:md.phone||null,photo_url:url});
      if(ins.error)await client.from("np_partner_requests").update({photo_url:url}).eq("user_id",user.id);
      if(md.food_type){try{await client.from("np_partner_requests").update({food_type:md.food_type,cuisines:md.cuisines||null}).eq("user_id",user.id)}catch(e){}}
      localStorage.removeItem(KEY);return url;
    }catch(e){return null}
  };
  sb.auth.onAuthStateChange(function(ev,s){if(s&&s.user&&(s.user.user_metadata||{}).role==="partner")window.npUploadVenuePhoto(sb,s.user)});
})();

/* ===== LEGAL: no alcohol, tobacco or hookah wording anywhere in venue data or pages (Alcoholic Beverage Control Act No. 2, 2025) ===== */
(function(){
  var RULES=[
    [/\s*&\s*Wine Bar\b/gi,""],[/\bWine Bar\b/gi,"Restaurant"],
    [/\bbottle[\s-]*service\b/gi,"table service"],
    [/\s*[,+&·•|\/-]?\s*(\d+|one|two|three|four|five|free|premium|house)?\s*(bottles?|btl)(\s+of\s+[a-z]+)?(\s+included)?/gi,""],
    [/\s*[,+&]?\s*(free[\s-]*flow|open bar|happy hours?|welcome drinks?|free drinks?|drinks? included|mixers?)\b/gi,""],
    [/\s*[,+&]?\s*\b(cocktails?|craft beers?|beers?|whiske?y|vodka|rum|gin|tequila|champagne|prosecco|wine cellar|wines?|spirits|liquor|shots|buckets?)\b/gi,""],
    [/\s*[,+&]?\s*\b(hookahs?|shisha|vapes?|cigar(ette)?s?)\b/gi,""]
  ];
  var BAD=/bottle|btl\b|free[\s-]*flow|open bar|happy hour|welcome drink|free drink|drinks? included|mixer|cocktail|beer|whiske?y|vodka|\brum\b|\bgin\b|tequila|champagne|prosecco|\bwines?\b|spirits|liquor|\bshots\b|bucket|hookah|shisha|\bvapes?\b|cigar/i;
  function clean(t){
    if(typeof t!=="string"||!BAD.test(t))return t;
    var o=t;RULES.forEach(function(r){o=o.replace(r[0],r[1])});
    for(var i=0;i<3;i++)o=o.replace(/\b(with|and|&|plus)\s*(,|and\b|&)\s*/gi,"$1 ").replace(/,\s*(and|&)\s+/gi," and ").replace(/\s+(and|with|&|plus|,)\s*$/i,"").replace(/^\s*(and|with|&|,)\s+/i,"");
    return o.replace(/\s{2,}/g," ").replace(/\s+([,.;:!)])/g,"$1").replace(/([,(])\s*[,)]/g,"$1").replace(/^[\s,;·•|+&-]+|[\s,;·•|+&-]+$/g,"").replace(/,\s*,/g,",")||o.split(/[,.]/)[0];
  }
  function walk(v,depth){
    if(depth>4||v==null)return v;
    if(typeof v==="string")return clean(v);
    if(Array.isArray(v)){for(var i=v.length-1;i>=0;i--){var c=walk(v[i],depth+1);if(typeof c==="string"&&!c.trim()&&typeof v[i]==="string")v.splice(i,1);else v[i]=c}return v}
    if(typeof v==="object"){Object.keys(v).forEach(function(k){if(k==="id"||k==="photo"||k==="img"||k==="art")return;v[k]=walk(v[k],depth+1)})}
    return v;
  }
  function data(){
    try{if(typeof CLUBS!=="undefined")CLUBS.forEach(function(c){walk(c,0)})}catch(e){}
    try{if(typeof NIGHT!=="undefined")walk(NIGHT,0)}catch(e){}
    try{if(typeof PARTNERS!=="undefined")walk(PARTNERS,0)}catch(e){}
  }
  /* visible text on venue cards, service pages and booking sheets (not chats or what people type) */
  function page(root){
    var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){
      var p=n.parentElement;if(!p||!BAD.test(n.nodeValue))return NodeFilter.FILTER_REJECT;
      if(p.closest("input,textarea,script,style,.msg,.bubble,.chat,#rajuChat,[contenteditable],.npdel"))return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT}});
    var list=[];while(w.nextNode())list.push(w.currentNode);
    list.forEach(function(n){var c=clean(n.nodeValue);if(c!==n.nodeValue)n.nodeValue=c});
  }
  data();
  ["renderGrid","renderRail","renderCats","renderMap"].forEach(function(f){try{if(typeof window[f]==="function")window[f]()}catch(e){}});
  var busy=false;
  function run(){["svcPage","panel","explore","cats","home","night","grid","rail"].forEach(function(id){var el=document.getElementById(id);if(el)page(el)});
    [].forEach.call(document.querySelectorAll(".pbody,.card,.art,.svchero,.sheet"),page)}
  new MutationObserver(function(){if(busy)return;busy=true;setTimeout(function(){busy=false;try{run()}catch(e){}},150)}).observe(document.body,{childList:true,subtree:true});
  run();
})();

/* ===== LEGAL (PDPA): privacy notice + consent on every booking; photo-rights tick for restaurant sign-up ===== */
(function(){
  if(typeof CLUBS==="undefined")return;
  var BTN=/book|send|confirm|request|reserve|बुक/i,FOOD=["restaurants","indian"];
  function vis(el){return !!(el&&el.offsetParent!==null)}
  function containerOf(el){return el.closest(".pbody")||el.closest("#panel")||el.closest(".sheet")||el.closest("section")||el.parentElement}
  if(!document.getElementById("npPdpaCss")){var st=document.createElement("style");st.id="npPdpaCss";
    st.textContent='.nppdpa{display:flex;gap:10px;align-items:flex-start;margin:12px 0;font-size:13px;line-height:1.4;opacity:.92}.nppdpa input{width:20px;height:20px;flex:0 0 20px;margin-top:1px}.nppdpa a{color:#E5861A;font-weight:600}.nppdpa.err{color:#ff6b5b}';
    document.head.appendChild(st)}
  function scan(){
    var btns=[].slice.call(document.querySelectorAll("button")).filter(function(b){
      if(!vis(b)||!BTN.test(b.textContent)||b.closest("#dash,.npdel,nav,header,.nppdpa,#pkgs,.pkg"))return false;
      var box=containerOf(b);if(!box)return false;
      /* only real booking forms: never the home page or a list of venue cards */
      var form=box.closest("#panel,.sheet,.pbody")||box.matches("#panel,.sheet,.pbody");
      var hasDate=box.querySelector('input[type="date"],input[type="datetime-local"]');
      if(!form&&(!hasDate||box.querySelectorAll("[data-id]").length>1))return false;
      return hasDate||/guest|people|person|pax/i.test(box.textContent||"");
    });
    btns.forEach(function(b){
      var box=containerOf(b);if(box.querySelector(".nppdpa"))return;
      var lab=document.createElement("label");lab.className="nppdpa";
      lab.innerHTML='<input type="checkbox"><span>I agree that Namaste Pattaya and this venue use my name, phone number'+(box.querySelector(".npdel")?", and my address or location for delivery,":"")+' only to handle this booking. <a href="privacy.html" target="_blank" rel="noopener">Privacy policy</a></span>';
      b.insertAdjacentElement("beforebegin",lab);
    });
  }
  document.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("button");if(!b||!BTN.test(b.textContent)||b.closest("#pkgs,.pkg"))return;
    var box=containerOf(b);var lab=box&&box.querySelector(".nppdpa");if(!lab)return;
    if(!lab.querySelector("input").checked){e.preventDefault();e.stopImmediatePropagation();lab.classList.add("err");lab.scrollIntoView({block:"center",behavior:"smooth"});
      setTimeout(function(){lab.classList.remove("err")},2500)}
  },true);
  /* restaurant sign-up: photo rights */
  function photoRights(){
    var wrap=document.getElementById("npVPhotoWrap");if(!wrap||document.getElementById("npPhotoOk"))return;
    var lab=document.createElement("label");lab.className="nppdpa full";lab.id="npPhotoOkWrap";
    lab.innerHTML='<input type="checkbox" id="npPhotoOk"><span>I own this photo or have permission to use it, and Namaste Pattaya may show it in the app.</span>';
    wrap.insertAdjacentElement("afterend",lab);
    var go=document.getElementById("ppGo"),t=document.getElementById("ppT");
    if(go)go.addEventListener("click",function(e){
      if(!t||!/restaurant|food|cafe/i.test(t.value))return;
      if(!document.getElementById("npPhotoOk").checked){e.preventDefault();e.stopImmediatePropagation();var m=document.getElementById("ppM");if(m)m.textContent="Please confirm you have the right to use this photo.";lab.classList.add("err")}
    },true);
    if(t){var sync=function(){lab.style.display=/restaurant|food|cafe/i.test(t.value)?"":"none"};t.addEventListener("change",sync);sync()}
  }
  var busy=false;
  new MutationObserver(function(){if(busy)return;busy=true;setTimeout(function(){busy=false;try{scan();photoRights()}catch(e){}},160)}).observe(document.body,{childList:true,subtree:true});
})();

/* ===== Home: tagline line under the top bar, above Raju; compact Raju box; tighter spacing ===== */
(function(){
  if(!document.getElementById("npTagCss")){
    var st=document.createElement("style");st.id="npTagCss";
    st.textContent='.nptag{text-align:center;font-weight:600;font-size:15px;margin:6px 0 12px;color:#E9B949;letter-spacing:.01em}';
    document.head.appendChild(st);
  }
  function esc(s){return String(s||"").replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function lang(){try{return localStorage.getItem("np_lang")||"en"}catch(e){return "en"}}
  /* tagline line just above the main Raju box on home */
  function rajuCard(){
    var hits=[].slice.call(document.querySelectorAll("#cats ~ *, section *")).filter(function(el){
      return el.children.length<12&&/Raju/.test(el.textContent||"")&&/(Hindi bhi|ask me anything|हिंदी)/i.test(el.textContent||"")&&!el.closest("#panel,.sheet,#rajuChat");
    });
    /* the smallest block that is still a "card" */
    hits.sort(function(a,b){return a.textContent.length-b.textContent.length});
    var el=hits[0];if(!el)return null;
    while(el.parentElement&&el.parentElement.textContent.length<el.textContent.length+40&&el.parentElement.tagName!=="SECTION")el=el.parentElement;
    return el;
  }
  /* move the app's own tagline line (under "Namaste. Pattaya made easy…") to just above the Raju box */
  function buildTag(){
    var old=document.querySelector(".nptag");if(old)old.remove();
    var rc=rajuCard();if(!rc)return;
    var cands=[].slice.call(document.querySelectorAll("body *")).filter(function(el){
      var t=el.textContent||"";return /tohfa|तोहफ़ा|तोहफा/.test(t)&&t.length<220&&!el.closest("#panel,.sheet,#rajuChat,script,style")&&!rc.contains(el);
    });
    if(!cands.length)return;
    /* the smallest block that holds the whole tagline (English + Hindi together if they are side by side) */
    cands.sort(function(a,b){return a.textContent.length-b.textContent.length});
    var tag=cands.find(function(el){return /tohfa/i.test(el.textContent)&&/तोहफ/.test(el.textContent)})||cands[0];
    if(tag.dataset.npMoved)return;
    var box=rc;while(box.parentElement&&!box.parentElement.contains(tag))box=box.parentElement;
    if(!box.parentElement)return;
    box.parentElement.insertBefore(tag,box);
    tag.dataset.npMoved="1";tag.style.display="block";tag.style.textAlign="center";tag.style.margin="4px 0 10px";
  }
  /* Raju box on Home: keep it compact */
  function compactRaju(){
    var rc=rajuCard();if(!rc||rc.dataset.npCompact)return;rc.dataset.npCompact="1";
    rc.style.minHeight="0";rc.style.height="auto";rc.style.maxHeight="none";
    [].forEach.call(rc.querySelectorAll("img,svg,video,canvas"),function(m){if(m.closest("button"))return;var h=m.getBoundingClientRect().height;if(h>90){m.style.maxHeight="72px";m.style.width="auto";m.style.objectFit="contain"}});
    [].forEach.call(rc.querySelectorAll("*"),function(el){var cs=getComputedStyle(el);if(parseFloat(cs.minHeight)>120){el.style.minHeight="0"}if(parseFloat(cs.height)>320&&!el.querySelector("input,textarea")){el.style.height="auto"}});
  }
  /* less empty space between the money converter and Pattaya's Empowered Girls */
  var gapDone=false;window.addEventListener("hashchange",function(){gapDone=false});window.addEventListener("popstate",function(){gapDone=false});
  function tightenGap(){
    if(gapDone)return;
    var all=[].slice.call(document.querySelectorAll("section *"));
    function smallest(re){var h=all.filter(function(el){return re.test(el.textContent||"")&&!el.closest("#panel,.sheet")});h.sort(function(a,b){return a.textContent.length-b.textContent.length});return h[0]}
    var emp=smallest(/Empowered Girls/i),conv=smallest(/(currency|converter|convert|exchange)/i);
    if(!emp||!conv)return;
    function block(el){while(el.parentElement&&el.parentElement.tagName!=="SECTION"&&el.parentElement.children.length===1)el=el.parentElement;return el}
    var a=block(conv),b=block(emp);
    var p=a.parentElement;while(p&&!p.contains(b))p=p.parentElement;if(!p)return;
    function top(el){while(el.parentElement!==p)el=el.parentElement;return el}
    var ta=top(a),tb=top(b);if(ta===tb)return;
    for(var n=ta.nextElementSibling;n&&n!==tb;n=n.nextElementSibling){
      if(!(n.textContent||"").trim()&&!n.querySelector("img,svg,canvas,input,button,video,iframe"))n.style.display="none";
      else{n.style.marginTop="8px";n.style.marginBottom="8px"}
    }
    ta.style.marginBottom="12px";tb.style.marginTop="12px";gapDone=true;
    [ta,tb].forEach(function(el){if(parseFloat(getComputedStyle(el).minHeight)>0)el.style.minHeight="0"});
  }
  function run(){try{buildTag();compactRaju();tightenGap()}catch(e){}}
  var busy=false;
  new MutationObserver(function(){if(busy)return;busy=true;setTimeout(function(){busy=false;run()},200)}).observe(document.body,{childList:true,subtree:true});
  run();
})();

/* ===== Home upgrade (29 Sep 2026): Tonight in Pattaya, Pattaya today + safety, quick actions,
   club rows you can swipe, "Tables from" price label, smaller Raju above the nav bar,
   5-tab nav with a "More" tab (nothing deleted), readable text over the neon sign,
   clearer consent box, and bottom space so nothing hides behind the nav bar ===== */
(function(){
  var SVC=["grocery","indian","restaurants","hotels","spa","tours","water","golf","yacht","rental","airport","shopping","events","medical","concierge"];
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function norm(t){return String(t||"").replace(/\s+/g," ").trim()}
  function inPop(el){return !!(el&&el.closest&&el.closest("#panel,.sheet,#rajuChat,#svcPage,#npMoreSheet"))}
  function list(){return (typeof CLUBS!=="undefined"&&CLUBS)||[]}
  function isNight(c){return c&&SVC.indexOf(c.cat)<0&&!/restaurant/i.test(c.type||"")}
  function smallest(re,root,max){
    var h=[].slice.call((root||document).querySelectorAll("body *")).filter(function(el){
      var t=el.textContent||"";return re.test(t)&&(!max||t.length<max)&&!inPop(el)&&!/^(SCRIPT|STYLE)$/.test(el.tagName)});
    h.sort(function(a,b){return a.textContent.length-b.textContent.length});return h[0]||null;
  }

  /* ---------- styles (match the app: dark glass, purple-pink glow, gold text) ---------- */
  if(!document.getElementById("npHomeCss")){
    var st=document.createElement("style");st.id="npHomeCss";
    st.textContent=
    '#npHomeFill{margin:14px 0 6px;position:relative;z-index:1}'+
    '#npHomeFill .nph{display:flex;justify-content:space-between;align-items:baseline;margin:0 2px 10px}'+
    '#npHomeFill .nph h3{margin:0;font-size:19px;font-weight:700;color:var(--ink,#fff)}'+
    '#npHomeFill .nph span{font-size:13px;color:#E9B949;font-weight:600}'+
    '.nptrow{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding:2px 2px 8px;-webkit-overflow-scrolling:touch;scrollbar-width:none}'+
    '.nptrow::-webkit-scrollbar{display:none}'+
    '.nptcard{flex:0 0 72%;max-width:280px;scroll-snap-align:start;border-radius:20px;overflow:hidden;cursor:pointer;text-align:left;padding:0;color:var(--ink,#fff);font:inherit;'+
      'background:rgba(16,13,28,.62);border:1px solid rgba(199,160,255,.38);box-shadow:0 0 18px rgba(170,110,255,.16);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}'+
    '.nptcard .ph{height:92px;background-size:cover;background-position:center;position:relative}'+
    '.nptcard .ph:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 30%,rgba(10,8,20,.85))}'+
    '.nptcard .bd{padding:10px 12px 12px}'+
    '.nptcard .tm{font-size:12px;color:#E9B949;font-weight:600}'+
    '.nptcard .nm{font-size:16px;font-weight:700;margin:2px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
    '.nptcard .sb{font-size:12.5px;opacity:.72;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
    '.nptcard .go{display:inline-block;margin-top:9px;font-size:12.5px;font-weight:600;padding:5px 12px;border-radius:999px;border:1px solid rgba(237,147,177,.6);color:#F7C4D8}'+
    '.npstrip{display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between;align-items:center;margin:8px 0 0;padding:10px 12px;border-radius:16px;'+
      'background:rgba(16,13,28,.62);border:1px solid rgba(255,255,255,.1);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);font-size:13px;color:var(--ink,#fff)}'+
    '.npstrip .wx{display:flex;align-items:center;gap:6px;opacity:.9}'+
    '.npstrip .sos{display:flex;gap:6px}'+
    '.npstrip .sos a{text-decoration:none;font-size:12px;font-weight:600;padding:4px 9px;border-radius:999px;border:1px solid rgba(255,120,120,.55);color:#FFB4B4;white-space:nowrap}'+
    '.npqa{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:10px}'+
    '.npqa button{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 4px;border-radius:16px;font:inherit;font-size:12px;font-weight:600;color:var(--ink,#fff);cursor:pointer;'+
      'background:rgba(16,13,28,.62);border:1px solid rgba(255,255,255,.1);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}'+
    '.npqa button svg{color:#ED93B1}'+
    /* club rows you can swipe */
    '.npswipe{display:flex!important;flex-wrap:nowrap!important;gap:12px!important;overflow-x:auto!important;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:6px}'+
    '.npswipe::-webkit-scrollbar{display:none}'+
    '.npswipe>*{flex:0 0 82%!important;max-width:340px!important;width:auto!important;scroll-snap-align:start;margin:0!important}'+
    /* readable text over the neon background */
    '.npreadable{background:rgba(12,10,22,.78)!important;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);position:relative;z-index:1}'+
    /* consent box: solid panel, bright checkbox */
    '.nppdpa{background:rgba(18,14,30,.94)!important;border:1px solid rgba(237,147,177,.5);border-radius:14px;padding:12px 14px!important;opacity:1!important;color:#F3EFFF;position:relative;z-index:2}'+
    '.nppdpa input[type=checkbox]{-webkit-appearance:none;appearance:none;width:22px!important;height:22px!important;flex:0 0 22px!important;border:2px solid #ED93B1;border-radius:6px;background:transparent;margin:0!important;cursor:pointer}'+
    '.nppdpa input[type=checkbox]:checked{background:#ED93B1 url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%231a1026%27 stroke-width=%273.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27M5 12l5 5 9-10%27/%3E%3C/svg%3E") center/16px no-repeat}'+
    '.nppdpa.err{border-color:#ff6b5b}'+
    /* More sheet */
    '#npMoreSheet{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center}'+
    '#npMoreSheet .in{width:100%;max-width:520px;margin:0 10px calc(12px + env(safe-area-inset-bottom));padding:16px;border-radius:22px;background:rgba(18,14,30,.97);border:1px solid rgba(199,160,255,.38);box-shadow:0 0 24px rgba(170,110,255,.2);color:var(--ink,#fff)}'+
    '#npMoreSheet h4{margin:0 0 12px;font-size:17px}'+
    '#npMoreSheet .it{display:flex;align-items:center;gap:12px;width:100%;padding:14px;margin-top:8px;border-radius:14px;font:inherit;font-size:15px;font-weight:600;color:inherit;text-align:left;cursor:pointer;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1)}'+
    '#npMoreSheet .it svg{color:#ED93B1;flex:0 0 auto}'+
    '#npMoreSheet .x{width:100%;margin-top:12px;padding:12px;border-radius:14px;font:inherit;font-weight:600;color:inherit;background:transparent;border:1px solid rgba(255,255,255,.18);cursor:pointer}'+
    '@media (prefers-reduced-motion:reduce){.nptrow,.npswipe{scroll-behavior:auto}}'+
    /* compact version, as in the agreed preview */
    '#npHomeFill .nph{margin-bottom:8px}#npHomeFill .nph h3{font-size:17px}#npHomeFill .npall{cursor:pointer;font-size:13px}'+
    '.nptrow{gap:10px}'+
    '.nptcard{flex:0 0 42%;max-width:170px;min-height:118px;position:relative;display:flex;flex-direction:column;justify-content:flex-end;border-radius:16px}'+
    '.nptcard .ph{position:absolute;inset:0;height:auto}'+
    '.nptcard .ph:after{background:linear-gradient(180deg,rgba(10,8,20,.25) 0%,rgba(10,8,20,.92) 70%)}'+
    '.nptcard .bd{position:relative;z-index:1;padding:9px 10px 10px}'+
    '.nptcard .tm{font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
    '.nptcard .nm{font-size:14px;margin:1px 0}.nptcard .sb{font-size:11px}'+
    '.nptcard .go{margin-top:4px;padding:0;border:0;border-radius:0;font-size:11px;color:#ED93B1}'+
    '.npstrip{flex-wrap:nowrap;gap:6px;padding:7px 10px;border-radius:12px;font-size:12px}'+
    '.npstrip .wx{gap:5px;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.npstrip .wx span{overflow:hidden;text-overflow:ellipsis}'+
    '.npstrip .sos{flex:0 0 auto;gap:5px}.npstrip .sos a{font-size:11px;padding:3px 8px}'+
    '.npqa{gap:6px;margin-top:8px}'+
    '.npqa button{gap:4px;padding:8px 2px;border-radius:12px;font-size:11px}.npqa button svg{width:18px;height:18px}';
    document.head.appendChild(st);
  }

  function ic(d){return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>'}
  var I={
    table:ic('<path d="M4 10h16M6 10v9M18 10v9M8 6h8l2 4H6z"/>'),
    plane:ic('<path d="M3 20h18M4 14l16-4-1-3-6 1-5-5H6l2 6-4 1z"/>'),
    food:ic('<path d="M6 3v8a2 2 0 0 0 4 0V3M8 11v10M16 3c-2 2-2 6 0 8v10"/>'),
    island:ic('<path d="M3 20c3-2 6-2 9 0s6 2 9 0M12 18V8M12 8c-3-3-6-2-7 0M12 8c3-3 6-2 7 0M12 8c-1-3-3-4-5-4"/>'),
    sun:ic('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    dots:ic('<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>'),
    chat:ic('<path d="M4 5h16v11H9l-5 4z"/>'),
    wallet:ic('<path d="M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H3zM3 7l12-3v3M16 13h2"/>'),
    plus:ic('<path d="M12 5v14M5 12h14"/>')
  };

  /* ---------- open a venue the same way a tap on its card does ---------- */
  function openVenue(c){
    if(!c)return;
    /* open the venue's booking page directly (same screen as tapping a club card) */
    if(typeof openClub==="function"){try{if(typeof window.npTrack==="function")window.npTrack("place_view",c.id)}catch(e){}openClub(c);return}
    var card=document.querySelector('[data-id="'+(window.CSS&&CSS.escape?CSS.escape(c.id):c.id)+'"]');
    if(card){card.click();return}
    if(typeof window.openService==="function"&&SVC.indexOf(c.cat)>-1){window.openService(c.cat);return}
    scrollToClubs();
  }
  function scrollToClubs(){
    var h=[].slice.call(document.querySelectorAll("h2,h3")).find(function(x){return /clubs/i.test(x.textContent)&&!inPop(x)});
    if(h)h.scrollIntoView({behavior:"smooth",block:"start"});
  }
  function svc(cat){if(typeof window.openService==="function")window.openService(cat)}

  /* ---------- Tonight in Pattaya + Pattaya today + quick actions ---------- */
  var dayLabel="Tonight";
  function tonightCards(){
    var cl=list().filter(function(c){return c&&c.id!=="np-test-restaurant"});
    var night=cl.filter(isNight),food=cl.filter(function(c){return c.cat==="indian"});
    return night.slice(0,6).concat(food.slice(0,3));
  }
  function cardHtml(c,i){
    var bg=c.photo?'url(\''+esc(c.photo)+'\')':'linear-gradient(135deg,'+esc((c.art||[])[0]||"#534AB7")+','+esc((c.art||[])[1]||"#26215C")+')';
    var open=norm(c.open||"").split(/\s[—–-]\s|[–]/)[0].trim();if(!/\d/.test(open))open=open.split(/[—,]/)[0].trim();
    return '<button type="button" class="nptcard" data-npi="'+i+'"><div class="ph" style="background-image:'+bg+'"></div><div class="bd">'+
      '<div class="tm">'+esc(/\d/.test(open)?("From "+open):(open||"Open late"))+(c.area?" · "+esc(c.area):"")+'</div>'+
      '<div class="nm">'+esc(c.name)+'</div><div class="sb">'+esc(c.music||c.sub||"")+'</div>'+
      '<span class="go">'+(isNight(c)?"Book a table":"Book now")+'</span></div></button>';
  }
  /* taps on "Tonight in Pattaya": work even if another layer of the page lies on top of the cards */
  var lastCards=[];
  if(!document.getElementById("npTapCss")){var tc=document.createElement("style");tc.id="npTapCss";
    tc.textContent='#npHomeFill{position:relative;z-index:6}#npHomeFill .nptcard,#npHomeFill [data-qa],#npHomeFill .npall{position:relative;z-index:7;touch-action:pan-x pan-y}';document.head.appendChild(tc)}
  function tapTarget(e){
    var els=document.elementsFromPoint?document.elementsFromPoint(e.clientX,e.clientY):[e.target];
    for(var i=0;i<els.length;i++){var el=els[i];if(!el||!el.closest)continue;
      if(el.closest("#panel,.sheet,#npMoreSheet,#rajuChat"))return null;
      var hit=el.closest("#npHomeFill .nptcard,#npHomeFill [data-qa],#npHomeFill .npall");if(hit)return hit;
      if(el.closest("button,a,input,select,textarea,label"))return null;}
    return null;
  }
  document.addEventListener("click",function(e){
    if(e.clientX==null)return;var t=tapTarget(e);if(!t)return;
    e.preventDefault();e.stopPropagation();
    if(t.classList.contains("nptcard")){openVenue(lastCards[+t.dataset.npi]);return}
    if(t.classList.contains("npall")){scrollToClubs();return}
    var q=t.dataset.qa;if(q==="table")scrollToClubs();else svc(q);
    try{if(window.npTrack)window.npTrack("service_open","quick_"+q)}catch(x){}
  },true);
  function renderTonight(box){
    var cards=tonightCards(),row=box.querySelector(".nptrow"),h=box.querySelector(".nph h3");lastCards=cards;
    if(h)h.textContent=(dayLabel==="Tonight"?"Tonight":dayLabel)+" in Pattaya";
    if(!row)return;
    row.innerHTML=cards.length?cards.map(cardHtml).join(""):'<div class="sb" style="opacity:.7;padding:8px">Venues appear here as partners join.</div>';
    [].forEach.call(row.querySelectorAll(".nptcard"),function(b){b.onclick=function(){openVenue(cards[+b.dataset.npi])}});
  }
  var WX={0:"Clear",1:"Mostly clear",2:"Partly cloudy",3:"Cloudy",45:"Fog",48:"Fog",51:"Drizzle",53:"Drizzle",55:"Drizzle",61:"Light rain",63:"Rain",65:"Heavy rain",80:"Showers",81:"Showers",82:"Heavy showers",95:"Thunderstorm",96:"Thunderstorm",99:"Thunderstorm"};
  var wxText=null;
  function loadWeather(box){
    var el=box.querySelector(".wx span");if(!el)return;
    if(wxText){el.textContent=wxText;return}
    try{
      fetch("https://api.open-meteo.com/v1/forecast?latitude=12.93&longitude=100.88&current=temperature_2m,weather_code&daily=sunset&timezone=Asia%2FBangkok&forecast_days=1")
      .then(function(r){return r.json()}).then(function(d){
        var t=Math.round(d.current.temperature_2m),w=WX[d.current.weather_code]||"",ss=(d.daily&&d.daily.sunset&&d.daily.sunset[0]||"").slice(11,16);
        wxText=t+"°C"+(w?" "+w.toLowerCase():"")+(ss?" · Sunset "+ss:"");
        var e=document.querySelector("#npHomeFill .wx span");if(e)e.textContent=wxText;
      }).catch(function(){});
    }catch(e){}
  }
  function build(){
    var box=document.createElement("div");box.id="npHomeFill";
    box.innerHTML='<div class="nph"><h3>Tonight in Pattaya</h3><span class="npall" role="button" tabindex="0">See all</span></div><div class="nptrow"></div>'+
      '<div class="npstrip"><div class="wx">'+I.sun.replace(/22/g,"16")+'<span>Pattaya today</span></div>'+
      '<div class="sos"><a href="tel:1155">Police 1155</a><a href="tel:1669">SOS 1669</a></div></div>'+
      '<div class="npqa">'+
        '<button type="button" data-qa="table">'+I.table+'Table</button>'+
        '<button type="button" data-qa="airport">'+I.plane+'Pickup</button>'+
        '<button type="button" data-qa="indian">'+I.food+'Indian food</button>'+
        '<button type="button" data-qa="tours">'+I.island+'Island tour</button></div>';
    box.querySelector(".npall").onclick=scrollToClubs;
    [].forEach.call(box.querySelectorAll("[data-qa]"),function(b){b.onclick=function(){
      var q=b.dataset.qa;if(q==="table")scrollToClubs();else svc(q);
      try{if(window.npTrack)window.npTrack("service_open","quick_"+q)}catch(e){}
    }});
    return box;
  }
  function placeFill(){
    if(document.getElementById("npHomeFill"))return;
    var conv=smallest(/approx\.?\s*rate/i,null,400)||smallest(/(currency|converter)/i,null,400);
    if(!conv)return;
    var emp=smallest(/Empowered Girls/i,null,400);
    var anchor=conv;
    if(emp){var p=conv.parentElement;while(p&&!p.contains(emp))p=p.parentElement;
      if(p){anchor=conv;while(anchor.parentElement!==p)anchor=anchor.parentElement}}
    else{while(anchor.parentElement&&anchor.parentElement.tagName!=="SECTION")anchor=anchor.parentElement}
    var box=build();anchor.insertAdjacentElement("afterend",box);
    renderTonight(box);loadWeather(box);
  }
  /* date chips (Tonight, Wed 30, ...) change the heading */
  document.addEventListener("click",function(e){
    var el=e.target;if(!el||!el.closest||inPop(el))return;
    for(var i=0;i<4&&el;i++,el=el.parentElement){
      var t=norm(el.textContent);var m=t.match(/^(tonight|today|mon|tue|wed|thu|fri|sat|sun)[a-z]*\s*(\d{1,2})$/i);
      if(m){dayLabel=/tonight|today/i.test(m[1])?"Tonight":(m[1].charAt(0).toUpperCase()+m[1].slice(1,3).toLowerCase()+" "+m[2]);
        var b=document.getElementById("npHomeFill");if(b)renderTonight(b);return}
    }
  },true);

  /* ---------- club rows you can swipe ---------- */
  function swipeRows(){
    [].forEach.call(document.querySelectorAll("h2,h3"),function(h){
      if(!/clubs/i.test(h.textContent)||inPop(h)||h.closest("#npHomeFill"))return;
      var sc=h.parentElement,first=null;
      for(var n=h.nextElementSibling,k=0;n&&k<4&&!first;n=n.nextElementSibling,k++){if(/^H[1-3]$/.test(n.tagName))break;first=n.matches("[data-id]")?n:n.querySelector("[data-id]")}
      if(!first&&sc){var nx=sc.nextElementSibling;if(nx&&!nx.querySelector("h2"))first=nx.querySelector("[data-id]")}
      if(!first)return;
      var row=first.parentElement;
      if(row&&!row.classList.contains("npswipe")&&row.querySelectorAll(":scope>[data-id]").length>1)row.classList.add("npswipe");
    });
  }

  /* ---------- "from ₹7,800" becomes "Tables from ₹7,800" on nightlife cards ---------- */
  function priceLabels(){
    [].forEach.call(document.querySelectorAll("[data-id]"),function(card){
      if(card.dataset.npTbl)return;
      var c=list().find(function(x){return x.id===card.dataset.id});if(!isNight(c))return;
      var w=document.createTreeWalker(card,NodeFilter.SHOW_TEXT,null),n;
      while((n=w.nextNode())){if(/^\s*from\s*(?=[₹฿$\d])/i.test(n.nodeValue)||/^\s*from\s*$/i.test(n.nodeValue)&&n.parentElement&&/^\s*from\s*[₹฿]/i.test(n.parentElement.textContent)){
        n.nodeValue=n.nodeValue.replace(/^(\s*)from/i,"$1Tables from");card.dataset.npTbl="1";break}}
    });
  }

  /* ---------- bottom nav: 5 tabs + "More" (Concierge, Earn, For clubs stay, just moved) ---------- */
  var MORE=["Concierge","Earn","For clubs"],moreBtn=null,navInfo=null;
  function findNav(){
    var navs=[].slice.call(document.querySelectorAll("nav, [role=navigation]")).filter(function(n){var t=norm(n.textContent);return /Explore/.test(t)&&/Bookings/.test(t)});
    var nav=navs[0];if(!nav)return null;
    function item(label){var h=[].slice.call(nav.querySelectorAll("*")).filter(function(el){return norm(el.textContent)===label});h.sort(function(a,b){return a.querySelectorAll("*").length-b.querySelectorAll("*").length});return h[0]}
    var a=item("Explore"),b=item("Map");if(!a||!b)return null;
    var p=a.parentElement;while(p&&!p.contains(b))p=p.parentElement;if(!p)return null;
    function top(el){while(el&&el.parentElement!==p)el=el.parentElement;return el}
    var items={};[].forEach.call(p.children,function(ch){var t=norm(ch.textContent);if(t)items[t]=ch});
    return {nav:nav,row:p,items:items,top:top};
  }
  function setupNav(){
    if(moreBtn&&document.body.contains(moreBtn))return;
    var n=findNav();if(!n)return;
    var hidden=MORE.map(function(l){return n.items[l]}).filter(Boolean);if(hidden.length<2)return;
    var tpl=n.items["Buddy"]||n.items["Map"];if(!tpl)return;
    moreBtn=tpl.cloneNode(true);
    moreBtn.removeAttribute("onclick");moreBtn.removeAttribute("id");moreBtn.removeAttribute("href");
    [].forEach.call(moreBtn.querySelectorAll("[onclick],[id]"),function(x){x.removeAttribute("onclick");x.removeAttribute("id")});
    Object.keys(moreBtn.dataset).forEach(function(k){delete moreBtn.dataset[k]});
    var tw=document.createTreeWalker(moreBtn,NodeFilter.SHOW_TEXT,null),tn,done=false,tns=[];
    while((tn=tw.nextNode()))if(tn.nodeValue.trim())tns.push(tn);
    tns.forEach(function(x){if(!done){x.nodeValue=x.nodeValue.replace(/\S[\s\S]*\S|\S/,"More");done=true}else x.nodeValue=""});
    if(!done)moreBtn.appendChild(document.createTextNode("More"));
    var sv=moreBtn.querySelector("svg,img,i");if(sv){var t=document.createElement("span");t.innerHTML=I.dots;var ns=t.firstChild;ns.setAttribute("width",sv.getAttribute("width")||"24");ns.setAttribute("height",sv.getAttribute("height")||"24");sv.replaceWith(ns)}
    moreBtn.id="npMoreTab";moreBtn.setAttribute("aria-label","More");
    moreBtn.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();openMore(hidden)});
    var base=tpl.className;
    hidden.forEach(function(h){h.dataset.npBase=h.className;h.style.display="none";h.dataset.npMoved="more"});
    var last=hidden[hidden.length-1];last.insertAdjacentElement("afterend",moreBtn);
    base=base.split(/\s+/).filter(function(c){return !/^(on|active|sel|selected|current|cur)$/i.test(c)}).join(" ");
    moreBtn.className=base;
    var cs=getComputedStyle(n.row);if(cs.display==="grid")n.row.style.gridTemplateColumns="repeat("+[].filter.call(n.row.children,function(c){return c.style.display!=="none"}).length+",minmax(0,1fr))";
    navInfo={row:n.row,hidden:hidden,tpl:tpl};
    /* light up "More" when one of its tabs is the open page */
    new MutationObserver(function(){
      var extra=[];hidden.forEach(function(h){h.className.split(/\s+/).forEach(function(c){if(c&&h.dataset.npBase.split(/\s+/).indexOf(c)<0&&extra.indexOf(c)<0)extra.push(c)})});
      var want=extra.length?base+" "+extra.join(" "):base;
      if(moreBtn.className!==want)moreBtn.className=want;
    }).observe(n.row,{attributes:true,subtree:true,attributeFilter:["class"]});
  }
  function openMore(hidden){
    var old=document.getElementById("npMoreSheet");if(old)old.remove();
    var ico={"Concierge":I.chat,"Earn":I.wallet,"For clubs":I.plus};
    var sh=document.createElement("div");sh.id="npMoreSheet";
    sh.innerHTML='<div class="in" role="dialog" aria-label="More"><h4>More</h4>'+hidden.map(function(h,i){var t=norm(h.textContent);return '<button type="button" class="it" data-i="'+i+'">'+(ico[t]||I.dots)+esc(t)+'</button>'}).join("")+'<button type="button" class="x">Close</button></div>';
    sh.addEventListener("click",function(e){
      var it=e.target.closest(".it");
      if(it){sh.remove();var h=hidden[+it.dataset.i];var clk=h.matches("button,a,[onclick]")?h:(h.querySelector("button,a,[onclick]")||h);clk.click();return}
      if(e.target===sh||e.target.closest(".x"))sh.remove();
    });
    document.body.appendChild(sh);
  }

  /* ---------- smaller floating Raju above the nav bar + bottom space ---------- */
  function navGap(){
    var n=document.querySelector("#npMoreTab");var nav=n&&n.closest("nav,[role=navigation]");
    if(!nav){var f=findNav();nav=f&&f.nav}
    if(!nav)return 0;var r=nav.getBoundingClientRect();if(!r.height)return 0;return Math.max(0,window.innerHeight-r.top);
  }
  var fab=null;
  function findFab(){
    if(fab&&document.body.contains(fab))return fab;
    var W=window.innerWidth,H=window.innerHeight,best=null;
    [].forEach.call(document.querySelectorAll("body *"),function(el){
      if(el.closest("nav,[role=navigation],#panel,.sheet,#rajuChat,#npMoreSheet,#npHomeFill"))return;
      if(getComputedStyle(el).position!=="fixed")return;
      var r=el.getBoundingClientRect();
      if(r.width<40||r.width>260||r.height<40||r.height>260||r.right<W*0.6||r.bottom<H*0.5)return;
      if(!el.querySelector("img,svg,canvas,video")&&!/raju|help chahiye/i.test(el.textContent||""))return;
      if(el.querySelector("nav")||best)return;
      best=el;
    });
    var p=best;while(p&&p.parentElement&&p.parentElement!==document.body){if(getComputedStyle(p.parentElement).position==="fixed"){var pr=p.parentElement.getBoundingClientRect();if(pr.width<=260&&pr.height<=260)best=p.parentElement}p=p.parentElement}
    return fab=best;
  }
  function placeRaju(){
    var g=navGap();if(!g)return;
    var f=findFab();
    if(f){f.style.setProperty("scale","0.66");f.style.setProperty("transform-origin","100% 100%");
      f.style.setProperty("top","auto","important");f.style.setProperty("bottom",(g+10)+"px","important");f.style.setProperty("right","12px","important");f.dataset.npFab="1"}
    var pad=(g+28)+"px";
    document.body.style.paddingBottom=pad;
    [].forEach.call(document.querySelectorAll("main,section,#home,#explore,#night,#cats,.page,.screen,.view"),function(el){
      if(el.closest("#panel,.sheet,#rajuChat"))return;
      var cs=getComputedStyle(el);if(/(auto|scroll)/.test(cs.overflowY)&&el.clientHeight>window.innerHeight*0.6)el.style.paddingBottom=pad;
    });
  }

  /* ---------- readable text over the neon sign ---------- */
  function readable(){
    [/Pattaya made easy for Indian travellers/i,/^\s*Tonight\b.{8,}/i].forEach(function(re){
      var el=smallest(re,null,260);if(!el||el.closest("#npHomeFill")||el.dataset.npRead)return;
      var box=el;
      for(var i=0;i<3&&box.parentElement;i++){var cs=getComputedStyle(box);if(parseFloat(cs.borderTopWidth)>0||parseFloat(cs.borderTopLeftRadius)>=10)break;box=box.parentElement}
      if(box.tagName==="SECTION"||box===document.body)box=el;
      box.classList.add("npreadable");el.dataset.npRead="1";
    });
  }

  function closeGap(){
    var box=document.getElementById("npHomeFill");if(!box||!box.offsetParent)return;
    var conv=smallest(/approx\.?\s*rate/i,null,400)||smallest(/(currency|converter)/i,null,400);if(!conv)return;
    var row=conv;for(var i=0;i<6&&row.parentElement;i++){if(/Language/i.test(row.textContent)&&!row.contains(box))break;row=row.parentElement}
    if(row.contains(box))row=conv;
    var cur=parseFloat(box.style.marginTop)||0;
    var stuff=box.getBoundingClientRect().top-row.getBoundingClientRect().bottom-cur;
    var want=stuff>16?(16-stuff):14;
    if(Math.abs(want-cur)>1)box.style.marginTop=Math.round(want)+"px";
  }
  function run(){
    [placeFill,swipeRows,priceLabels,setupNav,placeRaju,readable,closeGap].forEach(function(f){try{f()}catch(e){}});
  }
  var busy=false;
  new MutationObserver(function(m){
    if(busy)return;
    if(m.every(function(x){return x.target&&x.target.closest&&x.target.closest("#npHomeFill,#npMoreSheet")}))return;
    busy=true;setTimeout(function(){busy=false;run()},250);
  }).observe(document.body,{childList:true,subtree:true});
  window.addEventListener("resize",function(){setTimeout(function(){placeRaju();closeGap()},100)});
  window.addEventListener("load",function(){setTimeout(closeGap,300)});
  run();setTimeout(run,800);setTimeout(run,2500);
})();

/* ===== Indian food services (29 Sep 2026):
   "Restaurants" is now "Indian Restaurants – Only Veg" (Shudh Shakahari)
   "Indian Restaurants" is now "Indian Restaurants – Veg & Non-Veg"
   10 food categories inside both. Nothing deleted: places not confirmed pure veg move to Veg & Non-Veg. ===== */
(function(){
  var VEG="restaurants",MIX="indian";
  var VEG_NAME="Indian Restaurants – Only Veg",MIX_NAME="Indian Restaurants – Veg & Non-Veg";
  /* Restaurant ids whose OWNER confirmed 100% pure veg (no meat, no fish, no egg). Add an id only after confirmation. */
  var VEG_IDS=[];
  var COMMON=[
    ["punjabi","Punjabi",/punjab|amritsar|kulcha|tandoor|north indian/i],
    ["gujarati","Gujarati",/gujarat|dhokla|thepla|khakhra/i],
    ["rajasthani","Rajasthani",/rajasthan|marwar|dal baati|baati/i],
    ["south","South Indian",/south indian|dosa|idli|madras|chettinad|kerala|udupi/i],
    ["maharashtrian","Maharashtrian",/maharash|mumbai|vada pav|pav bhaji|misal/i],
    ["bengali","Bengali",/bengal|kolkata|calcutta/i]
  ];
  var TAIL=[
    ["street","Street Food & Chaat",/street food|chaat|pani ?puri|golgappa/i],
    ["indochinese","Indo-Chinese",/indo.?chinese|hakka|manchurian/i],
    ["thali","Thali & Mithai",/thali|mithai|sweets|halwai/i]
  ];
  var CUIS={};
  CUIS[VEG]=COMMON.concat([["jain","Jain food",/\bjain\b/i]],TAIL);
  CUIS[MIX]=COMMON.concat([["mughlai","Mughlai",/mughlai|biryani|kebab|awadhi|hyderabad/i]],TAIL);
  var sel={};sel[VEG]="all";sel[MIX]="all";

  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function list(){return (typeof CLUBS!=="undefined"&&CLUBS)||[]}
  function isVeg(c){return !!(c&&(c.veg===true||c.pureVeg===true||VEG_IDS.indexOf(c.id)>-1))}
  function catNow(){var s=history.state;if(s&&s.np==="s"&&s.cat)return s.cat;var h=location.hash;return h.indexOf("#s/")===0?decodeURIComponent(h.slice(3)):null}
  function rerender(){["renderGrid","renderRail","renderCats","renderMap"].forEach(function(f){try{if(typeof window[f]==="function")window[f]()}catch(e){}})}

  /* 1. new names in the app's data */
  function names(){
    try{
      if(typeof CATS!=="undefined")CATS.forEach(function(c){if(!Array.isArray(c))return;
        for(var i=1;i<c.length;i++){if(c[0]===VEG&&c[i]==="Restaurants")c[i]=VEG_NAME;if(c[0]===MIX&&/^Indian restaurants$/i.test(String(c[i])))c[i]=MIX_NAME}});
      if(typeof CATNAME!=="undefined"){CATNAME[VEG]=VEG_NAME;CATNAME[MIX]=MIX_NAME}
    }catch(e){}
  }
  /* 2. only confirmed pure-veg places stay in Only Veg; the rest move to Veg & Non-Veg */
  function move(){
    var n=0;list().forEach(function(c){if(c&&c.cat===VEG&&!isVeg(c)){c.cat=MIX;c.npMovedFromRestaurants=true;n++}});
    if(n)rerender();return n;
  }
  /* 3. new names on screen */
  var TXT={"Restaurants":VEG_NAME,"Indian Restaurants":MIX_NAME,"Indian restaurants":MIX_NAME};
  function fixText(){
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),n,todo=[];
    while((n=w.nextNode())){var t=(n.nodeValue||"").trim();if(TXT[t])todo.push(n)}
    todo.forEach(function(n){var t=n.nodeValue.trim();n.nodeValue=n.nodeValue.replace(t,TXT[t])});
  }

  /* 4. the 10 food categories inside both services */
  if(!document.getElementById("npCuisCss")){
    var st=document.createElement("style");st.id="npCuisCss";
    st.textContent='#npCuis{margin:10px 0 14px}'+
      '#npCuis .vegnote{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;margin:0 0 10px;border-radius:14px;font-size:13px;line-height:1.4;color:var(--ink,#fff);background:rgba(20,120,60,.18);border:1px solid rgba(60,200,110,.55)}'+
      '#npCuis .vegdot{flex:0 0 18px;height:18px;margin-top:1px;border:2px solid #2FBF62;border-radius:3px;display:flex;align-items:center;justify-content:center}'+
      '#npCuis .vegdot:after{content:"";width:8px;height:8px;border-radius:50%;background:#2FBF62}'+
      '#npCuis .row{display:flex;gap:8px;overflow-x:auto;padding:2px 2px 6px;scrollbar-width:none;-webkit-overflow-scrolling:touch}'+
      '#npCuis .row::-webkit-scrollbar{display:none}'+
      '#npCuis button{flex:0 0 auto;padding:9px 14px;border-radius:999px;font:inherit;font-size:13px;font-weight:600;white-space:nowrap;cursor:pointer;color:var(--ink,#fff);background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.18)}'+
      '#npCuis button.on{background:#E9B949;border-color:#E9B949;color:#1a1026}'+
      '#npCuisEmpty{margin:10px 0;padding:14px;border-radius:14px;font-size:14px;line-height:1.45;text-align:center;color:var(--ink,#fff);background:rgba(255,255,255,.05);border:1px dashed rgba(255,255,255,.25)}';
    document.head.appendChild(st);
  }
  function venueOf(card){
    var id=card.getAttribute&&(card.getAttribute("data-id")||card.getAttribute("data-club"));
    var L=list(),c=id?L.find(function(x){return x.id===id}):null;if(c)return c;
    var nm=card.querySelector&&card.querySelector(".name");
    if(nm){var t=nm.textContent.trim();c=L.find(function(x){return x.name===t});if(c)return c}
    var txt=card.textContent||"",best=null;
    L.forEach(function(x){if(x.name&&txt.indexOf(x.name)>-1&&(!best||x.name.length>best.name.length))best=x});
    return best;
  }
  function matches(c,key,re){
    if(!c)return false;
    if(c.cuisine===key||(Array.isArray(c.cuisine)&&c.cuisine.indexOf(key)>-1))return true;
    return re.test([c.name,c.sub,c.music,c.about,c.type,(c.tags||[]).join(" ")].join(" "));
  }
  function render(){
    var svc=document.getElementById("svcPage");if(!svc)return;
    var cat=catNow(),bar=svc.querySelector("#npCuis"),emp=svc.querySelector("#npCuisEmpty");
    if(svc.hidden||!CUIS[cat]){if(bar)bar.remove();if(emp)emp.remove();return}
    var grid=svc.querySelector("#svcGrid");
    if(!bar||bar.dataset.cat!==cat){
      if(bar)bar.remove();sel[cat]="all";
      bar=document.createElement("div");bar.id="npCuis";bar.dataset.cat=cat;
      bar.innerHTML=(cat===VEG?'<div class="vegnote"><span class="vegdot" aria-hidden="true"></span><span><b>Shudh Shakahari · 100% pure veg.</b> No meat, no fish, no egg. We list a restaurant here only after the owner confirms it.</span></div>':'')+
        '<div class="row" role="tablist"><button type="button" class="on" data-k="all">All</button>'+
        CUIS[cat].map(function(x){return '<button type="button" data-k="'+x[0]+'">'+esc(x[1])+'</button>'}).join("")+'</div>';
      if(grid&&grid.parentNode)grid.parentNode.insertBefore(bar,grid);
      else{var h=svc.querySelector("h2");if(h)h.insertAdjacentElement("afterend",bar);else svc.insertBefore(bar,svc.firstChild)}
      bar.querySelectorAll("[data-k]").forEach(function(b){b.onclick=function(){
        sel[cat]=b.dataset.k;bar.querySelectorAll("[data-k]").forEach(function(x){x.classList.toggle("on",x===b)});filter();
        try{if(typeof window.npTrack==="function")window.npTrack("food_category",cat+":"+b.dataset.k)}catch(e){}
      }});
    }
    filter();
  }
  function filter(){
    var svc=document.getElementById("svcPage");if(!svc)return;
    var cat=catNow();if(!CUIS[cat])return;
    var grid=svc.querySelector("#svcGrid"),k=sel[cat]||"all";
    var item=CUIS[cat].find(function(x){return x[0]===k}),shown=0;
    if(grid)[].forEach.call(grid.children,function(card){
      if(card.id==="npCuisEmpty")return;
      var c=venueOf(card);if(!c){if(card.offsetParent!==null)shown++;return}
      var ok=(cat!==VEG||isVeg(c))&&(k==="all"||matches(c,k,item[2]));
      var want=ok?"":"none";if(card.style.display!==want)card.style.display=want;
      if(ok)shown++;
    });
    var emp=svc.querySelector("#npCuisEmpty");
    var msg=shown?"":(k!=="all"?"No "+item[1]+" restaurants here yet. Coming soon.":
      (cat===VEG?"Pure-veg restaurants are joining soon. Own a pure-veg Indian restaurant? Register as a partner from your account.":"Indian restaurants are joining soon."));
    if(!msg){if(emp)emp.remove();return}
    if(!emp){emp=document.createElement("div");emp.id="npCuisEmpty";
      if(grid&&grid.parentNode)grid.insertAdjacentElement("afterend",emp);else svc.appendChild(emp)}
    if(emp.textContent!==msg)emp.textContent=msg;
  }

  /* 5. food type and food categories chosen by restaurant owners (restaurant dashboard) */
  var FOODROWS=[];
  function applyFood(){
    var n=0;FOODROWS.forEach(function(r){
      var c=list().find(function(x){return x.id===r.venue_id});
      if(!c||(c.cat!==VEG&&c.cat!==MIX))return;
      if(Array.isArray(r.cuisines)&&r.cuisines.length)c.cuisine=r.cuisines;
      c.foodType=r.food_type;
      var want=r.food_type==="veg"?VEG:MIX;c.veg=r.food_type==="veg";
      if(c.cat!==want){c.cat=want;n++}
    });
    if(n)rerender();
  }
  function loadFood(){
    try{if(!window.supabase)return;
      var cl=window.supabase.createClient("https://mymtgbmcjbwsnetzwgoy.supabase.co","sb_publishable_ViFodxG8kAENr78Fyp-BwQ_iA_BfAD0");
      cl.rpc("np_venue_food").then(function(r){if(r&&!r.error&&Array.isArray(r.data)){FOODROWS=r.data;applyFood();render()}},function(){});
    }catch(e){}
  }
  loadFood();

  function all(){names();applyFood();move();fixText();render()}
  all();window.addEventListener("load",all);setTimeout(all,1500);setTimeout(all,4000);
  var busy=false;
  new MutationObserver(function(){if(busy)return;busy=true;requestAnimationFrame(function(){busy=false;fixText();render()})})
    .observe(document.body,{childList:true,subtree:true});
  window.addEventListener("hashchange",function(){setTimeout(render,50)});
  window.addEventListener("popstate",function(){setTimeout(render,50)});
})();

/* ===== Partner sign-up: restaurants choose Pure Veg / Non-Veg / Veg & Non-Veg and the food they serve ===== */
(function(){
  if(typeof panel==="undefined")return;
  var TYPES=[["veg","🟢 Pure Veg (Shudh Shakahari)"],["nonveg","🔴 Non-Veg"],["both","🟢🔴 Veg & Non-Veg"]];
  var FOODS=[["punjabi","Punjabi"],["gujarati","Gujarati"],["rajasthani","Rajasthani"],["south","South Indian"],["maharashtrian","Maharashtrian"],["bengali","Bengali"],["jain","Jain food"],["mughlai","Mughlai"],["street","Street Food & Chaat"],["indochinese","Indo-Chinese"],["thali","Thali & Mithai"]];
  function isRest(v){return /restaurant|food|cafe/i.test(String(v||""))}
  if(!document.getElementById("npFoodCss")){
    var st=document.createElement("style");st.id="npFoodCss";
    st.textContent='#npFoodWrap{grid-column:1/-1;margin-top:6px}#npFoodWrap .fl{display:block;font-size:13px;font-weight:600;margin:10px 0 6px}'+
      '#npFoodWrap .opts{display:flex;flex-wrap:wrap;gap:8px}'+
      '#npFoodWrap .opt{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:999px;font-size:13px;cursor:pointer;color:var(--ink,#fff);background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.2)}'+
      '#npFoodWrap .opt input{width:18px;height:18px;margin:0;flex:0 0 auto}'+
      '#npFoodWrap .opt:has(input:checked){border-color:#E9B949;background:rgba(233,185,73,.16)}'+
      '#npFoodWrap .vegok{display:none;gap:8px;align-items:flex-start;margin-top:10px;font-size:13px;padding:10px 12px;border-radius:12px;background:rgba(20,120,60,.18);border:1px solid rgba(60,200,110,.55)}'+
      '#npFoodWrap .vegok input{width:20px;height:20px;margin:0;flex:0 0 auto}#npFoodWrap.isveg .vegok{display:flex}';
    document.head.appendChild(st);
  }
  function build(){
    [["#ppT","#ppGo","#ppM"],["#pvT","#pvGo","#pvM"]].forEach(function(ids){
      var t=panel.querySelector(ids[0]),go=panel.querySelector(ids[1]);
      if(!t||!go||panel.querySelector("#npFoodWrap"))return;
      window.npFood=null;
      var w=document.createElement("div");w.id="npFoodWrap";w.className="full";
      w.innerHTML='<span class="fl">Food type (choose one)</span><div class="opts">'+
        TYPES.map(function(x){return '<label class="opt"><input type="radio" name="npFT" value="'+x[0]+'"> '+x[1]+'</label>'}).join("")+'</div>'+
        '<label class="vegok"><input type="checkbox" id="npVegOk"> I confirm we serve 100% pure veg food: no meat, no fish, no egg.</label>'+
        '<span class="fl">Food you serve (choose one or more)</span><div class="opts">'+
        FOODS.map(function(x){return '<label class="opt"><input type="checkbox" class="npCu" value="'+x[0]+'"> '+x[1]+'</label>'}).join("")+'</div>';
      var anchor=panel.querySelector("#npVPhotoWrap")||t.closest("label")||t;
      anchor.insertAdjacentElement("afterend",w);
      function show(){w.style.display=isRest(t.value)?"":"none"}
      t.addEventListener("change",show);show();
      w.querySelectorAll('input[name="npFT"]').forEach(function(r){r.onchange=function(){w.classList.toggle("isveg",r.value==="veg"&&r.checked)}});
    });
  }
  panel.addEventListener("click",function(e){
    var go=e.target.closest&&e.target.closest("#ppGo,#pvGo");if(!go)return;
    var w=panel.querySelector("#npFoodWrap"),t=panel.querySelector("#ppT")||panel.querySelector("#pvT");
    if(!w||!t||!isRest(t.value)){window.npFood=null;return}
    var M=panel.querySelector("#ppM")||panel.querySelector("#pvM");
    function stop(msg){e.preventDefault();e.stopImmediatePropagation();if(M){M.style.color="";M.textContent=msg}}
    var ft=(w.querySelector('input[name="npFT"]:checked')||{}).value;
    var cu=[].map.call(w.querySelectorAll(".npCu:checked"),function(x){return x.value});
    if(!ft)return stop("Choose your food type: Pure Veg, Non-Veg or Veg & Non-Veg.");
    if(ft==="veg"&&!w.querySelector("#npVegOk").checked)return stop("Please tick the box to confirm 100% pure veg.");
    if(!cu.length)return stop("Choose at least one type of food you serve (Punjabi, Gujarati…).");
    window.npFood={food_type:ft,cuisines:cu};
  },true);
  var busy=false;
  new MutationObserver(function(){if(busy)return;busy=true;requestAnimationFrame(function(){busy=false;build()})}).observe(panel,{childList:true,subtree:true});
  build();
})();

/* ===== Meet new people (REAL, 29 Sep 2026): one meeting feature for the whole app.
   Real profiles on Supabase, selfie check for women (admin approves), search, messages,
   block & report. The Empowered Girls lounge shows the same people (verified women only).
   Old demo screens (sample profiles saved only on one phone) are hidden, not deleted. ===== */
(function(){
  if(!window.supabase||typeof panel==="undefined")return;
  var sb=window.supabase.createClient("https://mymtgbmcjbwsnetzwgoy.supabase.co","sb_publishable_ViFodxG8kAENr78Fyp-BwQ_iA_BfAD0");
  var BAD=/(money|cash|\bpay\b|\bpaid\b|payment|price|\brate\b|baht|฿|\btip\b|short ?time|long ?time|happy ending|escort|\bsex|sponsor|sugar ?daddy)/i;
  var INT=[["party","Club night"],["food","Food & dinner"],["beach","Beach & sea"],["sight","Sightseeing"],["sports","Sports"],["shop","Shopping"],["coffee","Coffee & chat"]];
  var WHEN=["Now","Tonight","Tomorrow","This weekend","Any day"];
  var user=null,mine=null,loaded=false,setupErr="",people=[],blocks=[],adminOK=false;
  var q={main:"",lounge:""},show="all",chatWith=null,chan=null,unread={},editing=false;
  function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
  function X(){return typeof ico==="function"?ico("close"):"×"}
  function intName(k){var x=INT.find(function(i){return i[0]===k});return x?x[1]:""}
  function isWoman(p){return p&&p.gender==="woman"}
  function womanOK(){return adminOK||(mine&&mine.gender==="woman"&&mine.verify_status==="verified")}
  function shrink(file,max,cb){var img=new Image(),url=URL.createObjectURL(file);
    img.onload=function(){var k=Math.min(1,max/Math.max(img.width,img.height)),cv=document.createElement("canvas");cv.width=Math.round(img.width*k);cv.height=Math.round(img.height*k);
      cv.getContext("2d").drawImage(img,0,0,cv.width,cv.height);URL.revokeObjectURL(url);cv.toBlob(function(b){cb(b)},"image/jpeg",0.82)};
    img.onerror=function(){URL.revokeObjectURL(url);cb(null)};img.src=url}
  function sheetOpen(html){panel.innerHTML=html;sheet.classList.add("open");document.body.style.overflow="hidden";panel.scrollTop=0}
  function head(t,id){return '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><h2 id="sheetTitle" style="font-size:20px">'+t+'</h2><button class="theme" id="'+id+'" aria-label="Close">'+X()+'</button></div>'}

  if(!document.getElementById("npMeetCss")){
    var st=document.createElement("style");st.id="npMeetCss";
    st.textContent='#npMeet{margin:12px 0 24px}.npm-card{border-radius:18px;padding:14px;margin:0 0 12px;background:rgba(16,13,28,.62);border:1px solid rgba(255,255,255,.12);color:var(--ink,#fff)}'+
      '.npm-card.hl{border-color:rgba(199,160,255,.45);box-shadow:0 0 16px rgba(170,110,255,.14)}'+
      '.npm-row{display:flex;gap:12px;align-items:center}.npm-av{flex:0 0 56px;height:56px;border-radius:50%;background:linear-gradient(145deg,#8B5CFF,#ED93B1) center/cover;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:22px;color:#fff}'+
      '.npm-who{flex:1;min-width:0}.npm-who b{display:block;font-size:16px}.npm-who small{display:block;opacity:.75;font-size:13px}'+
      '.npm-bdg{display:inline-block;font-size:11px;font-weight:700;border-radius:999px;padding:2px 8px;margin:4px 4px 0 0}.npm-bdg.ver{background:rgba(47,191,98,.2);color:#7BE3A0;border:1px solid rgba(47,191,98,.5)}.npm-bdg.nov{background:rgba(255,255,255,.08);color:#ccc}.npm-bdg.pen{background:rgba(233,185,73,.18);color:#E9B949}'+
      '.npm-plan{margin:10px 0 0;font-size:14px;line-height:1.4}.npm-acts{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}'+
      '.npm-btn{border-radius:999px;padding:9px 16px;font:inherit;font-size:14px;font-weight:600;cursor:pointer;color:var(--ink,#fff);background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.2)}.npm-btn.pri{background:#E9B949;border-color:#E9B949;color:#1a1026}'+
      '.npm-search{display:flex;gap:8px;margin:0 0 12px}.npm-search input{flex:1;min-width:0;padding:12px 14px;border-radius:14px;font:inherit;font-size:15px;color:var(--ink,#fff);background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.2)}'+
      '.npm-search select{padding:10px;border-radius:14px;font:inherit;color:var(--ink,#fff);background:rgba(20,16,34,.95);border:1px solid rgba(255,255,255,.2)}'+
      '.npm-empty{text-align:center;padding:18px;opacity:.8;font-size:14px}.npm-msgs{display:flex;flex-direction:column;gap:8px;margin:14px 0;max-height:52vh;overflow-y:auto}'+
      '.npm-m{max-width:80%;padding:9px 12px;border-radius:14px;font-size:14px;line-height:1.35;background:rgba(255,255,255,.08);align-self:flex-start;word-wrap:break-word}.npm-m.me{align-self:flex-end;background:rgba(233,185,73,.22)}'+
      '.npm-unread{display:inline-block;min-width:20px;padding:0 6px;border-radius:10px;background:#ED93B1;color:#1a1026;font-size:12px;font-weight:700;text-align:center;margin-left:6px}'+
      '#npMeet .fields label,#npmSheet .fields label{display:block}.npm-chk{display:flex;gap:8px;align-items:flex-start;margin-top:10px;font-size:14px}.npm-chk input{width:20px;height:20px;flex:0 0 auto;margin-top:1px}'+
      '.npm-deck{margin:0 0 14px}.npm-photo{position:relative;height:430px;max-height:62vh;border-radius:24px;overflow:hidden;background:#1a1224 center/cover no-repeat;border:1px solid rgba(255,255,255,.14);transition:transform .3s ease,opacity .3s ease;touch-action:pan-y}'+
      '.npm-photo.go-right{transform:translateX(120%) rotate(18deg);opacity:0}.npm-photo.go-left{transform:translateX(-120%) rotate(-18deg);opacity:0}'+
      '.npm-big{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:110px;font-weight:800;color:rgba(255,255,255,.85)}'+
      '.npm-over{position:absolute;left:0;right:0;bottom:0;padding:70px 18px 42px;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.82));color:#fff}.npm-over b{display:block;font-size:26px}.npm-over small{display:block;font-size:14px;opacity:.9;margin-top:2px}'+
      '.npm-stamp{position:absolute;top:26px;padding:6px 14px;border-radius:10px;font-size:26px;font-weight:800;letter-spacing:2px;opacity:0;transition:opacity .15s;border:3px solid}.npm-stamp.like{left:20px;color:#5DCAA5;border-color:#5DCAA5;transform:rotate(-14deg)}.npm-stamp.nope{right:20px;color:#F09595;border-color:#F09595;transform:rotate(14deg)}'+
      '.npm-photo.show-like .like,.npm-photo.show-nope .nope{opacity:1}'+
      '.npm-dbtns{display:flex;justify-content:center;gap:22px;margin-top:-30px;position:relative;z-index:2}.npm-round{width:62px;height:62px;border-radius:50%;font-size:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:#16122a;border:2px solid rgba(255,255,255,.2);color:#fff;box-shadow:0 6px 18px rgba(0,0,0,.45)}'+
      '.npm-round i{font-style:normal}.npm-round.no{color:#F09595;border-color:rgba(240,149,149,.7)}.npm-round.yes{color:#ED93B1;border-color:rgba(237,147,177,.8)}.npm-round.hi{width:52px;height:52px;font-size:20px;align-self:center}'+
      '.npm-count{text-align:center;font-size:13px;opacity:.8;margin:10px 0 0}.npm-teaser .npm-photo{height:220px}';
    document.head.appendChild(st);
  }

  /* ---------- data ---------- */
  async function loadMe(){
    if(!user){mine=null;loaded=true;return}
    var r=await sb.from("np_meet_profiles").select("*").eq("user_id",user.id).maybeSingle();
    setupErr=r.error?(/relation|does not exist|schema/i.test(r.error.message)?"setup":r.error.message):"";
    mine=r.data||null;loaded=true;
  }
  async function loadPeople(){
    if(!user||(!mine&&!adminOK)){people=[];return}
    var r=await sb.from("np_meet_profiles").select("user_id,name,age,gender,city,languages,intent,when_txt,plan,photo_url,verify_status,updated_at")
      .eq("active",true).neq("user_id",user.id).order("updated_at",{ascending:false}).limit(400);
    people=(r.data||[]).filter(function(p){return !isWoman(p)||p.verify_status==="verified"});
    var b=await sb.from("np_meet_blocks").select("blocked").eq("blocker",user.id);blocks=(b.data||[]).map(function(x){return x.blocked});
    await loadLikes();
  }
  async function checkAdmin(){try{var r=await sb.rpc("np_is_admin");adminOK=!r.error&&r.data===true}catch(e){adminOK=false}}
  async function refresh(){await loadMe();await loadPeople();paintAll()}

  /* ---------- cards ---------- */
  function badge(p){return p.verify_status==="verified"?'<span class="npm-bdg ver">✓ Verified</span>':(p.verify_status==="pending"?'<span class="npm-bdg pen">Check pending</span>':'<span class="npm-bdg nov">Not verified</span>')}
  function av(p){return p.photo_url?'<span class="npm-av" style="background-image:url(\''+esc(p.photo_url)+'\')"></span>':'<span class="npm-av">'+esc((p.name||"?").charAt(0).toUpperCase())+'</span>'}
  function personCard(p){
    var bits=[p.age,p.city].filter(Boolean).join(" · ");
    return '<div class="npm-card"><div class="npm-row">'+av(p)+'<div class="npm-who"><b>'+esc(p.name)+'</b><small>'+esc(bits)+(p.languages?' · '+esc(p.languages):'')+'</small>'+badge(p)+'</div></div>'+
      ((p.intent||p.when_txt)?'<p class="npm-plan"><b>'+esc(intName(p.intent))+'</b>'+(p.when_txt?' · '+esc(p.when_txt):'')+'</p>':'')+
      (p.plan?'<p class="npm-plan" style="margin-top:4px;opacity:.9">'+esc(p.plan)+'</p>':'')+
      '<div class="npm-acts"><button class="npm-btn pri" data-hi="'+p.user_id+'">Say hi'+(unread[p.user_id]?'<span class="npm-unread">'+unread[p.user_id]+'</span>':'')+'</button><button class="npm-btn" data-more="'+p.user_id+'">Report or block</button></div></div>';
  }
  function match(p,txt){if(!txt)return true;txt=txt.toLowerCase();
    return [p.name,p.city,p.languages,p.plan,intName(p.intent),p.when_txt].join(" ").toLowerCase().indexOf(txt)>-1}

  /* ---------- main screen (Buddy / Meet new people) ---------- */
  function mount(){
    var s=document.getElementById("buddy");if(!s)return null;
    ["buddyGate","buddyMain","lob"].forEach(function(id){var e=document.getElementById(id);if(e)e.style.setProperty("display","none","important")});
    s.querySelectorAll(".howto").forEach(function(e){e.style.setProperty("display","none","important")});
    var t=s.querySelector(".sectiontitle");if(t&&t.textContent!=="Meet new people")t.textContent="Meet new people";
    var root=document.getElementById("npMeet");
    if(!root){root=document.createElement("div");root.id="npMeet";
      if(t)t.insertAdjacentElement("afterend",root);else s.appendChild(root)}
    var pp=document.getElementById("npPurpose");
    if(pp&&root.nextElementSibling!==pp)root.insertAdjacentElement("afterend",pp);   /* rules box goes below the people */
    var fb=document.getElementById("npFindBtn");if(fb)fb.remove();                     /* Friends Location & Bill Splitter lives in All services */
    return root;
  }
  function paintMain(){
    var root=mount();if(!root)return;
    if(!user){root.innerHTML='<div class="npm-deck npm-teaser"><div class="npm-photo" style="background:linear-gradient(160deg,#534AB7,#D4537E)"><div class="npm-over"><b>Travellers are going out tonight</b><small>Club nights, dinners, beach days, sightseeing</small></div></div></div>'+
      '<div class="npm-card hl"><b>Sign in to meet people</b><p class="npm-plan">See real travellers, like profiles and say hi. Free, 18+, public places only.</p><div class="npm-acts"><button class="npm-btn pri" id="npmIn">Sign in</button><button class="npm-btn" id="npmUp">Sign up free</button></div></div>';
      function openAcc(up){var b=document.querySelector(".np-hbtn.user")||document.getElementById("acctBtn");if(b)b.click();
        if(up)setTimeout(function(){var t=[].find.call(panel.querySelectorAll("button,a"),function(x){return /create account|sign up/i.test(x.textContent)&&!/free/i.test(x.textContent)});if(t)t.click()},250)}
      root.querySelector("#npmIn").onclick=function(){openAcc(false)};root.querySelector("#npmUp").onclick=function(){openAcc(true)};return}
    if(!loaded){root.innerHTML='<p class="npm-empty">Loading…</p>';return}
    if(setupErr==="setup"){root.innerHTML='<div class="npm-card"><b>Almost ready</b><p class="npm-plan">Meet new people is being set up. Please check back soon.</p></div>';return}
    if(adminOK&&!mine&&!editing){
      root.innerHTML='<div class="npm-card hl"><b>Admin view</b><p class="npm-plan">You see Meet new people exactly like the members do, including women-only areas. To say hi to someone, create your own profile first.</p><div class="npm-acts"><button class="npm-btn pri" id="npmAdmin">Verify women & reports</button><button class="npm-btn" id="npmMake">Create my profile</button></div></div>'+
        '<div class="npm-search"><input id="npmQ" type="search" placeholder="Search name, city, language, plan…" value="'+esc(q.main)+'" aria-label="Search people"><select id="npmShow" aria-label="Show"><option value="all">Everyone</option><option value="woman">Women</option><option value="man">Men</option></select></div><div id="npmList"></div>';
      root.querySelector("#npmShow").value=show;
      root.querySelector("#npmQ").oninput=function(){q.main=this.value;list(root.querySelector("#npmList"),q.main,show)};
      root.querySelector("#npmShow").onchange=function(){show=this.value;list(root.querySelector("#npmList"),q.main,show);deck(root.querySelector("#npmDeck"))};
      root.querySelector("#npmAdmin").onclick=openAdmin;root.querySelector("#npmMake").onclick=function(){editing=true;paintMain()};
      root.insertAdjacentHTML("afterbegin",'<div id="npmDeck"></div>');deck(root.querySelector("#npmDeck"));
      list(root.querySelector("#npmList"),q.main,show);return}
    if(!mine||editing){root.innerHTML=formHTML();wireForm(root);return}
    var h=myCard()+(adminOK?'<div class="npm-card"><b>Admin</b><div class="npm-acts"><button class="npm-btn pri" id="npmAdmin">Verify women & reports</button></div></div>':'')+
      '<div class="npm-search"><input id="npmQ" type="search" placeholder="Search name, city, language, plan…" value="'+esc(q.main)+'" aria-label="Search people">'+
      '<select id="npmShow" aria-label="Show"><option value="all">Everyone</option><option value="woman">Women</option><option value="man">Men</option></select></div><div id="npmList"></div>';
    root.innerHTML='<div id="npmDeck"></div>'+h;deck(root.querySelector("#npmDeck"));
    root.querySelector("#npmShow").value=show;
    root.querySelector("#npmQ").oninput=function(){q.main=this.value;list(root.querySelector("#npmList"),q.main,show)};
    root.querySelector("#npmShow").onchange=function(){show=this.value;list(root.querySelector("#npmList"),q.main,show);deck(root.querySelector("#npmDeck"))};
    wireMine(root);if(root.querySelector("#npmAdmin"))root.querySelector("#npmAdmin").onclick=openAdmin;
    list(root.querySelector("#npmList"),q.main,show);
  }
  function myCard(){
    var s=mine.verify_status,msg="";
    if(isWoman(mine)){
      msg=s==="verified"?'You are verified. Other people can see you.':
        s==="pending"?'Selfie sent. We are checking it and you will get the Verified badge soon. Until then, other people cannot see your profile.':
        s==="rejected"?'Your selfie was not approved. Please send a clear new selfie.':'Women need a quick selfie check before others can see them. It keeps everyone safe.';
    }else msg=s==="verified"?'You are verified.':s==="pending"?'Selfie sent. We are checking it.':'Optional: verify with a selfie to get the Verified badge.';
    var tot=Object.keys(unread).reduce(function(a,k){return a+unread[k]},0);
    return '<div class="npm-card hl"><div class="npm-row">'+av(mine)+'<div class="npm-who"><b>'+esc(mine.name)+' (you)</b><small>'+esc(intName(mine.intent))+(mine.when_txt?' · '+esc(mine.when_txt):'')+'</small>'+badge(mine)+'</div></div>'+
      '<p class="npm-plan">'+esc(msg)+'</p><div class="npm-acts">'+
      ((s==="none"||s==="rejected")?'<button class="npm-btn pri" id="npmSelfie">Verify with a selfie</button>':'')+
      '<button class="npm-btn" id="npmInbox">Messages'+(tot?'<span class="npm-unread">'+tot+'</span>':'')+'</button><button class="npm-btn" id="npmEdit">Edit profile</button></div></div>';
  }
  function wireMine(root){
    if(root.querySelector("#npmSelfie"))root.querySelector("#npmSelfie").onclick=openSelfie;
    if(root.querySelector("#npmInbox"))root.querySelector("#npmInbox").onclick=openInbox;
    if(root.querySelector("#npmEdit"))root.querySelector("#npmEdit").onclick=function(){editing=true;paintMain()};
  }
  function list(el,txt,sh,womenOnly){
    if(!el)return;
    var l=people.filter(function(p){return blocks.indexOf(p.user_id)<0&&(womenOnly?isWoman(p):(sh==="all"||p.gender===sh))&&match(p,txt)});
    el.innerHTML=l.length?l.map(personCard).join(""):'<p class="npm-empty">'+(txt?'Nobody found for "'+esc(txt)+'".':(womenOnly?'No verified women here yet. Invite your friends!':'No one here yet. Be the first, and invite your friends!'))+'</p>';
    el.querySelectorAll("[data-hi]").forEach(function(b){b.onclick=function(){var p=people.find(function(x){return x.user_id===b.dataset.hi});if(p)openChat(p)}});
    el.querySelectorAll("[data-more]").forEach(function(b){b.onclick=function(){var p=people.find(function(x){return x.user_id===b.dataset.more});if(p)openMore(p)}});
  }

  /* ---------- like / skip cards (top of the page) ---------- */
  var LIKED={},LIKEDME=0;
  function skipped(){try{return JSON.parse(localStorage.getItem("np_meet_skip")||"{}")}catch(e){return {}}}
  function skip(id){var k=skipped();k[id]=Date.now();try{localStorage.setItem("np_meet_skip",JSON.stringify(k))}catch(e){}}
  async function loadLikes(){LIKED={};LIKEDME=0;if(!user)return;
    try{var r=await sb.from("np_meet_likes").select("liker,liked").or("liker.eq."+user.id+",liked.eq."+user.id);
      (r.data||[]).forEach(function(x){if(x.liker===user.id)LIKED[x.liked]=1;else LIKEDME++})}catch(e){}}
  function queue(){var k=skipped(),week=Date.now()-7*864e5;
    return people.filter(function(p){return blocks.indexOf(p.user_id)<0&&!LIKED[p.user_id]&&!(k[p.user_id]>week)&&(show==="all"||p.gender===show)})}
  /* free members: 10 profiles a day, then the Namaste Gold offer */
  var FREE=10;
  function isPrem(){try{return (typeof isPremium==="function"&&!!isPremium())||(typeof isVIP==="function"&&!!isVIP())}catch(e){return false}}
  function today(){var d=new Date();return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()}
  function seenN(){try{var o=JSON.parse(localStorage.getItem("np_meet_seen")||"{}");return o.d===today()?o.n:0}catch(e){return 0}}
  function addSeen(){try{localStorage.setItem("np_meet_seen",JSON.stringify({d:today(),n:seenN()+1}))}catch(e){}}
  function goldOffer(box){
    box.innerHTML='<div class="npm-deck"><div class="npm-photo" style="background:linear-gradient(160deg,#412402,#BA7517 55%,#FAC775)"><span class="npm-big" style="font-size:80px">👑</span>'+
      '<div class="npm-over"><b>You have seen your '+FREE+' free profiles today</b><small>Come back tomorrow for '+FREE+' more, or go unlimited now.</small></div></div>'+
      '<div class="npm-card" style="margin-top:12px;border-color:rgba(239,159,39,.6)"><b>Namaste Gold</b><p class="npm-plan">✓ Unlimited profiles, likes and swipes<br>✓ Your profile shown first<br>✓ See who liked you<br>✓ All Gold perks in the app</p>'+
      '<div class="npm-acts"><button class="npm-btn pri" id="npmGold">Become a Gold member</button></div></div></div>';
    box.querySelector("#npmGold").onclick=function(){var b=document.getElementById("premBtn");if(b)b.click();else if(typeof openVipBuddy==="function")openVipBuddy()};
  }
  function deck(box){
    if(!box)return;
    if(!adminOK&&!isPrem()&&seenN()>=FREE){goldOffer(box);return}
    var qd=queue(),p=qd[0];
    if(!p&&!people.length){var link="https://namastepattayareservationsindthai.vercel.app/";
      box.innerHTML='<div class="npm-deck"><div class="npm-photo npm-empty-card" style="height:240px;background:linear-gradient(160deg,#534AB7,#D4537E)"><span class="npm-big" style="font-size:70px">🎉</span>'+
        '<div class="npm-over"><b>You are one of the first!</b><small>Meet new people just started. Invite your friends so you can meet in Pattaya.</small></div></div>'+
        '<div class="npm-acts" style="justify-content:center;margin-top:12px"><button class="npm-btn pri" id="npmInv">Invite friends on WhatsApp</button></div></div>';
      box.querySelector("#npmInv").onclick=function(){window.open("https://wa.me/?text="+encodeURIComponent("Going to Pattaya? Join me on Namaste Pattaya to meet travellers, book clubs and Indian food: "+link),"_blank")};return}
    if(!p){box.innerHTML='<div class="npm-card"><b>You have seen everyone for now</b><p class="npm-plan">New travellers join every day. Check again later, or search the full list below.</p>'+(Object.keys(skipped()).length?'<div class="npm-acts"><button class="npm-btn" id="npmReset">Show skipped people again</button></div>':'')+'</div>';
      var rs=box.querySelector("#npmReset");if(rs)rs.onclick=function(){try{localStorage.removeItem("np_meet_skip")}catch(e){}deck(box)};return}
    var bits=[p.age,p.city].filter(Boolean).join(" · ");
    box.innerHTML='<div class="npm-deck"><div class="npm-photo" id="npmCard" style="'+(p.photo_url?"background-image:url('"+esc(p.photo_url)+"')":"background:linear-gradient(160deg,#534AB7,#D4537E)")+'">'+
      (p.photo_url?'':'<span class="npm-big">'+esc((p.name||"?").charAt(0).toUpperCase())+'</span>')+
      '<span class="npm-stamp like">LIKE</span><span class="npm-stamp nope">SKIP</span>'+
      '<div class="npm-over"><b>'+esc(p.name)+(p.age?', '+esc(p.age):'')+'</b><small>'+esc(p.city||"")+(p.languages?' · '+esc(p.languages):'')+'</small>'+badge(p)+
      ((p.intent||p.when_txt)?'<small style="margin-top:6px"><b style="font-size:14px;display:inline">'+esc(intName(p.intent))+'</b>'+(p.when_txt?' · '+esc(p.when_txt):'')+'</small>':'')+(p.plan?'<small>'+esc(p.plan)+'</small>':'')+'</div></div>'+
      '<div class="npm-dbtns"><button class="npm-round no" id="npmNo" aria-label="Skip"><i>✕</i></button><button class="npm-round hi" id="npmHi" aria-label="Say hi">💬</button><button class="npm-round yes" id="npmYes" aria-label="Like"><i>♥</i></button></div>'+
      '<p class="npm-count">'+qd.length+' '+(qd.length===1?"person":"people")+' to see'+(LIKEDME?' · 💗 '+LIKEDME+' liked you':'')+(!adminOK&&!isPrem()?' · '+Math.max(0,FREE-seenN())+' free left today':'')+'</p></div>';
    var card=box.querySelector("#npmCard");
    async function act(like){
      addSeen();
      card.classList.add(like?"go-right":"go-left");
      if(like){
        if(!mine){setTimeout(function(){alert("Create your Meet new people profile first, then you can like people.");editing=true;paintMain()},250);return}
        LIKED[p.user_id]=1;
        var r=await sb.from("np_meet_likes").insert({liked:p.user_id});
        if(!r.error){var m=await sb.from("np_meet_likes").select("liker").eq("liker",p.user_id).eq("liked",user.id).maybeSingle();
          if(m.data){setTimeout(function(){matchBox(p)},320)}}
      }else skip(p.user_id);
      setTimeout(function(){deck(box)},300);
    }
    box.querySelector("#npmNo").onclick=function(){act(false)};box.querySelector("#npmYes").onclick=function(){act(true)};
    box.querySelector("#npmHi").onclick=function(){openChat(p)};
    var x0=null,dx=0;
    card.addEventListener("touchstart",function(e){x0=e.touches[0].clientX;dx=0;card.style.transition="none"},{passive:true});
    card.addEventListener("touchmove",function(e){if(x0===null)return;dx=e.touches[0].clientX-x0;card.style.transform="translateX("+dx+"px) rotate("+(dx/20)+"deg)";card.classList.toggle("show-like",dx>40);card.classList.toggle("show-nope",dx<-40)},{passive:true});
    card.addEventListener("touchend",function(){card.style.transition="";if(Math.abs(dx)>90){act(dx>0)}else{card.style.transform="";card.classList.remove("show-like","show-nope")}x0=null});
  }
  function matchBox(p){
    sheetOpen('<div class="pbody" style="text-align:center">'+head("It's a match! 🎉","mbX")+'<p class="about">You and '+esc(p.name)+' both liked each other. Say hi and make a plan, in a public place.</p><button class="cta" id="mbHi">Say hi to '+esc(p.name)+'</button></div>');
    panel.querySelector("#mbX").onclick=closeSheet;panel.querySelector("#mbHi").onclick=function(){openChat(p)};
  }

  /* ---------- profile form ---------- */
  function formHTML(){
    var m=mine||{};
    return '<div class="npm-card hl"><b>'+(mine?"Edit your profile":"Create your profile")+'</b><p class="npm-plan">Meet travellers for a club night, a meal, sports or sightseeing. Social meetings only, in public places.</p>'+
      '<div class="fields"><label>First name<input id="mfN" maxlength="40" value="'+esc(m.name||"")+'"></label>'+
      '<label>Age<input id="mfA" inputmode="numeric" maxlength="2" value="'+esc(m.age||"")+'"></label>'+
      '<label>I am<select id="mfG"><option value="man">Man</option><option value="woman">Woman</option><option value="other">Other</option></select></label>'+
      '<label>From (city)<input id="mfC" maxlength="60" placeholder="e.g. Mumbai" value="'+esc(m.city||"")+'"></label>'+
      '<label class="full">Languages<input id="mfL" maxlength="80" placeholder="Hindi, English" value="'+esc(m.languages||"")+'"></label>'+
      '<label>Up for<select id="mfI">'+INT.map(function(i){return '<option value="'+i[0]+'">'+i[1]+'</option>'}).join("")+'</select></label>'+
      '<label>When<select id="mfW">'+WHEN.map(function(w){return '<option>'+w+'</option>'}).join("")+'</select></label>'+
      '<label class="full">Your plan (optional)<input id="mfP" maxlength="140" placeholder="e.g. Walking Street tonight, want a group" value="'+esc(m.plan||"")+'"></label>'+
      '<label class="full">Profile photo (optional)<input id="mfF" type="file" accept="image/*"></label></div>'+
      '<label class="npm-chk"><input type="checkbox" id="mfPh"> This is my own photo.</label>'+
      '<label class="npm-chk"><input type="checkbox" id="mf18"'+(mine?" checked":"")+'> I am 18 or older.</label>'+
      '<label class="npm-chk"><input type="checkbox" id="mfR"'+(mine?" checked":"")+'> I agree to the rules: social meetings in public places only, no money, gifts or paid services of any kind.</label>'+
      '<div class="npm-acts"><button class="npm-btn pri" id="mfSave">Save profile</button>'+(mine?'<button class="npm-btn" id="mfCancel">Cancel</button><button class="npm-btn" id="mfHide">'+(mine.active?"Hide my profile":"Show my profile")+'</button>':'')+'</div><p class="err" id="mfE"></p></div>';
  }
  function wireForm(root){
    var $=function(s){return root.querySelector(s)},m=mine||{};
    $("#mfG").value=m.gender||"man";$("#mfI").value=m.intent||"party";$("#mfW").value=m.when_txt||"Tonight";
    if($("#mfCancel"))$("#mfCancel").onclick=function(){editing=false;paintMain()};
    if($("#mfHide"))$("#mfHide").onclick=async function(){await sb.from("np_meet_profiles").update({active:!mine.active}).eq("user_id",user.id);editing=false;refresh()};
    $("#mfSave").onclick=async function(){
      var E=$("#mfE"),n=$("#mfN").value.trim(),a=parseInt($("#mfA").value,10),p=$("#mfP").value.trim(),f=$("#mfF").files&&$("#mfF").files[0];
      if(!n){E.textContent="Add your first name.";return}
      if(!(a>=18&&a<=99)){E.textContent="You must be 18 or older.";return}
      if(!$("#mf18").checked){E.textContent="Please confirm you are 18 or older.";return}
      if(!$("#mfR").checked){E.textContent="Please agree to the rules.";return}
      if(BAD.test(n+" "+p)){E.textContent="Money, prices or paid services are not allowed. Please keep it social.";return}
      if(f&&!$("#mfPh").checked){E.textContent="Please confirm it is your own photo.";return}
      this.disabled=true;E.textContent="Saving…";
      var row={name:n,age:a,gender:$("#mfG").value,city:$("#mfC").value.trim()||null,languages:$("#mfL").value.trim()||null,intent:$("#mfI").value,when_txt:$("#mfW").value,plan:p||null,active:true};
      if(f){var blob=await new Promise(function(ok){shrink(f,900,ok)});
        if(blob){var path=user.id+"/photo.jpg",up=await sb.storage.from("meet-photos").upload(path,blob,{upsert:true,contentType:"image/jpeg"});
          if(!up.error)row.photo_url=sb.storage.from("meet-photos").getPublicUrl(path).data.publicUrl+"?v="+Date.now()}}
      var r=mine?await sb.from("np_meet_profiles").update(row).eq("user_id",user.id):await sb.from("np_meet_profiles").insert(row);
      this.disabled=false;
      if(r.error){E.textContent=r.error.message;return}
      var wasNew=!mine;editing=false;await refresh();
      if(isWoman(mine)&&(mine.verify_status==="none"||mine.verify_status==="rejected")&&wasNew)openSelfie();
    };
  }

  /* ---------- selfie check ---------- */
  function openSelfie(){
    sheetOpen('<div class="pbody" id="npmSheet">'+head("Selfie check","smX")+
      '<p class="about">Take a clear selfie of your face. Only the Namaste Pattaya team sees it, just to check you are real. It is never shown on your profile and is deleted after the check.</p>'+
      '<div class="fields"><label class="full">Selfie<input id="sfF" type="file" accept="image/*" capture="user"></label></div>'+
      '<label class="npm-chk"><input type="checkbox" id="sfOk"> I agree my selfie is used only to verify my profile.</label>'+
      '<button class="cta" id="sfGo">Send for checking</button><p class="err" id="sfE"></p></div>');
    panel.querySelector("#smX").onclick=closeSheet;
    panel.querySelector("#sfGo").onclick=async function(){
      var f=panel.querySelector("#sfF").files&&panel.querySelector("#sfF").files[0],E=panel.querySelector("#sfE");
      if(!f){E.textContent="Take or choose a selfie first.";return}
      if(!panel.querySelector("#sfOk").checked){E.textContent="Please tick the box to agree.";return}
      this.disabled=true;E.textContent="Sending…";
      var blob=await new Promise(function(ok){shrink(f,1000,ok)});
      if(!blob){this.disabled=false;E.textContent="Could not read this photo. Try again.";return}
      var up=await sb.storage.from("meet-selfies").upload(user.id+"/selfie.jpg",blob,{upsert:true,contentType:"image/jpeg"});
      if(up.error){this.disabled=false;E.textContent=up.error.message;return}
      var r=await sb.from("np_meet_profiles").update({verify_status:"pending"}).eq("user_id",user.id);
      if(r.error){this.disabled=false;E.textContent=r.error.message;return}
      sheetOpen('<div class="pbody">'+head("Selfie sent","smX")+'<p class="about">Thank you! We are checking it. You will get the Verified badge soon.</p></div>');
      panel.querySelector("#smX").onclick=closeSheet;refresh();
    };
  }

  /* ---------- report / block ---------- */
  function openMore(p){
    sheetOpen('<div class="pbody">'+head(esc(p.name),"moX")+
      '<div class="fields"><label class="full">What happened? (for a report)<input id="moR" maxlength="300" placeholder="e.g. asked for money"></label></div>'+
      '<button class="cta" id="moRep">Report to Namaste Pattaya</button><button class="cta ghost" id="moBlk">Block '+esc(p.name)+'</button><p class="err" id="moE"></p></div>');
    panel.querySelector("#moX").onclick=closeSheet;
    panel.querySelector("#moRep").onclick=async function(){var r=await sb.from("np_meet_reports").insert({reported:p.user_id,reason:panel.querySelector("#moR").value.trim()||null});
      panel.querySelector("#moE").style.color=r.error?"":"var(--ok)";panel.querySelector("#moE").textContent=r.error?r.error.message:"Thank you. We review every report."};
    panel.querySelector("#moBlk").onclick=async function(){if(!confirm("Block "+p.name+"? You will not see each other or be able to message."))return;
      await sb.from("np_meet_blocks").insert({blocked:p.user_id});closeSheet();refresh()};
  }

  /* ---------- messages ---------- */
  function subscribe(){
    if(chan){sb.removeChannel(chan);chan=null}if(!user)return;
    chan=sb.channel("meet-"+user.id).on("postgres_changes",{event:"INSERT",schema:"public",table:"np_meet_messages",filter:"recipient=eq."+user.id},function(ev){
      var m=ev.new;if(chatWith&&m.sender===chatWith.user_id&&panel.querySelector("#chBox")){addMsg(m);return}
      unread[m.sender]=(unread[m.sender]||0)+1;paintAll();
    }).subscribe();
  }
  function addMsg(m){var box=panel.querySelector("#chBox");if(!box)return;var d=document.createElement("div");d.className="npm-m"+(m.sender===user.id?" me":"");d.textContent=m.body;box.appendChild(d);box.scrollTop=box.scrollHeight}
  async function openChat(p){
    if(!mine){alert("Create your Meet new people profile first, then you can say hi.");closeSheet();if(typeof go==="function")go("buddy");editing=true;paintMain();return}
    chatWith=p;delete unread[p.user_id];
    sheetOpen('<div class="pbody">'+head("Chat with "+esc(p.name),"chX")+'<p class="small">Meet only in public places. Never send money. Report anyone who asks for money or paid services.</p>'+
      '<div class="npm-msgs" id="chBox"><p class="npm-empty">Loading…</p></div><div class="post"><input id="chIn" maxlength="500" placeholder="Say hi…"><button id="chGo">Send</button></div><p class="err" id="chE"></p></div>');
    panel.querySelector("#chX").onclick=function(){chatWith=null;closeSheet();paintAll()};
    var me=user.id,them=p.user_id;
    var r=await sb.from("np_meet_messages").select("*").or("and(sender.eq."+me+",recipient.eq."+them+"),and(sender.eq."+them+",recipient.eq."+me+")").order("created_at").limit(200);
    var box=panel.querySelector("#chBox");if(!box)return;box.innerHTML=(r.data&&r.data.length)?"":'<p class="npm-empty">Say hi and tell '+esc(p.name)+' your plan.</p>';
    (r.data||[]).forEach(addMsg);
    async function send(){
      var inp=panel.querySelector("#chIn"),E=panel.querySelector("#chE"),t=inp.value.trim();if(!t)return;
      if(BAD.test(t)){E.textContent="Messages about money, payment or paid services are not allowed. Please keep it social.";return}
      E.textContent="";inp.value="";
      var s=await sb.from("np_meet_messages").insert({recipient:them,body:t}).select().single();
      if(s.error){E.textContent=/row-level|policy/i.test(s.error.message)?"Message not sent. It may break the rules, or one of you has blocked the other.":s.error.message;inp.value=t;return}
      var em=box.querySelector(".npm-empty");if(em)em.remove();addMsg(s.data);
    }
    panel.querySelector("#chGo").onclick=send;
    panel.querySelector("#chIn").onkeydown=function(e){if(e.key==="Enter"){e.preventDefault();send()}};
  }
  async function openInbox(){
    sheetOpen('<div class="pbody">'+head("Messages","ibX")+'<div id="ibL"><p class="npm-empty">Loading…</p></div></div>');
    panel.querySelector("#ibX").onclick=closeSheet;
    var r=await sb.from("np_meet_messages").select("*").or("sender.eq."+user.id+",recipient.eq."+user.id).order("created_at",{ascending:false}).limit(300);
    var seen={},convs=[];(r.data||[]).forEach(function(m){var o=m.sender===user.id?m.recipient:m.sender;if(!seen[o]){seen[o]=1;convs.push({o:o,m:m})}});
    var need=convs.map(function(c){return c.o}).filter(function(id){return !people.find(function(p){return p.user_id===id})});
    if(need.length){var pr=await sb.from("np_meet_profiles").select("user_id,name,age,gender,city,languages,intent,when_txt,plan,photo_url,verify_status").in("user_id",need);(pr.data||[]).forEach(function(p){people.push(p)})}
    var el=panel.querySelector("#ibL");if(!el)return;
    el.innerHTML=convs.length?convs.map(function(c){var p=people.find(function(x){return x.user_id===c.o})||{user_id:c.o,name:"Member"};
      return '<div class="npm-card" data-c="'+c.o+'" style="cursor:pointer"><div class="npm-row">'+av(p)+'<div class="npm-who"><b>'+esc(p.name)+(unread[c.o]?'<span class="npm-unread">'+unread[c.o]+'</span>':'')+'</b><small>'+esc((c.m.sender===user.id?"You: ":"")+c.m.body)+'</small></div></div></div>'}).join(""):'<p class="npm-empty">No messages yet. Tap "Say hi" on someone\'s profile.</p>';
    el.querySelectorAll("[data-c]").forEach(function(d){d.onclick=function(){var p=people.find(function(x){return x.user_id===d.dataset.c});if(p)openChat(p)}});
  }

  /* ---------- admin: verify women, see reports ---------- */
  async function openAdmin(){
    if(!adminOK){await checkAdmin();if(!adminOK)return}
    sheetOpen('<div class="pbody">'+head("Admin · Meet new people","adX")+'<div id="adBody"><p class="npm-empty">Loading…</p></div></div>');
    panel.querySelector("#adX").onclick=closeSheet;
    var r=await sb.from("np_meet_profiles").select("*").eq("verify_status","pending").order("updated_at");
    var rep=await sb.from("np_meet_reports").select("*").eq("status","open").order("created_at",{ascending:false}).limit(50);
    var pend=r.data||[],reps=rep.data||[],names={};
    if(reps.length){var ids=reps.map(function(x){return x.reported});var nm=await sb.from("np_meet_profiles").select("user_id,name,age,city").in("user_id",ids);(nm.data||[]).forEach(function(p){names[p.user_id]=p.name+", "+p.age+(p.city?" · "+p.city:"")})}
    var h='<h3 style="font-size:16px;margin:10px 0">Waiting for selfie check ('+pend.length+')</h3>';
    for(var i=0;i<pend.length;i++){var p=pend[i],u=await sb.storage.from("meet-selfies").createSignedUrl(p.user_id+"/selfie.jpg",600);
      h+='<div class="npm-card" data-u="'+p.user_id+'"><div class="npm-row">'+av(p)+'<div class="npm-who"><b>'+esc(p.name)+', '+esc(p.age)+'</b><small>'+esc(p.gender)+' · '+esc(p.city||"")+'</small></div></div>'+
        (u.data&&u.data.signedUrl?'<img src="'+esc(u.data.signedUrl)+'" alt="Selfie of '+esc(p.name)+'" style="display:block;width:100%;max-height:320px;object-fit:contain;border-radius:12px;margin-top:10px;background:#000">':'<p class="npm-plan">No selfie found.</p>')+
        '<p class="small" style="margin-top:8px">Check: real face, looks 18+, matches the profile photo, gender matches.</p>'+
        '<div class="npm-acts"><button class="npm-btn pri" data-ok>Approve</button><button class="npm-btn" data-no>Reject</button></div></div>'}
    if(!pend.length)h+='<p class="npm-empty">Nobody waiting.</p>';
    h+='<h3 style="font-size:16px;margin:18px 0 10px">Open reports ('+reps.length+')</h3>'+(reps.length?reps.map(function(x){return '<div class="npm-card" data-r="'+x.id+'"><p class="npm-plan" style="margin:0"><b>Reported:</b> '+esc(names[x.reported]||"Member")+'</p><p class="npm-plan">'+esc(x.reason||"No reason given")+'</p><p class="small">'+new Date(x.created_at).toLocaleString("en-GB")+'</p><div class="npm-acts"><button class="npm-btn" data-hide="'+x.reported+'">Hide this profile</button><button class="npm-btn" data-done>Mark done</button></div></div>'}).join(""):'<p class="npm-empty">No open reports.</p>');
    var b=panel.querySelector("#adBody");if(!b)return;b.innerHTML=h;
    b.querySelectorAll("[data-u]").forEach(function(c){var id=c.dataset.u;
      async function set(v){var x=await sb.from("np_meet_profiles").update({verify_status:v}).eq("user_id",id);if(x.error){alert(x.error.message);return}
        await sb.storage.from("meet-selfies").remove([id+"/selfie.jpg"]);c.remove()}
      c.querySelector("[data-ok]").onclick=function(){set("verified")};
      c.querySelector("[data-no]").onclick=function(){if(confirm("Reject this selfie?"))set("rejected")};
    });
    b.querySelectorAll("[data-r]").forEach(function(c){
      c.querySelector("[data-done]").onclick=async function(){await sb.from("np_meet_reports").update({status:"done"}).eq("id",c.dataset.r);c.remove()};
      c.querySelector("[data-hide]").onclick=async function(){if(!confirm("Hide this profile from everyone?"))return;var x=await sb.from("np_meet_profiles").update({active:false}).eq("user_id",this.dataset.hide);alert(x.error?x.error.message:"Profile hidden.")};
    });
  }
  window.npMeetAdmin=openAdmin;
  /* the old "Admin page" button (n8n passcode, no longer working) now opens this admin screen */
  new MutationObserver(function(){
    panel.querySelectorAll('a[href="admin.html"]').forEach(function(a){
      if(a.dataset.npm)return;a.dataset.npm="1";a.textContent="Verify women & reports";a.setAttribute("href","#");
      a.addEventListener("click",function(e){e.preventDefault();openAdmin()});
    });
  }).observe(panel,{childList:true,subtree:true});

  /* ---------- Empowered Girls lounge: verified women only, same people (women), search ---------- */
  function paintLounge(){
    var gate=document.getElementById("ladyGate");
    if(gate){
      var box=document.getElementById("npLGate");
      if(!box){box=document.createElement("div");box.id="npLGate";gate.insertBefore(box,gate.firstChild);
        [].forEach.call(gate.children,function(ch){if(ch!==box)ch.style.setProperty("display","none","important")})}
      var s=mine&&mine.verify_status;
      box.innerHTML='<p class="about" style="margin:0 0 10px">This lounge is for verified women only, so the space stays safe and private.</p>'+
        '<p class="about">'+(!user?"Log in first, then create your Meet new people profile as a woman and send a quick selfie.":
          !mine?"Create your Meet new people profile (as a woman) and send a quick selfie.":
          mine.gender!=="woman"?"Only women can enter this lounge.":
          s==="pending"?"Your selfie is being checked. You will get access soon.":
          "Send a quick selfie from your Meet new people profile to get access.")+'</p>'+
        (mine&&mine.gender!=="woman"?'':'<button class="cta" id="npLGo">Go to Meet new people</button>');
      var g=box.querySelector("#npLGo");if(g)g.onclick=function(){if(typeof go==="function")go("buddy")};
    }
    try{
      if(womanOK()){if(!lady){lady={name:(mine&&mine.name)||"Admin",insta:"",bio:adminOK&&!mine?"Moderator":"",followers:0};store.set("np_lady",lady)}}
      else if(lady){lady=null}
    }catch(e){}
  }
  function paintLoungeFriend(){
    try{if(typeof lTab==="undefined"||lTab!=="friend"||!lady)return}catch(e){return}
    var v=document.getElementById("lview");if(!v||v.querySelector("#npLMeet"))return;
    v.innerHTML='<div id="npLMeet"><div class="npm-card hl"><b>Meet new people · women</b><p class="npm-plan">The same Meet new people as outside, showing verified women only. Say hi, make a plan, meet in public places.</p><div class="npm-acts"><button class="npm-btn" id="npLAll">Open Meet new people</button></div></div>'+
      '<div class="npm-search"><input id="npLQ" type="search" placeholder="Search women by name, city, language, plan…" value="'+esc(q.lounge)+'" aria-label="Search women"></div><div id="npLList"></div></div>';
    v.querySelector("#npLAll").onclick=function(){go("buddy")};
    v.querySelector("#npLQ").oninput=function(){q.lounge=this.value;list(v.querySelector("#npLList"),q.lounge,"woman",true)};
    if(!mine&&!adminOK)v.querySelector("#npLList").innerHTML='<p class="npm-empty">Create your Meet new people profile first.</p>';
    else list(v.querySelector("#npLList"),q.lounge,"woman",true);
  }
  if(typeof renderLadies==="function"){var _rl=renderLadies;renderLadies=function(){paintLounge();_rl();paintLoungeFriend()}}

  /* ---------- Friends Location & Bill Splitter: tile in the All services grid ---------- */
  function flbTile(){
    var cats=document.getElementById("cats");if(!cats||document.getElementById("npFLBcat"))return;
    var b=document.createElement("button");b.className="cat";b.id="npFLBcat";b.type="button";
    b.innerHTML='<span>'+(typeof ico==="function"?ico("map"):"")+'</span>';b.append("Friends Location & Bill Splitter");
    b.onclick=function(e){e.stopPropagation();if(typeof window.openFinder==="function")openFinder()};
    cats.appendChild(b);
  }

  function paintAll(){paintMain();try{if(typeof renderLadies==="function")renderLadies()}catch(e){}}
  var busy=false;
  new MutationObserver(function(){if(busy)return;busy=true;requestAnimationFrame(function(){busy=false;flbTile();mount()})}).observe(document.body,{childList:true,subtree:true});
  flbTile();
  async function onUser(u){
    var changed=(u&&u.id)!==(user&&user.id);user=u;if(!changed&&loaded)return;
    loaded=false;mine=null;people=[];unread={};paintMain();
    if(u){await checkAdmin();subscribe()}
    if(adminOK)try{renderLadies()}catch(e){}else{adminOK=false;if(chan){sb.removeChannel(chan);chan=null}}
    await refresh();
  }
  sb.auth.getSession().then(function(r){onUser(r.data.session?r.data.session.user:null)});
  sb.auth.onAuthStateChange(function(e,s){onUser(s?s.user:null)});
  if(typeof go==="function"){var _go=go;go=function(t){_go(t);if(t==="buddy"){paintMain();if(user&&mine)loadPeople().then(paintMain)}}}
})();

/* ===== Club dashboard: every tab LIVE (30 Sep 2026)
   Reservations: Confirmed → Arrived → Completed (final bill) or No-show.
   Overview, Orders (upcoming app bookings), Attendance, CRM, Reports, Post updates and Photos
   now read and save real data in Supabase instead of sample numbers. ===== */
(function(){
  if(!window.supabase||typeof renderDash!=="function")return;
  var sb=window.supabase.createClient("https://mymtgbmcjbwsnetzwgoy.supabase.co","sb_publishable_ViFodxG8kAENr78Fyp-BwQ_iA_BfAD0");
  var COMMISSION=0.20; /* Namaste Pattaya commission on app bookings (per partner agreement) */
  var LV={waiter:1,captain:2,asst_manager:3,manager:4,general_manager:5,owner:6};
  var ST={pending:"Pending",confirmed:"Confirmed",arrived:"Arrived",completed:"Completed",no_show:"No-show",cancelled:"Cancelled"};
  var SRC={app:"App",phone:"Phone",walkin:"Walk-in",whatsapp:"WhatsApp"};
  var LEGAL=/(drink|beer|whisk|vodka|champagne|cocktail|\bshots?\b|bottle|alcohol|\bwine|\brum\b|tequila|\bgin\b|liquor|hookah|shisha|vape|cigar|smok)/i;
  var user=null,isAdm=false,myStaff={},token=0,rep="7d";
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function ymd(d){var x=new Date(d);return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0")}
  function addDays(d,n){var x=new Date(d);x.setDate(x.getDate()+n);return x}
  function M(n){n=Math.round(Number(n)||0);return "฿"+n.toLocaleString("en-US")} /* dashboards always in baht (bills are in baht) */
  function spend(x){return Number(x.final_bill!=null?x.final_bill:x.total)||0}
  function lvl(v){return isAdm?99:(LV[myStaff[v]]||0)}
  function venueName(id){var c=(typeof CLUBS!=="undefined"?CLUBS:[]).find(function(x){return x.id===id});return c?c.name:id}
  function card(h){return '<div class="lcard">'+h+'</div>'}
  function note(t){return '<p class="small" style="margin:0 0 10px">'+t+'</p>'}

  async function loadMe(){
    isAdm=false;myStaff={};if(!user)return;
    try{var a=await sb.rpc("np_is_admin");isAdm=!a.error&&a.data===true}catch(e){}
    var s=await sb.from("np_venue_staff").select("venue_id,role").eq("user_id",user.id);
    (s.data||[]).forEach(function(x){myStaff[x.venue_id]=x.role});
  }

  /* ---------- Reservations: "Completed" step after "Arrived" ---------- */
  function patchRes(){
    var box=document.getElementById("rsList");if(!box)return;
    var f=document.getElementById("rsF");
    if(f&&!f.querySelector('option[value="completed"]')){var o=document.createElement("option");o.value="completed";o.textContent="Completed";f.insertBefore(o,f.querySelector('option[value="no_show"]'))}
    box.querySelectorAll("[data-id]").forEach(function(c){
      var s=c.querySelector(".status"),btns=c.querySelector(".rsbtns");if(!s||!btns||btns.querySelector("[data-done]"))return;
      if(s.textContent.trim()!=="Arrived")return;
      var b=document.createElement("button");b.className="pill on";b.dataset.done="1";b.textContent="Completed (guest left)";
      btns.insertBefore(b,btns.firstChild);
      b.onclick=async function(){
        var v=prompt("Final bill for this table in baht (numbers only). Leave empty if the same as the booking.","");
        if(v===null)return;
        var d={status:"completed"},n=parseFloat(String(v).replace(/[^0-9.]/g,""));if(n>=0&&String(v).trim()!=="")d.final_bill=n;
        b.disabled=true;
        var r=await sb.from("np_bookings").update(d).eq("id",c.dataset.id);
        if(r.error&&d.final_bill!=null){delete d.final_bill;r=await sb.from("np_bookings").update(d).eq("id",c.dataset.id)}
        if(r.error){alert(r.error.message);b.disabled=false;return}
        renderDash();
      };
    });
  }
  new MutationObserver(function(){patchRes()}).observe(document.body,{childList:true,subtree:true});

  /* ---------- live tabs ---------- */
  var LIVE=["over","orders","att","crm","rep","upd","photos"];
  var _prev=renderDash;
  renderDash=function(){try{restrict()}catch(e){}
    var dv=document.getElementById("dVenue");
    if(dv&&dv.value==="__none"){var view=document.getElementById("dview");if(view)view.innerHTML='<div class="lcard"><h4>No venue linked yet</h4><p>'+(user?'When Namaste Pattaya approves your venue, or your manager adds your email ('+esc(user.email)+') in the Staff tab, your venue appears here.':'Log in with your partner or staff account to see your venue.')+'</p></div>';return}
    _prev();try{live()}catch(e){console.error(e)}};
  function live(){
    var t=(typeof dTab!=="undefined")?dTab:"";if(LIVE.indexOf(t)<0){token++;return}  /* switching tab cancels any slower screen still loading */
    var view=document.getElementById("dview"),dv=document.getElementById("dVenue");if(!view||!dv)return;
    var v=dv.value,L=lvl(v),my=++token;
    if(!user){view.innerHTML=card('<h4>Staff login</h4><p>Log in with your staff account to see live data for your club.</p><button class="pill on" id="clLog" style="margin-top:10px">Log in</button>');
      view.querySelector("#clLog").onclick=function(){var b=document.querySelector(".np-hbtn.user");if(b)b.click()};return}
    if(v==="__none"){view.innerHTML=card('<h4>No venue linked yet</h4><p>When Namaste Pattaya approves your venue, or your manager adds your email ('+esc(user.email)+') in the Staff tab, your venue appears here.</p>');return}
    if(!L){view.innerHTML=card('<h4>Not linked to '+esc(venueName(v))+'</h4><p>Ask your manager, general manager or owner to add your email ('+esc(user.email)+') in the Staff tab.</p>');return}
    view.innerHTML='<p class="small">Loading…</p>';
    var ok=function(){return my===token};
    ({over:over,orders:orders,att:att,crm:crm,rep:report,upd:updates,photos:photos})[t](view,v,L,ok);
  }
  async function bookings(v,from,to){
    var q=sb.from("np_bookings").select("*").eq("venue_id",v);
    if(from)q=q.gte("night",from);if(to)q=q.lte("night",to);
    var r=await q.order("night",{ascending:false}).limit(5000);
    if(r.error)throw r.error;return r.data||[];
  }
  function fail(view,e){view.innerHTML=card('<h4>Could not load</h4><p class="small">'+esc(e&&e.message||e)+'</p>')}

  /* Overview */
  async function over(view,v,L,ok){
    try{
      var today=ymd(new Date()),rows=await bookings(v,ymd(addDays(new Date(),-6)),today),att=await sb.from("np_attendance").select("id").eq("venue_id",v).eq("night",today).is("check_out",null);
      if(!ok())return;
      var tn=rows.filter(function(x){return x.night===today&&x.status!=="cancelled"});
      var g=tn.reduce(function(s,x){return s+(x.guests||0)},0),rev=tn.reduce(function(s,x){return s+spend(x)},0);
      var arr=tn.filter(function(x){return x.status==="arrived"||x.status==="completed"}).length;
      var days=[],mx=1;for(var i=6;i>=0;i--){var d=ymd(addDays(new Date(),-i)),n=rows.filter(function(x){return x.night===d&&x.status!=="cancelled"}).length;days.push([d,n]);mx=Math.max(mx,n)}
      view.innerHTML='<div class="kpis"><div class="kpi"><small>Reservations tonight</small><b>'+tn.length+'</b></div><div class="kpi"><small>Guests expected</small><b>'+g+'</b></div>'+
        '<div class="kpi"><small>Arrived so far</small><b>'+arr+'</b></div>'+(L>=4?'<div class="kpi"><small>Revenue tonight</small><b>'+M(rev)+'</b></div>':'')+
        '<div class="kpi"><small>Staff on shift</small><b>'+((att.data||[]).length)+'</b></div></div>'+
        '<div class="bars">'+days.map(function(x){var wd=new Date(x[0]+"T12:00").toLocaleDateString("en-GB",{weekday:"short"});return '<div style="height:'+Math.max(4,Math.round(x[1]/mx*100))+'%" title="'+x[1]+' bookings"><span>'+wd+'</span></div>'}).join("")+'</div>'+
        '<p class="small" style="margin-top:26px">Bookings, last 7 nights (live)</p>';
    }catch(e){fail(view,e)}
  }

  /* Orders = upcoming bookings from the app, next 30 nights */
  async function orders(view,v,L,ok){
    try{
      var today=ymd(new Date()),rows=(await bookings(v,today,ymd(addDays(new Date(),30)))).filter(function(x){return x.source==="app"&&x.status!=="cancelled"});
      if(!ok())return;
      rows.sort(function(a,b){return (a.night+(a.time||"")).localeCompare(b.night+(b.time||""))});
      var tot=rows.reduce(function(s,x){return s+spend(x)},0);
      view.innerHTML=note('Upcoming bookings from the Namaste Pattaya app (next 30 nights). Mark Arrived and Completed in <b>Reservations</b> on the night.')+
        '<p class="small" style="margin:0 0 10px"><b>'+rows.length+'</b> bookings · <b>'+rows.reduce(function(s,x){return s+(x.guests||0)},0)+'</b> guests'+(L>=4?' · '+M(tot):'')+'</p>'+
        (rows.length?rows.map(function(x){return card('<div class="lrow"><div style="min-width:0"><h4>'+esc(x.name)+' · '+x.guests+' pax</h4><p>'+new Date(x.night+"T12:00").toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})+(x.time?' · '+esc(x.time):'')+(x.package?' · '+esc(x.package):'')+'</p><p class="small">'+esc(x.code)+(x.phone?' · <a href="tel:'+esc(x.phone)+'">'+esc(x.phone)+'</a>':'')+(L>=4&&spend(x)?' · '+M(spend(x)):'')+'</p></div><span class="status">'+(ST[x.status]||esc(x.status))+'</span></div>')}).join(""):'<p class="small">No upcoming app bookings yet.</p>');
    }catch(e){fail(view,e)}
  }

  /* Attendance: each staff member checks in and out; managers see everyone */
  async function att(view,v,L,ok){
    var today=ymd(new Date());
    var r=await sb.from("np_attendance").select("*").eq("venue_id",v).eq("night",today).order("check_in");
    if(!ok())return;
    if(r.error){view.innerHTML=card('<h4>Almost ready</h4><p class="small">Please run np-club-dashboard.sql in Supabase.</p>');return}
    var rows=r.data||[],mine=rows.find(function(x){return x.user_id===user.id&&!x.check_out});
    function tm(t){return t?new Date(t).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}):""}
    view.innerHTML=card('<div class="lrow"><div><h4>You</h4><p>'+(mine?'Checked in at '+tm(mine.check_in):'Not checked in')+'</p></div><button class="pill '+(mine?'':'on')+'" id="atMe">'+(mine?'Check out':'Check in')+'</button></div>')+
      '<h3 style="font-size:15px;margin:14px 0 8px">Tonight</h3>'+
      (rows.length?rows.map(function(x){return card('<div class="lrow"><div style="min-width:0"><h4>'+esc(x.name||"Staff")+'</h4><p class="small">In '+tm(x.check_in)+(x.check_out?' · Out '+tm(x.check_out):' · on shift')+'</p></div>'+
        (L>=4&&!x.check_out&&x.user_id!==user.id?'<button class="pill" data-out="'+x.id+'">Check out</button>':'<span class="status">'+(x.check_out?'Off':'Working')+'</span>')+'</div>')}).join(""):'<p class="small">Nobody checked in yet tonight.</p>');
    view.querySelector("#atMe").onclick=async function(){this.disabled=true;var x;
      if(mine)x=await sb.from("np_attendance").update({check_out:new Date().toISOString()}).eq("id",mine.id);
      else x=await sb.from("np_attendance").insert({venue_id:v,night:today,name:(user.user_metadata&&user.user_metadata.name)||user.email});
      if(x.error)alert(x.error.message);renderDash()};
    view.querySelectorAll("[data-out]").forEach(function(b){b.onclick=async function(){var x=await sb.from("np_attendance").update({check_out:new Date().toISOString()}).eq("id",b.dataset.out);if(x.error)alert(x.error.message);renderDash()}});
  }

  /* CRM: real customers of this club (manager and up) */
  async function crm(view,v,L,ok){
    if(L<4){view.innerHTML=card('<h4>Managers only</h4><p class="small">Customer details are for managers, general managers and owners.</p>');return}
    try{
      var rows=await bookings(v,ymd(addDays(new Date(),-365)),null);if(!ok())return;
      var map={};rows.forEach(function(x){if(x.status==="cancelled")return;var k=x.customer_id||(x.phone||"").replace(/\D/g,"")||(x.name||"").toLowerCase();if(!k)return;
        var c=map[k]||(map[k]={name:x.name,phone:x.phone,visits:0,books:0,noshow:0,spend:0,last:""});
        c.books++;if(x.status==="arrived"||x.status==="completed"){c.visits++;c.spend+=spend(x);if(x.night>c.last)c.last=x.night}
        if(x.status==="no_show")c.noshow++;if(!c.phone&&x.phone)c.phone=x.phone});
      var list=Object.keys(map).map(function(k){return map[k]}).sort(function(a,b){return b.spend-a.spend||b.visits-a.visits});
      function tag(c){return c.spend>=50000||c.visits>=5?"VIP":c.visits>=2?"Regular":c.visits===1?"New":"Booked"}
      view.innerHTML=note('Customers from the last 12 months, built from real bookings. Use it only to serve your guests (PDPA).')+
        '<div class="fields" style="margin-bottom:10px"><label class="full">Search<input id="crQ" type="search" placeholder="Name or phone"></label></div><div id="crL"></div>';
      function draw(){var q=view.querySelector("#crQ").value.trim().toLowerCase(),l=list.filter(function(c){return !q||String(c.name).toLowerCase().indexOf(q)>-1||String(c.phone||"").indexOf(q)>-1});
        view.querySelector("#crL").innerHTML=l.length?'<div class="tblw"><table class="tbl"><tr><th>Customer</th><th>Visits</th><th>Spend</th><th>Last visit</th><th>Tag</th></tr>'+
          l.map(function(c){var wa=String(c.phone||"").replace(/\D/g,"");return '<tr><td>'+esc(c.name)+(c.phone?'<br><a class="small" href="tel:'+esc(c.phone)+'">'+esc(c.phone)+'</a>'+(wa?' · <a class="small" href="https://wa.me/'+wa+'" target="_blank" rel="noopener">WhatsApp</a>':''):'')+(c.noshow?'<br><span class="small">No-shows: '+c.noshow+'</span>':'')+'</td><td>'+c.visits+'</td><td>'+M(c.spend)+'</td><td>'+(c.last?new Date(c.last+"T12:00").toLocaleDateString("en-GB",{day:"numeric",month:"short"}):"–")+'</td><td><span class="status">'+tag(c)+'</span></td></tr>'}).join("")+'</table></div>':'<p class="small">No customers yet. They appear after their first booking.</p>'}
      view.querySelector("#crQ").oninput=draw;draw();
    }catch(e){fail(view,e)}
  }

  /* Reports (manager and up) */
  async function report(view,v,L,ok){
    if(L<4){view.innerHTML=card('<h4>Managers only</h4><p class="small">Reports are for managers, general managers and owners.</p>');return}
    var now=new Date(),P={tonight:[ymd(now),ymd(now),"Tonight"],"7d":[ymd(addDays(now,-6)),ymd(now),"Last 7 nights"],month:[ymd(new Date(now.getFullYear(),now.getMonth(),1)),ymd(now),"This month"],last:[ymd(new Date(now.getFullYear(),now.getMonth()-1,1)),ymd(new Date(now.getFullYear(),now.getMonth(),0)),"Last month"]};
    try{
      var p=P[rep]||P["7d"],rows=await bookings(v,p[0],p[1]);if(!ok())return;
      function c(f){return rows.filter(f)}
      var live=c(function(x){return x.status!=="cancelled"}),came=c(function(x){return x.status==="arrived"||x.status==="completed"});
      var rev=came.reduce(function(s,x){return s+spend(x)},0),appRev=came.filter(function(x){return x.source==="app"}).reduce(function(s,x){return s+spend(x)},0);
      var bySrc={};live.forEach(function(x){var k=SRC[x.source]||x.source||"Other";bySrc[k]=(bySrc[k]||0)+1});
      function tr(a,b){return '<tr><td>'+a+'</td><td>'+b+'</td></tr>'}
      view.innerHTML='<div class="fields" style="margin-bottom:10px"><label class="full">Period<select id="rpP">'+Object.keys(P).map(function(k){return '<option value="'+k+'"'+(k===rep?" selected":"")+'>'+P[k][2]+'</option>'}).join("")+'</select></label></div>'+
        '<div class="tblw"><table class="tbl"><tr><th>'+p[2]+'</th><th>Live</th></tr>'+
        tr("Reservations",live.length)+tr("Guests booked",live.reduce(function(s,x){return s+(x.guests||0)},0))+
        tr("Arrived / completed",came.length)+tr("No-shows",c(function(x){return x.status==="no_show"}).length)+tr("Cancelled",c(function(x){return x.status==="cancelled"}).length)+
        tr("Revenue (guests who came)",M(rev))+tr("From app bookings",M(appRev))+
        tr("Commission to Namaste Pattaya ("+Math.round(COMMISSION*100)+"% of app bookings)",M(appRev*COMMISSION))+
        '</table></div><p class="small" style="margin-top:10px">Bookings by source: '+(Object.keys(bySrc).map(function(k){return esc(k)+' '+bySrc[k]}).join(" · ")||"none")+'</p>'+
        '<p class="small">Revenue uses the final bill when staff tap "Completed", otherwise the booking amount.</p>';
      view.querySelector("#rpP").onchange=function(){rep=this.value;renderDash()};
    }catch(e){fail(view,e)}
  }

  /* Post updates (captain and up) – saved online, shown in the app */
  async function updates(view,v,L,ok){
    var r=await sb.from("np_venue_updates").select("*").eq("venue_id",v).order("created_at",{ascending:false}).limit(20);if(!ok())return;
    var rows=r.data||[];
    view.innerHTML=(L>=2?'<div class="partner"><div class="fields"><label>Type<select id="uT"><option>Ladies night</option><option>Event</option><option>Live music / DJ</option><option>Table offer</option><option>Free tables tonight</option></select></label>'+
      '<label>Show to<select id="uA"><option value="ladies">Empowered Girls lounge</option><option value="all">All users</option></select></label>'+
      '<label class="full">Update<input id="uX" maxlength="300" placeholder="e.g. Bollywood night with DJ from 22:00, free entry for ladies"></label></div>'+
      '<p class="small">Thai law: no alcohol, drink deals, tobacco or shisha in updates.</p><button class="cta" id="uGo">Post update</button><p class="err" id="uM" role="status"></p></div>':note('Captains and above can post updates.'))+
      '<h3 style="font-size:15px;margin:14px 0 8px">Posted</h3>'+(rows.length?rows.map(function(x){return card('<div class="lrow"><div style="min-width:0"><h4>'+esc(x.kind||"Update")+'</h4><p>'+esc(x.body)+'</p><p class="small">'+(x.audience==="ladies"?"Empowered Girls lounge":"All users")+' · '+new Date(x.created_at).toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})+'</p></div>'+(L>=4?'<button class="pill" data-del="'+x.id+'">Delete</button>':'')+'</div>')}).join(""):'<p class="small">No updates yet.</p>');
    if(L>=2)view.querySelector("#uGo").onclick=async function(){
      var t=view.querySelector("#uX").value.trim(),m=view.querySelector("#uM");m.style.color="";
      if(!t){m.textContent="Write your update.";return}
      if(LEGAL.test(t)){m.textContent="Please remove alcohol, drink, tobacco or shisha words (Thai law).";return}
      this.disabled=true;var x=await sb.from("np_venue_updates").insert({venue_id:v,venue_name:venueName(v),kind:view.querySelector("#uT").value,body:t,audience:view.querySelector("#uA").value});this.disabled=false;
      if(x.error){m.textContent=/check|legal/i.test(x.error.message)?"Please remove alcohol, drink, tobacco or shisha words (Thai law).":x.error.message;return}
      pullUpdates();renderDash()};
    view.querySelectorAll("[data-del]").forEach(function(b){b.onclick=async function(){if(!confirm("Delete this update?"))return;await sb.from("np_venue_updates").delete().eq("id",b.dataset.del);pullUpdates();renderDash()}});
  }

  /* Photos (captain and up) – uploaded online so every user sees them */
  function shrinkBlob(file){return new Promise(function(ok){var img=new Image(),u=URL.createObjectURL(file);img.onload=function(){var k=Math.min(1,1400/Math.max(img.width,img.height)),cv=document.createElement("canvas");cv.width=Math.round(img.width*k);cv.height=Math.round(img.height*k);cv.getContext("2d").drawImage(img,0,0,cv.width,cv.height);URL.revokeObjectURL(u);cv.toBlob(ok,"image/jpeg",.82)};img.onerror=function(){URL.revokeObjectURL(u);ok(null)};img.src=u})}
  async function photos(view,v,L,ok){
    var r=await sb.from("np_venue_photos").select("*").eq("venue_id",v).order("created_at");if(!ok())return;
    var rows=r.data||[];
    view.innerHTML='<div class="partner"><h3 style="font-size:16px;margin:0 0 6px">Club photos</h3><p class="small">Your own photos only. The first one is your cover in the app. Up to 6. No bottles, drink brands or smoking in photos (Thai law).</p>'+
      '<div class="gal" style="margin:12px 0">'+rows.map(function(x,i){return '<div class="gi"><img src="'+esc(x.url)+'" alt="Photo '+(i+1)+'">'+(L>=2?'<button data-del="'+x.id+'" aria-label="Remove photo">'+(typeof ico==="function"?ico("close"):"×")+'</button>':'')+'</div>'}).join("")+'</div>'+
      (L>=2&&rows.length<6?'<label class="cta" style="display:block;text-align:center;cursor:pointer">Upload photos<input type="file" id="phIn2" accept="image/*" multiple hidden></label><label class="npm-chk" style="display:flex;gap:8px;margin-top:10px;font-size:14px"><input type="checkbox" id="phOk"> These are our own photos and we have the right to use them.</label>':'')+'<p class="err" id="phM" role="status"></p></div>';
    var inp=view.querySelector("#phIn2");
    if(inp)inp.onchange=async function(e){var m=view.querySelector("#phM");
      if(!view.querySelector("#phOk").checked){m.textContent="Please tick the box first.";inp.value="";return}
      var files=[].slice.call(e.target.files,0,6-rows.length);m.style.color="";m.textContent="Uploading…";
      for(var i=0;i<files.length;i++){var b=await shrinkBlob(files[i]);if(!b)continue;var path=v+"/"+Date.now()+"-"+i+".jpg";
        var up=await sb.storage.from("venue-photos").upload(path,b,{contentType:"image/jpeg"});if(up.error){m.textContent=up.error.message;return}
        var url=sb.storage.from("venue-photos").getPublicUrl(path).data.publicUrl;
        var x=await sb.from("np_venue_photos").insert({venue_id:v,url:url,path:path});if(x.error){m.textContent=x.error.message;return}}
      await pullPhotos();renderDash()};
    view.querySelectorAll("[data-del]").forEach(function(b){b.onclick=async function(){if(!confirm("Remove this photo?"))return;
      var x=rows.find(function(r){return String(r.id)===b.dataset.del});await sb.from("np_venue_photos").delete().eq("id",b.dataset.del);if(x)await sb.storage.from("venue-photos").remove([x.path]);
      await pullPhotos();renderDash()}});
  }

  /* ---------- show updates and photos to every app user ---------- */
  async function pullUpdates(){
    try{var r=await sb.from("np_venue_updates").select("venue_name,kind,body,created_at").gte("created_at",addDays(new Date(),-14).toISOString()).order("created_at",{ascending:false}).limit(50);
      if(!r.error&&r.data&&r.data.length&&typeof store!=="undefined"){store.set("np_lady_updates",r.data.map(function(x){return [x.venue_name||"",x.kind||"Update",x.body]}))}}catch(e){}
  }
  async function pullPhotos(){
    try{var r=await sb.from("np_venue_photos").select("venue_id,url,created_at").order("created_at");
      if(r.error||!r.data||typeof store==="undefined")return;var by={};r.data.forEach(function(x){(by[x.venue_id]=by[x.venue_id]||[]).push(x.url)});
      Object.keys(by).forEach(function(k){store.set("np_photos_"+k,by[k].slice(0,6))});
      ["renderGrid","renderRail"].forEach(function(f){try{if(typeof window[f]==="function")window[f]()}catch(e){}});
    }catch(e){}
  }
  pullUpdates();pullPhotos();

  /* venue list: admins see every venue, partners only the venues they work at */
  var ALLV=null;
  function restrict(){
    var dv=document.getElementById("dVenue");if(!dv)return;
    if(!ALLV||dv.options.length>ALLV.length)ALLV=[].map.call(dv.options,function(o){return [o.value,o.textContent]}).filter(function(x){return x[0]!=="__none"});
    var allow=isAdm?ALLV:ALLV.filter(function(x){return myStaff[x[0]]});
    var key=allow.map(function(x){return x[0]}).join(",");if(dv.dataset.allow===key&&dv.options.length)return;
    var cur=dv.value;dv.innerHTML="";
    if(!allow.length){var o=document.createElement("option");o.value="__none";o.textContent=user?"No venue linked to your account yet":"Log in to see your venue";dv.appendChild(o)}
    allow.forEach(function(x){var o=document.createElement("option");o.value=x[0];o.textContent=x[1];dv.appendChild(o)});
    dv.dataset.allow=key;
    if(allow.some(function(x){return x[0]===cur}))dv.value=cur;
  }
  async function onUser(u){var same=(u&&u.id)===(user&&user.id);user=u;if(same&&u)return;await loadMe();restrict();
    var d=document.getElementById("dash");if(d&&!d.hidden)renderDash()}
  sb.auth.getSession().then(function(r){onUser(r.data.session?r.data.session.user:null)});
  sb.auth.onAuthStateChange(function(e,s){onUser(s?s.user:null)});
})();

/* ===== Agent dashboard (30 Sep 2026): live referred bookings, commission, payouts, share link.
   Admin: approve or reject agents, see what each agent is owed, record payouts. ===== */
(function(){
  if(!window.supabase||typeof panel==="undefined")return;
  var sb=window.supabase.createClient("https://mymtgbmcjbwsnetzwgoy.supabase.co","sb_publishable_ViFodxG8kAENr78Fyp-BwQ_iA_BfAD0");
  var APP="https://namastepattayareservationsindthai.vercel.app/";
  var RATE={agent:0.05,traveller:0.03};
  var ST={pending:"Pending",confirmed:"Confirmed",arrived:"Arrived",completed:"Completed",no_show:"No-show",cancelled:"Cancelled"};
  var user=null,isAdm=false,per="month";
  function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
  function M(n){n=Math.round(Number(n)||0);return "฿"+n.toLocaleString("en-US")} /* dashboards always in baht (bills are in baht) */
  function X(){return typeof ico==="function"?ico("close"):"×"}
  function head(t,id){return '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><h2 id="sheetTitle" style="font-size:20px">'+t+'</h2><button class="theme" id="'+id+'" aria-label="Close">'+X()+'</button></div>'}
  function open(h){panel.innerHTML=h;sheet.classList.add("open");document.body.style.overflow="hidden";panel.scrollTop=0}
  function meta(){return (user&&user.user_metadata)||{}}
  function viewAs(){try{return localStorage.getItem("np_view_as")||""}catch(e){return ""}}
  function isAgent(){return /^agent/.test(meta().role||"")||(isAdm&&/^agent/.test(viewAs()))}
  function myCode(){var m=meta(),g="";try{g=(0,eval)("typeof myCode!=='undefined'?myCode:''")}catch(e){}return String(m.ref_code||g||"").toUpperCase()}
  function venueName(id){var c=(typeof CLUBS!=="undefined"?CLUBS:[]).find(function(x){return x.id===id});return c?c.name:id}
  function ymd(d){var x=new Date(d);return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0")}

  /* referral links: ?ref=CODE fills the booking form automatically */
  try{var rq=new URLSearchParams(location.search).get("ref");if(rq&&/^[A-Z0-9]{4,12}$/i.test(rq))localStorage.setItem("np_ref_in",rq.toUpperCase())}catch(e){}
  function fillRef(){var f=document.getElementById("fRef");if(!f||f.value)return;var r="";try{r=localStorage.getItem("np_ref_in")||""}catch(e){}if(r&&r!==myCode())f.value=r}

  /* ---------- agent dashboard ---------- */
  async function openAgent(){
    if(!user)return;
    var m=meta(),st=m.agent_status||"pending",code=myCode(),rate=isAgent()?RATE.agent:RATE.traveller;
    open('<div class="pbody">'+head(isAgent()?"Agent dashboard":"My referrals","agX")+
      '<div class="lcard hl" style="margin-top:12px"><h4>'+esc(m.agency||m.name||user.email)+'</h4><p class="small">'+(isAgent()?(st==="approved"?"✅ Agent approved · 5% commission":st==="rejected"?"Agent account not approved. Please contact us.":"⏳ Under review. You can already share your code; commission is paid after approval."):"Traveller · 3% referral reward")+'</p></div>'+
      '<div class="refcode"><strong class="notranslate" translate="no">'+esc(code||"—")+'</strong><span class="small">Your code. Clients type it when booking, or use your link.</span></div>'+
      '<div class="rsbtns" style="margin:8px 0 14px"><button class="pill on" id="agShare">Share on WhatsApp</button><button class="pill" id="agCopy">Copy my link</button></div>'+
      '<div class="fields"><label class="full">Period<select id="agP"><option value="month">This month</option><option value="last">Last month</option><option value="all">All time</option></select></label></div>'+
      '<div id="agBody"><p class="small">Loading…</p></div></div>');
    panel.querySelector("#agX").onclick=closeSheet;
    var link=APP+"?ref="+encodeURIComponent(code);
    panel.querySelector("#agShare").onclick=function(){window.open("https://wa.me/?text="+encodeURIComponent("Book clubs, Indian restaurants, tours and more in Pattaya with Namaste Pattaya Reservations: "+link),"_blank")};
    panel.querySelector("#agCopy").onclick=function(){var b=this;(navigator.clipboard?navigator.clipboard.writeText(link):Promise.reject()).then(function(){b.textContent="Copied ✓"},function(){prompt("Copy your link:",link)})};
    var sel=panel.querySelector("#agP");sel.value=per;sel.onchange=function(){per=this.value;draw()};
    var r=await sb.rpc("np_my_referrals"),pay=await sb.from("np_agent_payouts").select("amount,paid_on,note").eq("agent",user.id).order("paid_on",{ascending:false});
    var body=panel.querySelector("#agBody");if(!body)return;
    if(r.error){body.innerHTML='<div class="lcard"><h4>Almost ready</h4><p class="small">'+(/function|does not exist/i.test(r.error.message)?"The agent dashboard is being set up. Please check back soon.":esc(r.error.message))+'</p></div>';return}
    var rows=r.data||[],pays=pay.data||[];
    function draw(){
      var now=new Date(),from=null,to=null;
      if(per==="month"){from=ymd(new Date(now.getFullYear(),now.getMonth(),1))}
      if(per==="last"){from=ymd(new Date(now.getFullYear(),now.getMonth()-1,1));to=ymd(new Date(now.getFullYear(),now.getMonth(),0))}
      var l=rows.filter(function(x){return (!from||x.night>=from)&&(!to||x.night<=to)});
      var live=l.filter(function(x){return x.status!=="cancelled"}),came=l.filter(function(x){return x.status==="arrived"||x.status==="completed"});
      var upcoming=l.filter(function(x){return (x.status==="confirmed"||x.status==="pending")&&x.night>=ymd(now)});
      var sales=came.reduce(function(s,x){return s+Number(x.amount||0)},0);
      var allEarn=rows.filter(function(x){return x.status==="arrived"||x.status==="completed"}).reduce(function(s,x){return s+Number(x.amount||0)*rate},0);
      var paid=pays.reduce(function(s,p){return s+Number(p.amount||0)},0);
      body.innerHTML='<div class="kpis"><div class="kpi"><small>Bookings</small><b>'+live.length+'</b></div><div class="kpi"><small>Guests</small><b>'+live.reduce(function(s,x){return s+(x.guests||0)},0)+'</b></div>'+
        '<div class="kpi"><small>Came (arrived)</small><b>'+came.length+'</b></div><div class="kpi"><small>Sales</small><b>'+M(sales)+'</b></div>'+
        '<div class="kpi"><small>Earned ('+Math.round(rate*100)+'%)</small><b>'+M(sales*rate)+'</b></div><div class="kpi"><small>Coming up</small><b>'+upcoming.length+'</b></div></div>'+
        '<div class="lcard" style="margin-top:12px"><div class="lrow"><div><h4>To be paid to you</h4><p class="small">All time earned '+M(allEarn)+' · paid '+M(paid)+'</p></div><div style="text-align:right"><b style="font-size:20px">'+M(Math.max(0,allEarn-paid))+'</b><br><span class="small">≈ ₹'+Math.round(Math.max(0,allEarn-paid)*((0,eval)("typeof INR_PER_THB!=='undefined'?INR_PER_THB:2.89"))).toLocaleString("en-IN")+'</span></div></div></div>'+
        '<h3 style="font-size:15px;margin:14px 0 8px">Bookings with your code</h3>'+
        (l.length?l.map(function(x){var c=x.status==="arrived"||x.status==="completed";
          return '<div class="lcard"><div class="lrow"><div style="min-width:0"><h4>'+esc(x.guest_name)+' · '+x.guests+' pax</h4><p class="small">'+esc(venueName(x.venue_id))+' · '+new Date(x.night+"T12:00").toLocaleDateString("en-GB",{day:"numeric",month:"short"})+(Number(x.amount)?' · '+M(x.amount):'')+(c?' · you earn '+M(Number(x.amount||0)*rate):'')+'</p></div><span class="status">'+(ST[x.status]||esc(x.status))+'</span></div></div>'}).join(""):'<p class="small">No bookings with your code in this period yet. Share your link to start earning.</p>')+
        (pays.length?'<h3 style="font-size:15px;margin:14px 0 8px">Payments received</h3>'+pays.map(function(p){return '<div class="lcard"><div class="lrow"><div><h4>'+M(p.amount)+'</h4><p class="small">'+new Date(p.paid_on+"T12:00").toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})+(p.note?' · '+esc(p.note):'')+'</p></div><span class="status">Paid</span></div></div>'}).join(""):'')+
        '<p class="small" style="margin-top:10px">Commission counts when your client arrives. The venue\'s final bill is used when available.</p>';
    }
    draw();
  }
  window.npOpenAgent=openAgent;

  /* ---------- admin: agents ---------- */
  async function openAgentsAdmin(){
    open('<div class="pbody">'+head("Admin · Agents","aaX")+'<div class="fields"><label class="full">Show<select id="aaF"><option value="pending">Waiting for approval</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="all">All</option></select></label></div><div id="aaL"><p class="small">Loading…</p></div></div>');
    panel.querySelector("#aaX").onclick=closeSheet;
    var r=await sb.rpc("np_list_agents"),box=panel.querySelector("#aaL");if(!box)return;
    if(r.error){box.innerHTML='<p class="err">'+esc(/function|does not exist/i.test(r.error.message)?"Please run np-agents.sql in Supabase first.":r.error.message)+'</p>';return}
    var rows=r.data||[],f=panel.querySelector("#aaF");f.value=rows.some(function(x){return x.status==="pending"})?"pending":"all";
    function draw(){var l=rows.filter(function(x){return f.value==="all"||x.status===f.value});
      box.innerHTML=l.length?l.map(function(a){var owed=Math.max(0,Number(a.sales||0)*RATE.agent-Number(a.paid||0)),wa=String(a.phone||"").replace(/\D/g,"");
        return '<div class="lcard" data-u="'+a.user_id+'"><div class="lrow"><div style="min-width:0"><h4>'+esc(a.agency||a.name||a.email)+'</h4><p class="small">'+esc([a.name,a.role==="agent_th"?"Thai agent":"Indian agent",a.city].filter(Boolean).join(" · "))+'</p>'+
          '<p class="small">'+esc(a.email)+(a.phone?' · <a href="tel:'+esc(a.phone)+'">'+esc(a.phone)+'</a>'+(wa?' · <a href="https://wa.me/'+wa+'" target="_blank" rel="noopener">WhatsApp</a>':''):'')+'</p>'+
          (a.reg_no?'<p class="small">Reg. no. '+esc(a.reg_no)+'</p>':'')+'<p class="small">Code <b>'+esc(a.ref_code||"—")+'</b> · '+a.bookings+' bookings · '+a.came+' came · sales '+M(a.sales)+'</p>'+
          '<p class="small">Owed <b>'+M(owed)+'</b> · paid '+M(a.paid)+'</p></div><span class="status">'+esc(a.status)+'</span></div>'+
          '<div class="rsbtns">'+(a.status!=="approved"?'<button class="pill on" data-s="approved">Approve</button>':'')+(a.status!=="rejected"?'<button class="pill" data-s="rejected">Reject</button>':'')+(owed>0?'<button class="pill" data-pay="'+Math.round(owed)+'">Record payout</button>':'')+'</div></div>'}).join(""):'<p class="small">No agents here.</p>';
      box.querySelectorAll("[data-s]").forEach(function(b){b.onclick=async function(){var id=b.closest("[data-u]").dataset.u;
        if(b.dataset.s==="rejected"&&!confirm("Reject this agent?"))return;b.disabled=true;
        var x=await sb.rpc("np_set_agent_status",{p_user:id,p_status:b.dataset.s});if(x.error){alert(x.error.message);b.disabled=false;return}
        rows.forEach(function(a){if(a.user_id===id)a.status=b.dataset.s});draw()}});
      box.querySelectorAll("[data-pay]").forEach(function(b){b.onclick=async function(){var id=b.closest("[data-u]").dataset.u;
        var v=prompt("Amount paid to this agent (baht):",b.dataset.pay);if(v===null)return;var n=parseFloat(String(v).replace(/[^0-9.]/g,""));if(!(n>0))return;
        var note=prompt("Note (optional, e.g. bank transfer ref):","")||null;
        var x=await sb.from("np_agent_payouts").insert({agent:id,amount:n,note:note});if(x.error){alert(x.error.message);return}
        rows.forEach(function(a){if(a.user_id===id)a.paid=Number(a.paid||0)+n});draw()}});
    }
    f.onchange=draw;draw();
  }
  window.npAgentsAdmin=openAgentsAdmin;

  /* ---------- buttons ---------- */
  function addButtons(){
    var acc=panel.querySelector("#umAcc");
    if(acc&&user&&!panel.querySelector("#npAgBtn")){var b=document.createElement("button");b.className="cta";b.id="npAgBtn";b.textContent=isAgent()?"Agent dashboard":"My referrals & earnings";b.onclick=openAgent;acc.insertAdjacentElement("beforebegin",b)}
    var adm=panel.querySelector(".lcard.adm");
    if(adm&&isAdm&&!adm.querySelector("#npAgAdm")){var a=document.createElement("button");a.className="pill";a.id="npAgAdm";a.textContent="Agents";a.onclick=openAgentsAdmin;var v=adm.querySelector("#adVip");if(v)v.insertAdjacentElement("afterend",a);else adm.appendChild(a)}
    var earn=document.getElementById("earn");
    if(earn&&user&&!document.getElementById("npAgEarn")){var c=document.createElement("div");c.id="npAgEarn";c.className="lcard hl";c.style.margin="10px 0 14px";
      c.innerHTML='<div class="lrow"><div><h4>'+(isAgent()?"Agent dashboard":"My referrals & earnings")+'</h4><p class="small">Live bookings with your code, what you earned, and payments.</p></div><button class="pill on">Open</button></div>';
      c.querySelector("button").onclick=openAgent;var t=earn.querySelector(".sectiontitle,h2");if(t)t.insertAdjacentElement("afterend",c);else earn.insertBefore(c,earn.firstChild)}
    fillRef();
  }
  var busy=false;
  new MutationObserver(function(){if(busy)return;busy=true;requestAnimationFrame(function(){busy=false;addButtons()})}).observe(document.body,{childList:true,subtree:true});
  async function onUser(u){user=u;isAdm=false;var e=document.getElementById("npAgEarn");if(e)e.remove();
    if(u){try{var a=await sb.rpc("np_is_admin");isAdm=!a.error&&a.data===true}catch(x){}}addButtons()}
  sb.auth.getSession().then(function(r){onUser(r.data.session?r.data.session.user:null)});
  sb.auth.onAuthStateChange(function(e,s){onUser(s?s.user:null)});
})();

/* ===== Admin Control Center (30 Sep 2026): one place for every dashboard + booking inbox
   with live notifications (bell, sound, phone notification) and Telegram alerts.
   Also saves bookings from guests who are not logged in, so no booking is lost. ===== */
(function(){
  if(!window.supabase||typeof panel==="undefined")return;
  var sb=window.supabase.createClient("https://mymtgbmcjbwsnetzwgoy.supabase.co","sb_publishable_ViFodxG8kAENr78Fyp-BwQ_iA_BfAD0");
  var user=null,isAdm=false,items=[],filter="new",q="",chan=null,unseen=0,loaded=false,open=false;
  var ST={pending:"Pending",confirmed:"Confirmed",arrived:"Arrived",completed:"Completed",no_show:"No-show",cancelled:"Cancelled",new:"New",in_progress:"Preparing",done:"Done"};
  function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
  function M(n){n=Math.round(Number(n)||0);return "฿"+n.toLocaleString("en-US")} /* dashboards always in baht (bills are in baht) */
  function X(){return typeof ico==="function"?ico("close"):"×"}
  function ymd(d){var x=new Date(d);return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0")}
  function club(id){return (typeof CLUBS!=="undefined"?CLUBS:[]).find(function(x){return x.id===id})}
  function vname(id,fb){var c=club(id);return c?c.name:(fb||(id==="vip"?"Package / VIP request":String(id||"").replace(/-/g," ")))}
  function catName(id,fb){var c=club(id),k=(c&&c.cat)||fb||"";return (typeof CATNAME!=="undefined"&&CATNAME[k])||k}

  /* ---------- guests without an account: save their booking online too ---------- */
  if(typeof store!=="undefined"&&typeof store.set==="function"){
    var _set=store.set,prev=(typeof bookings!=="undefined"&&bookings)?bookings.length:0;
    store.set=function(key,val){
      try{if(key==="np_bookings"&&Array.isArray(val)){if(val.length>prev&&val[0])guestSave(val[0]);prev=val.length}}catch(e){}
      return _set.apply(this,arguments);
    };
  }
  function guestSave(bk){
    if(!bk||!/^NP/.test(bk.code||"")||!bk.club)return;
    sb.auth.getSession().then(function(r){
      if(r.data&&r.data.session)return; /* logged-in bookings are saved by the club dashboard sync */
      sb.from("np_bookings").insert({code:bk.code,venue_id:bk.club,customer_id:null,name:bk.name||"Guest",phone:bk.phone||null,night:ymd(bk.date||new Date()),
        time:bk.time||null,guests:parseInt(bk.guests,10)||1,package:bk.pkg||null,total:Number(bk.total)||0,ref:bk.ref||null,source:"app",status:"confirmed"}).then(function(){},function(){});
    });
  }

  /* ---------- sound + phone notification ---------- */
  function beep(){try{var C=window.AudioContext||window.webkitAudioContext;if(!C)return;var c=new C(),t=c.currentTime;
    [0,0.18].forEach(function(d,i){var o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.value=i?1175:880;g.gain.setValueAtTime(0.0001,t+d);g.gain.exponentialRampToValueAtTime(0.3,t+d+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+d+0.25);o.connect(g);g.connect(c.destination);o.start(t+d);o.stop(t+d+0.3)})}catch(e){}}
  function notify(title,body){
    try{if(!("Notification" in window)||Notification.permission!=="granted")return;
      var opt={body:body,tag:"np-"+Date.now(),icon:"photos/icon-192.png"};
      if(navigator.serviceWorker&&navigator.serviceWorker.getRegistration)navigator.serviceWorker.getRegistration().then(function(reg){if(reg&&reg.showNotification)reg.showNotification(title,opt);else new Notification(title,opt)},function(){new Notification(title,opt)});
      else new Notification(title,opt);
    }catch(e){}
  }

  /* ---------- data ---------- */
  async function load(){
    var since=new Date();since.setDate(since.getDate()-60);
    var b=await sb.from("np_bookings").select("*").gte("night",ymd(since)).order("night",{ascending:false}).limit(600);
    var o=await sb.from("np_orders").select("*").order("created_at",{ascending:false}).limit(300);
    var map={};
    (b.data||[]).forEach(function(x){map[x.code||("b"+x.id)]={t:"b",id:x.id,code:x.code,venue:x.venue_id,vname:vname(x.venue_id),cat:catName(x.venue_id),name:x.name,phone:x.phone,night:x.night,time:x.time,guests:x.guests,pkg:x.package,total:Number(x.final_bill!=null?x.final_bill:x.total)||0,status:x.status,source:x.source,ref:x.ref,seen:!!x.admin_seen,created:x.created_at,guest:!x.customer_id,advPct:x.advance_pct||0,advAmt:x.advance_amount,advPaid:!!x.advance_paid}});
    (o.data||[]).forEach(function(x){var k=x.code||("o"+x.id),e=map[k];
      var row={t:"o",id:x.id,code:x.code,venue:x.venue_id,vname:x.venue_name||vname(x.venue_id),cat:catName(x.venue_id,x.category),name:x.customer_name,phone:x.customer_phone,night:String(x.booking_date||"").slice(0,10),time:x.booking_time,guests:x.guests,pkg:x.package,total:Number(x.total)||0,status:x.status,source:"app",order_type:x.order_type,address:x.delivery_address,seen:!!x.admin_seen,created:x.created_at};
      if(e){e.order=row;e.order_type=x.order_type;e.address=x.delivery_address;e.seen=e.seen&&row.seen;e.ostatus=x.status}else map[k]=row});
    items=Object.keys(map).map(function(k){return map[k]}).sort(function(a,b){return String(b.created||b.night).localeCompare(String(a.created||a.night))});
    unseen=items.filter(function(x){return !x.seen&&x.status!=="cancelled"}).length;loaded=true;bell();
  }
  function subscribe(){
    if(chan){sb.removeChannel(chan);chan=null}
    chan=sb.channel("np-admin-inbox")
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"np_bookings"},function(ev){fresh("New booking",ev.new.name,ev.new.venue_id,ev.new.night,ev.new.guests)})
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"np_orders"},function(ev){fresh("New restaurant order",ev.new.customer_name,ev.new.venue_id,ev.new.booking_date,ev.new.guests,ev.new.venue_name)})
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"np_bookings"},function(){soft()})
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"np_orders"},function(){soft()})
      .subscribe();
  }
  var st=null;function soft(){clearTimeout(st);st=setTimeout(function(){load().then(function(){if(open)draw()})},600)}
  function fresh(kind,name,venue,night,guests,vn){
    beep();notify("🔔 "+kind,(name||"Guest")+" · "+vname(venue,vn)+(night?" · "+String(night).slice(0,10):"")+(guests?" · "+guests+" pax":""));
    toast("🔔 "+kind+": "+(name||"Guest")+" · "+vname(venue,vn));soft();
  }
  function toast(t){var d=document.createElement("div");d.className="npcc-toast";d.textContent=t;d.onclick=function(){d.remove();openCC()};document.body.appendChild(d);setTimeout(function(){d.remove()},7000)}

  /* ---------- styles ---------- */
  if(!document.getElementById("npccCss")){
    var s=document.createElement("style");s.id="npccCss";
    s.textContent='#npBell{position:fixed;left:14px;bottom:calc(96px + env(safe-area-inset-bottom));z-index:60;width:52px;height:52px;border-radius:50%;border:1px solid rgba(233,185,73,.7);background:rgba(18,14,30,.95);color:#E9B949;display:none;align-items:center;justify-content:center;box-shadow:0 0 16px rgba(233,185,73,.25);cursor:pointer}'+
      '#npBell.show{display:flex}#npBell b{position:absolute;top:-4px;right:-4px;min-width:22px;height:22px;padding:0 6px;border-radius:11px;background:#E5484D;color:#fff;font-size:12px;line-height:22px;text-align:center}'+
      '.npcc-toast{position:fixed;left:12px;right:12px;top:calc(12px + env(safe-area-inset-top));z-index:10000;padding:14px 16px;border-radius:16px;background:rgba(18,14,30,.97);border:1px solid #E9B949;color:#fff;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,.4);cursor:pointer}'+
      '.npcc-tabs{display:flex;gap:6px;margin:12px 0}.npcc-tabs button{flex:1;padding:10px 6px;border-radius:12px;font:inherit;font-weight:600;font-size:14px;color:var(--ink,#fff);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.14)}.npcc-tabs button[aria-selected="true"]{background:#E9B949;border-color:#E9B949;color:#1a1026}'+
      '.npcc-chips{display:flex;gap:6px;overflow-x:auto;padding-bottom:6px;scrollbar-width:none}.npcc-chips::-webkit-scrollbar{display:none}.npcc-chips button{flex:0 0 auto;padding:7px 12px;border-radius:999px;font:inherit;font-size:13px;font-weight:600;color:var(--ink,#fff);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.18)}.npcc-chips button.on{border-color:#ED93B1;background:rgba(237,147,177,.18)}'+
      '.npcc-it{border-radius:16px;padding:12px 14px;margin:0 0 10px;background:rgba(16,13,28,.62);border:1px solid rgba(255,255,255,.12)}.npcc-it.new{border-color:#E9B949;box-shadow:0 0 12px rgba(233,185,73,.18)}'+
      '.npcc-it .top{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}.npcc-it h4{margin:0;font-size:15px}.npcc-it p{margin:3px 0 0;font-size:13px;opacity:.85}.npcc-it .dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#E9B949;margin-right:6px}'+
      '.npcc-it .acts{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.npcc-it .acts a,.npcc-it .acts button{padding:7px 12px;border-radius:999px;font:inherit;font-size:13px;font-weight:600;text-decoration:none;color:var(--ink,#fff);background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.2)}.npcc-it .acts .pri{background:#E9B949;border-color:#E9B949;color:#1a1026}'+
      '.npcc-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.npcc-grid button{text-align:left;padding:14px;border-radius:16px;font:inherit;color:var(--ink,#fff);background:rgba(16,13,28,.62);border:1px solid rgba(255,255,255,.12);cursor:pointer}.npcc-grid b{display:block;font-size:15px}.npcc-grid small{display:block;opacity:.75;margin-top:4px;font-size:12px}.npcc-grid .n{color:#E9B949;font-weight:700}'+
      '.npcc-kpi{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0 0 12px}.npcc-kpi div{padding:10px;border-radius:14px;background:rgba(255,255,255,.05);text-align:center}.npcc-kpi b{display:block;font-size:20px;color:#E9B949}.npcc-kpi small{font-size:11px;opacity:.8}';
    document.head.appendChild(s);
  }
  var BELL='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/></svg>';
  function bell(){
    var b=document.getElementById("npBell");
    if(!b){b=document.createElement("button");b.id="npBell";b.type="button";b.innerHTML=BELL+'<b hidden></b>';b.onclick=openCC;document.body.appendChild(b)}
    b.classList.toggle("show",isAdm);b.setAttribute("aria-label","Control Center, "+unseen+" new bookings");
    var n=b.querySelector("b");n.hidden=!unseen;n.textContent=unseen>99?"99+":unseen;
  }

  /* ---------- Control Center ---------- */
  var tab="inbox";
  function openCC(){if(!isAdm)return;open=true;
    panel.innerHTML='<div class="pbody" id="npCC"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><h2 id="sheetTitle" style="font-size:20px">Control Center</h2><button class="theme" id="ccX" aria-label="Close">'+X()+'</button></div>'+
      '<div class="npcc-tabs" role="tablist"><button role="tab" data-t="inbox">Inbox'+(unseen?' ('+unseen+')':'')+'</button><button role="tab" data-t="dash">All dashboards</button><button role="tab" data-t="alerts">Alerts</button></div><div id="ccBody"></div></div>';
    sheet.classList.add("open");document.body.style.overflow="hidden";panel.scrollTop=0;
    panel.querySelector("#ccX").onclick=function(){open=false;closeSheet()};
    panel.querySelectorAll("[data-t]").forEach(function(b){b.onclick=function(){tab=b.dataset.t;draw()}});
    if(!loaded)load().then(draw);draw();
  }
  window.npControlCenter=openCC;
  function draw(){
    var box=panel.querySelector("#ccBody");if(!box)return;
    panel.querySelectorAll("[data-t]").forEach(function(b){b.setAttribute("aria-selected",b.dataset.t===tab)});
    var ib=panel.querySelector('[data-t="inbox"]');if(ib)ib.textContent="Inbox"+(unseen?" ("+unseen+")":"");
    if(tab==="inbox")drawInbox(box);else if(tab==="dash")drawDash(box);else drawAlerts(box);
  }
  function drawInbox(box){
    if(!loaded){box.innerHTML='<p class="small">Loading…</p>';return}
    var today=ymd(new Date());
    var F={new:["New",function(x){return !x.seen&&x.status!=="cancelled"}],today:["Tonight / today",function(x){return x.night===today}],up:["Upcoming",function(x){return x.night>=today&&x.status!=="cancelled"}],
      adv:["Awaiting advance",function(x){return x.advPct&&!x.advPaid&&x.status!=="cancelled"}],food:["Restaurant orders",function(x){return x.t==="o"||!!x.order}],guest:["Guests (no account)",function(x){return !!x.guest}],all:["All (60 days)",function(){return true}]};
    var tn=items.filter(function(x){return x.night===today&&x.status!=="cancelled"});
    var l=items.filter(F[filter][1]).filter(function(x){if(!q)return true;var t=[x.code,x.name,x.phone,x.vname,x.cat,x.pkg].join(" ").toLowerCase();return t.indexOf(q.toLowerCase())>-1});
    box.innerHTML='<div class="npcc-kpi"><div><b>'+unseen+'</b><small>New</small></div><div><b>'+tn.length+'</b><small>Today</small></div><div><b>'+M(tn.reduce(function(s,x){return s+x.total},0))+'</b><small>Today value</small></div></div>'+
      '<div class="npcc-chips">'+Object.keys(F).map(function(k){return '<button data-f="'+k+'" class="'+(k===filter?'on':'')+'">'+F[k][0]+'</button>'}).join("")+'</div>'+
      '<div class="fields" style="margin:6px 0 10px"><label class="full">Search<input id="ccQ" type="search" value="'+esc(q)+'" placeholder="Name, phone, code, venue"></label></div>'+
      (unseen&&filter==="new"?'<button class="cta ghost" id="ccAll" style="margin:0 0 10px">Mark all as handled</button>':'')+
      (l.length?l.map(card).join(""):'<p class="small">'+(filter==="new"?"All caught up. No new bookings. 🎉":"Nothing here.")+'</p>');
    box.querySelectorAll("[data-f]").forEach(function(b){b.onclick=function(){filter=b.dataset.f;draw()}});
    box.querySelector("#ccQ").oninput=function(){q=this.value;var p=this.selectionStart;drawInbox(box);var i=box.querySelector("#ccQ");i.focus();try{i.setSelectionRange(p,p)}catch(e){}};
    if(box.querySelector("#ccAll"))box.querySelector("#ccAll").onclick=async function(){this.disabled=true;
      var bs=items.filter(function(x){return !x.seen}),bi=bs.filter(function(x){return x.t==="b"}).map(function(x){return x.id}),oi=bs.map(function(x){return x.t==="o"?x.id:(x.order&&x.order.id)}).filter(Boolean);
      if(bi.length)await sb.from("np_bookings").update({admin_seen:true}).in("id",bi);if(oi.length)await sb.from("np_orders").update({admin_seen:true}).in("id",oi);
      await load();draw()};
    box.querySelectorAll("[data-k]").forEach(function(c){var x=items.find(function(i){return (i.code||i.id)+""===c.dataset.k});if(!x)return;
      c.querySelectorAll("[data-a]").forEach(function(b){b.onclick=function(){act(x,b.dataset.a,b)}})});
  }
  function card(x){
    var st=x.ostatus||x.status,wa=String(x.phone||"").replace(/\D/g,""),food=x.t==="o"||!!x.order;
    var type=x.order_type==="delivery"?"🛵 Delivery":x.order_type==="takeaway"?"🥡 Takeaway":food?"🍽 Dine-in":x.venue==="vip"?"🎁 Package":"🎟 Booking";
    return '<div class="npcc-it'+(x.seen?'':' new')+'" data-k="'+esc(x.code||x.id)+'"><div class="top"><div style="min-width:0"><h4>'+(x.seen?'':'<span class="dot"></span>')+esc(x.name||"Guest")+(x.guests?' · '+x.guests+' pax':'')+'</h4>'+
      '<p>'+type+' · <b>'+esc(x.vname)+'</b>'+(x.cat?' · '+esc(x.cat):'')+'</p>'+
      '<p>📅 '+(x.night?new Date(x.night+"T12:00").toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"}):"")+(x.time?' · '+esc(x.time):'')+(x.total?' · '+M(x.total):'')+'</p>'+
      (x.pkg?'<p>📦 '+esc(x.pkg)+'</p>':'')+(x.address?'<p>🏠 '+esc(x.address)+'</p>':'')+
      (x.advPct?'<p><span class="npadv-chip'+(x.advPaid?' paid':'')+'">'+(x.advPaid?'Advance paid ฿'+Math.round(x.advAmt||0).toLocaleString("en-US"):'Advance '+x.advPct+'% NOT paid · ฿'+Math.round(x.advAmt||0).toLocaleString("en-US"))+'</span></p>':'')+
      '<p class="small">'+esc(x.code||"")+(x.ref?' · agent '+esc(x.ref):'')+(x.guest?' · no account':'')+'</p></div><span class="status">'+esc(ST[st]||st||"")+'</span></div>'+
      '<div class="acts">'+(x.phone?'<a href="tel:'+esc(x.phone)+'">Call</a>'+(wa?'<a href="https://wa.me/'+wa+'" target="_blank" rel="noopener">WhatsApp</a>':''):'')+
      (!x.seen?'<button class="pri" data-a="seen">Handled ✓</button>':'<button data-a="unseen">Mark new</button>')+
      (x.t==="b"&&st==="pending"?'<button data-a="confirm">Confirm</button>':'')+
      (st!=="cancelled"&&st!=="completed"&&st!=="done"?'<button data-a="cancel">Cancel</button>':'')+
      (food?'<button data-a="rest">Restaurant dashboard</button>':(x.venue!=="vip"?'<button data-a="club">Open dashboard</button>':''))+'</div></div>';
  }
  async function act(x,a,b){
    b.disabled=true;var r=null;
    function both(patch,opatch){var p=[];if(x.t==="b")p.push(sb.from("np_bookings").update(patch).eq("id",x.id));var oid=x.t==="o"?x.id:(x.order&&x.order.id);if(oid)p.push(sb.from("np_orders").update(opatch||patch).eq("id",oid));return Promise.all(p)}
    if(a==="seen")r=await both({admin_seen:true});
    else if(a==="unseen")r=await both({admin_seen:false});
    else if(a==="confirm")r=await both({status:"confirmed",admin_seen:true},{status:"confirmed",admin_seen:true});
    else if(a==="cancel"){if(!confirm("Cancel "+(x.code||"this booking")+" for "+(x.name||"guest")+"? Please also call or WhatsApp the guest.")){b.disabled=false;return}
      r=await both({status:"cancelled",admin_seen:true},{status:"cancelled",admin_seen:true})}
    else if(a==="rest"){location.href="restaurant.html";return}
    else if(a==="club"){open=false;closeSheet();if(typeof go==="function")go("dash");setTimeout(function(){var dv=document.getElementById("dVenue");if(dv&&[].some.call(dv.options,function(o){return o.value===x.venue})){dv.value=x.venue;try{dTab="res"}catch(e){}if(typeof renderDash==="function")renderDash()}},300);return}
    var err=(r||[]).find&&(r||[]).find(function(y){return y&&y.error});if(err){alert(err.error.message);b.disabled=false;return}
    await load();draw();
  }
  async function cnt(q){try{var r=await q;return r.error?null:(r.count||0)}catch(e){return null}}
  async function drawDash(box){
    box.innerHTML='<p class="small">Loading…</p>';
    var w=await cnt(sb.from("np_meet_profiles").select("user_id",{count:"exact",head:true}).eq("verify_status","pending"));
    var rp=await cnt(sb.from("np_meet_reports").select("id",{count:"exact",head:true}).eq("status","open"));
    var pr=await cnt(sb.from("np_partner_requests").select("id",{count:"exact",head:true}).eq("status","pending"));
    var ag=null;try{var a=await sb.rpc("np_list_agents");if(!a.error)ag=(a.data||[]).filter(function(x){return x.status==="pending"}).length}catch(e){}
    function n(v,t){return v==null?'<small>'+t+'</small>':'<small><span class="n">'+v+'</span> '+t+'</small>'}
    var L=[["inbox","📥 Booking inbox",n(unseen,"new bookings")],["club","🎉 Club dashboard","<small>Reservations, CRM, reports</small>"],["rest","🍛 Restaurant dashboard","<small>Orders, deliveries, staff</small>"],
      ["partners","🏪 Partner sign-ups",n(pr,"waiting")],["women","✅ Verify women",n(w,"selfies waiting")],["reports","🚩 Meet reports",n(rp,"open reports")],
      ["agents","🤝 Agents",n(ag,"waiting for approval")],["analytics","📊 App analytics","<small>Visitors and bookings funnel</small>"],["users","👥 All users","<small>Supabase (opens browser)</small>"],["alerts","🔔 Alerts","<small>Telegram and phone alerts</small>"]];
    box.innerHTML='<div class="npcc-grid">'+L.map(function(x){return '<button data-d="'+x[0]+'"><b>'+x[1]+'</b>'+x[2]+'</button>'}).join("")+'</div>';
    box.querySelectorAll("[data-d]").forEach(function(b){b.onclick=function(){var d=b.dataset.d;
      if(d==="inbox"||d==="alerts"){tab=d;draw();return}
      if(d==="club"){open=false;closeSheet();if(typeof go==="function")go("dash");return}
      if(d==="rest"||d==="partners"){location.href="restaurant.html";return}
      if(d==="women"||d==="reports"){if(window.npMeetAdmin)window.npMeetAdmin();return}
      if(d==="agents"){if(window.npAgentsAdmin)window.npAgentsAdmin();return}
      if(d==="analytics"){if(window.npReport)window.npReport();return}
      if(d==="users")window.open("https://supabase.com/dashboard/project/mymtgbmcjbwsnetzwgoy/auth/users","_blank");
    }});
  }
  async function drawAlerts(box){
    var ready=false;try{var r=await sb.rpc("np_alert_ready");ready=!r.error&&r.data===true}catch(e){}
    var perm=("Notification" in window)?Notification.permission:"unsupported";
    box.innerHTML='<div class="lcard"><h4>📱 Phone notifications</h4><p class="small">Sound + a phone notification for every new booking while the app is open (also in the background).</p>'+
      '<p class="small">Status: <b>'+(perm==="granted"?"On ✅":perm==="denied"?"Blocked. Allow notifications for this site in Chrome settings.":perm==="unsupported"?"Not supported on this browser":"Off")+'</b></p>'+
      (perm==="default"?'<button class="cta" id="alPh">Turn on phone notifications</button>':'')+'<button class="cta ghost" id="alBeep">Test sound</button></div>'+
      '<div class="lcard" style="margin-top:12px"><h4>✈️ Telegram alerts '+(ready?'<span class="status">On ✅</span>':'')+'</h4><p class="small">Get a Telegram message for every booking, even when the app is closed. Free.</p>'+
      '<p class="small"><b>Setup (5 min):</b><br>1. In Telegram, open <b>@BotFather</b> → send <b>/newbot</b> → give it a name → copy the <b>token</b>.<br>2. Open your new bot and send it <b>hi</b>.<br>3. Open this link in Chrome (put your token in place of TOKEN):<br><span class="notranslate" translate="no">api.telegram.org/botTOKEN/getUpdates</span><br>Copy the number after <b>"chat":{"id":</b></p>'+
      '<div class="fields"><label class="full">Bot token<input id="alT" placeholder="123456:ABC-..." autocomplete="off"></label><label class="full">Chat id<input id="alC" inputmode="numeric" placeholder="e.g. 987654321"></label></div>'+
      '<button class="cta" id="alSave">Save</button>'+(ready?'<button class="cta ghost" id="alTest">Send test message</button>':'')+'<p class="err" id="alM" role="status"></p></div>';
    var ph=box.querySelector("#alPh");if(ph)ph.onclick=function(){Notification.requestPermission().then(function(){drawAlerts(box);notify("🔔 Notifications are on","You will see new bookings here.")})};
    box.querySelector("#alBeep").onclick=beep;
    box.querySelector("#alSave").onclick=async function(){var m=box.querySelector("#alM"),t=box.querySelector("#alT").value.trim(),c=box.querySelector("#alC").value.trim();m.style.color="";
      if(!/^\d+:[\w-]{20,}$/.test(t)){m.textContent="That doesn't look like a bot token. It looks like 123456:ABC…";return}
      if(!/^-?\d{4,}$/.test(c)){m.textContent="The chat id is a number, like 987654321.";return}
      this.disabled=true;var r=await sb.rpc("np_set_alert_settings",{p_token:t,p_chat:c});this.disabled=false;
      if(r.error){m.textContent=/function|does not exist/i.test(r.error.message)?"Please run np-inbox.sql in Supabase first.":r.error.message;return}
      await sb.rpc("np_test_alert");m.style.color="var(--ok)";m.textContent="Saved. A test message was sent to your Telegram.";setTimeout(function(){drawAlerts(box)},1500)};
    var te=box.querySelector("#alTest");if(te)te.onclick=async function(){var r=await sb.rpc("np_test_alert");var m=box.querySelector("#alM");m.style.color=r.error?"":"var(--ok)";m.textContent=r.error?r.error.message:"Test message sent. Check Telegram."};
  }

  /* ---------- Control Center button in the account menu ---------- */
  new MutationObserver(function(){
    if(!isAdm)return;var adm=panel.querySelector(".lcard.adm");
    if(adm&&!adm.querySelector("#npCCBtn")){var b=document.createElement("button");b.id="npCCBtn";b.className="cta";b.style.margin="8px 0";b.textContent="Control Center"+(unseen?" · "+unseen+" new":"");b.onclick=openCC;
      var h=adm.querySelector("h4");if(h)h.insertAdjacentElement("beforebegin",b);else adm.insertBefore(b,adm.firstChild)}
  }).observe(panel,{childList:true,subtree:true});
  new MutationObserver(function(){if(open&&!sheet.classList.contains("open"))open=false}).observe(sheet,{attributes:true,attributeFilter:["class"]});

  async function onUser(u){
    var same=(u&&u.id)===(user&&user.id);user=u;if(same)return;
    isAdm=false;if(chan){sb.removeChannel(chan);chan=null}
    if(u){try{var a=await sb.rpc("np_is_admin");isAdm=!a.error&&a.data===true}catch(e){}}
    bell();if(isAdm){await load();subscribe();bell()}
  }
  sb.auth.getSession().then(function(r){onUser(r.data.session?r.data.session.user:null)});
  sb.auth.onAuthStateChange(function(e,s){onUser(s?s.user:null)});
  document.addEventListener("visibilitychange",function(){if(!document.hidden&&isAdm)load().then(function(){if(open)draw()})});
})();

/* ===== "Tonight" ticker at the top of Home: real venues from the app, and every name opens that venue ===== */
(function(){
  if(typeof CLUBS==="undefined")return;
  var SVC=["grocery","indian","restaurants","hotels","spa","tours","water","golf","yacht","rental","airport","shopping","events","medical","concierge"];
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  if(!document.getElementById("npTickCss")){var st=document.createElement("style");st.id="npTickCss";
    st.textContent='.ticker .track .nptk{background:none;border:0;padding:4px 2px;margin:0;font:inherit;color:inherit;cursor:pointer;white-space:nowrap}.ticker .track .nptk b{color:var(--ink,#fff);font-weight:600;text-decoration:underline;text-decoration-color:rgba(237,147,177,.6);text-underline-offset:3px}'+
      '.ticker:active .track,.ticker:focus-within .track{animation-play-state:paused}';document.head.appendChild(st)}
  function pick(){
    var L=CLUBS.filter(function(c){return c&&c.id!=="np-test-restaurant"&&c.name});
    var night=L.filter(function(c){return SVC.indexOf(c.cat)<0}).slice(0,6);
    var food=L.filter(function(c){return c.cat==="indian"||c.cat==="restaurants"}).slice(0,2);
    var fun=L.filter(function(c){return c.cat==="yacht"||c.cat==="tours"}).slice(0,1);
    return night.concat(food,fun);
  }
  function line(c){var open=String(c.open||"").split(/\s[—–-]\s|–/)[0].trim();
    return (/\d/.test(open)?"from "+open:(c.music||c.sub||c.area||"tap to book"))+(c.area&&/\d/.test(open)?" · "+c.area:"")}
  function fill(){
    var tt=document.getElementById("tickTrack");if(!tt||tt.dataset.np==="1")return;
    var v=pick();if(!v.length)return;
    var h=v.map(function(c){return '<button type="button" class="nptk" data-tk="'+esc(c.id)+'"><b>'+esc(c.name)+'</b> · '+esc(line(c))+'</button>'}).join("");
    tt.innerHTML=h+h;tt.dataset.np="1";
  }
  document.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("#tickTrack [data-tk]");if(!b)return;
    e.preventDefault();e.stopPropagation();
    var c=CLUBS.find(function(x){return x.id===b.dataset.tk});if(!c)return;
    try{if(window.npTrack)window.npTrack("place_view",c.id)}catch(x){}
    if(typeof openClub==="function")openClub(c);
  },true);
  fill();
  var tt=document.getElementById("tickTrack");
  if(tt)new MutationObserver(function(){if(tt.dataset.np!=="1"||!tt.querySelector("[data-tk]")){tt.dataset.np="";fill()}}).observe(tt,{childList:true});
  window.addEventListener("load",function(){var t=document.getElementById("tickTrack");if(t&&!t.querySelector("[data-tk]")){t.dataset.np="";fill()}});
})();

/* ===== Currency by country: phone in Thailand = baht (฿), phone in India = rupees (₹).
   Uses the phone's time zone (no location permission needed). If the person taps the ₹/฿ button
   themselves, their choice is kept until they travel to the other country. ===== */
(function(){
  var btn=document.getElementById("curBtn");if(!btn)return;
  function country(){
    var tz="";try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||""}catch(e){}
    if(/^Asia\/(Bangkok)$/.test(tz))return "TH";
    if(/^Asia\/(Kolkata|Calcutta)$/.test(tz))return "IN";
    return "";
  }
  function curNow(){try{return (0,eval)("typeof cur!=='undefined'?cur:''")}catch(e){return ""}}
  var auto=false;
  btn.addEventListener("click",function(){
    if(auto)return;
    try{localStorage.setItem("np_cur_manual",country()||"?")}catch(e){}
  },true);
  function apply(){
    var c=country();if(!c)return;
    var manual="";try{manual=localStorage.getItem("np_cur_manual")||""}catch(e){}
    if(manual&&manual===c)return;            /* they chose themselves in this country */
    if(manual&&manual!==c){try{localStorage.removeItem("np_cur_manual")}catch(e){}}
    var want=c==="TH"?"THB":"INR";
    if(curNow()&&curNow()!==want){auto=true;try{btn.click()}finally{auto=false}}
  }
  apply();
  window.addEventListener("load",function(){setTimeout(apply,300)});
  document.addEventListener("visibilitychange",function(){if(!document.hidden)apply()});
})();

/* ===== VIP Beach Clubs right after the night clubs: own row on Home (after the club rows),
   and in the full list they now come straight after the night clubs instead of at the bottom ===== */
(function(){
  if(typeof CLUBS==="undefined")return;
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function beach(){return CLUBS.filter(function(c){return c&&c.cat==="beach"})}
  /* 1. order: beach clubs directly after the last night club */
  function reorder(){
    var b=beach();if(!b.length)return false;
    var rest=CLUBS.filter(function(c){return !(c&&c.cat==="beach")}),last=-1;
    rest.forEach(function(c,i){if(c&&c.cat==="nightlife")last=i});
    if(last<0)return false;
    var want=rest.slice(0,last+1).concat(b,rest.slice(last+1));
    if(want.every(function(c,i){return CLUBS[i]===c}))return false;
    Array.prototype.splice.apply(CLUBS,[0,CLUBS.length].concat(want));
    try{if(typeof renderGrid==="function")renderGrid()}catch(e){}
    return true;
  }
  /* 2. Home row "VIP Beach Clubs" after the club rows */
  function row(){
    var after=document.getElementById("afterRail")||document.getElementById("indRail");if(!after)return;
    var list=beach();var r=document.getElementById("npBeachRail");
    if(!list.length){if(r){r.remove();var h=document.getElementById("npBeachHead");if(h)h.remove()}return}
    if(!r){
      var head=document.createElement("div");head.className="lrow";head.id="npBeachHead";head.style.margin="0 0 10px";
      head.innerHTML='<h2 class="sectiontitle" style="font-size:20px;margin:0">VIP Beach Clubs · sunset to late</h2><span class="off30">Daybeds &amp; cabanas</span>';
      r=document.createElement("div");r.className="rail";r.id="npBeachRail";
      after.insertAdjacentElement("afterend",head);head.insertAdjacentElement("afterend",r);
    }
    var key=list.map(function(c){return c.id}).join(",")+"|"+(typeof cur!=="undefined"?cur:"");
    if(r.dataset.k===key)return;r.dataset.k=key;r.innerHTML="";
    list.forEach(function(c){
      var paid=(c.pkgs||[]).map(function(p){return p.p}).filter(Boolean),from=paid.length?Math.min.apply(null,paid):0;
      var b=document.createElement("button");b.className="rcard";b.type="button";
      b.innerHTML='<div class="art" style="'+(typeof artStyle==="function"?artStyle(c):"")+'"><span class="live">Beach club</span><span class="name"></span></div>'+
        '<div class="meta"><div class="row"><span class="mu"></span></div><div class="row"><span class="hr"></span><span class="from">'+(from&&typeof money==="function"?"from "+money(from):"Book")+'</span></div></div>';
      b.querySelector(".name").textContent=c.name;b.querySelector(".mu").textContent=c.music||c.sub||"Beach club";
      b.querySelector(".hr").textContent=/\d/.test(c.open||"")?c.open:(c.area||"Pattaya");
      b.onclick=function(){try{if(window.npTrack)window.npTrack("place_view",c.id)}catch(e){}if(typeof openClub==="function")openClub(c)};
      r.appendChild(b);
    });
  }
  function run(){try{reorder()}catch(e){}try{row()}catch(e){}}
  run();window.addEventListener("load",run);setTimeout(run,1500);setTimeout(run,4000);
  var btn=document.getElementById("curBtn");if(btn)btn.addEventListener("click",function(){setTimeout(row,50)});
})();

/* ===== Booking form: clear help when no spot is chosen yet (the "Choose your spot" list is above, off screen) ===== */
(function(){
  if(typeof panel==="undefined")return;
  if(!document.getElementById("npSpotCss")){var s=document.createElement("style");s.id="npSpotCss";
    s.textContent='#npSpotHint{display:flex;gap:10px;align-items:center;justify-content:space-between;margin:0 0 10px;padding:12px 14px;border-radius:14px;background:rgba(233,185,73,.14);border:1px solid rgba(233,185,73,.6);font-size:14px;line-height:1.35}'+
      '#npSpotHint button{flex:0 0 auto;padding:9px 14px;border-radius:999px;border:0;font:inherit;font-weight:700;background:#E9B949;color:#1a1026;cursor:pointer}'+
      '#pkgs.npflash{outline:2px solid #E9B949;outline-offset:6px;border-radius:14px;transition:outline-color .3s}';document.head.appendChild(s)}
  function sync(){
    var book=panel.querySelector("#book"),pk=panel.querySelector("#pkgs");if(!book||!pk)return;
    var chosen=!!pk.querySelector('.pkg[aria-pressed="true"]'),h=panel.querySelector("#npSpotHint");
    if(chosen||!book.disabled){if(h)h.remove();return}
    if(!h){h=document.createElement("div");h.id="npSpotHint";h.setAttribute("role","note");
      h.innerHTML='<span>👆 First tap a <b>spot</b> (table, entry or package) in <b>"Choose your spot"</b> above.</span><button type="button">Show spots</button>';
      book.insertAdjacentElement("beforebegin",h);
      h.querySelector("button").onclick=function(){var t=panel.querySelector("#pkgs");if(!t)return;var hd=t.previousElementSibling||t;
        hd.scrollIntoView({behavior:"smooth",block:"start"});t.classList.add("npflash");setTimeout(function(){t.classList.remove("npflash")},2200)}}
  }
  var busy=false;
  new MutationObserver(function(){if(busy)return;busy=true;requestAnimationFrame(function(){busy=false;sync()})})
    .observe(panel,{childList:true,subtree:true,attributes:true,attributeFilter:["disabled","aria-pressed"]});
})();

/* ===== Advance to reserve (each venue sets %) + no cancellation after the advance is paid (1 Oct 2026)
   Online payment is not live yet: bookings that need an advance are saved as "Awaiting advance" (not reserved). ===== */
(function(){
  if(!window.supabase||typeof panel==="undefined")return;
  var sb=window.supabase.createClient("https://mymtgbmcjbwsnetzwgoy.supabase.co","sb_publishable_ViFodxG8kAENr78Fyp-BwQ_iA_BfAD0");
  var ADV={},MINE={},user=null,PAYSOON="Online payment is launching soon. Until the advance is paid, this booking is a request and your table is not reserved. We will let you know as soon as you can pay in the app.";
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function B(n){return "฿"+Math.round(Number(n)||0).toLocaleString("en-US")}
  function pctOf(id){return ADV[id]||0}
  function venueInPanel(){var t=panel.querySelector("#sheetTitle");if(!t||typeof CLUBS==="undefined")return null;var n=t.textContent.trim();return CLUBS.find(function(c){return c.name===n})||null}
  if(!document.getElementById("npAdvCss")){var s=document.createElement("style");s.id="npAdvCss";
    s.textContent='#npAdv{margin:0 0 10px;padding:12px 14px;border-radius:14px;background:rgba(237,147,177,.12);border:1px solid rgba(237,147,177,.55);font-size:14px;line-height:1.4}#npAdv b{color:#fff}#npAdv label{display:flex;gap:8px;align-items:flex-start;margin-top:8px}#npAdv input{width:20px;height:20px;flex:0 0 auto;margin-top:1px}'+
      '.npadv-t{display:block;grid-column:1/-1;margin-top:6px;font-size:13px;padding:8px 10px;border-radius:10px;background:rgba(237,147,177,.12);border:1px solid rgba(237,147,177,.4)}.npadv-t.paid{background:rgba(47,191,98,.14);border-color:rgba(47,191,98,.5)}.npadv-t button{margin-top:6px;padding:7px 12px;border-radius:999px;border:0;font:inherit;font-weight:700;background:#E9B949;color:#1a1026}'+
      '.npadv-chip{display:inline-block;margin:4px 6px 0 0;padding:2px 8px;border-radius:999px;font-size:12px;font-weight:700;background:rgba(237,147,177,.18);color:#ED93B1}.npadv-chip.paid{background:rgba(47,191,98,.18);color:#7BE3A0}';document.head.appendChild(s)}

  async function loadSettings(){try{var r=await sb.from("np_venue_settings").select("venue_id,advance_pct");if(!r.error)(r.data||[]).forEach(function(x){ADV[x.venue_id]=x.advance_pct||0})}catch(e){}}

  /* ---------- booking form ---------- */
  function formBox(){
    var book=panel.querySelector("#book"),c=venueInPanel(),box=panel.querySelector("#npAdv");
    if(!book||!c){if(box&&!book)box.remove();return}
    var p=pctOf(c.id);if(!p){if(box)box.remove();return}
    var tot=(panel.querySelector("#tot")||{}).textContent||"",sym=(tot.match(/[฿₹]/)||["฿"])[0],num=parseFloat(tot.replace(/[^0-9.]/g,""))||0;
    var amt=num?sym+Math.round(num*p/100).toLocaleString(sym==="₹"?"en-IN":"en-US"):"";
    var html='💳 <b>Advance needed to reserve: '+p+'%'+(amt?' = '+amt:' of the total')+'</b><br><span class="small">Pay online in the app (launching soon). Until it is paid your booking is a request, not a reservation.</span>'+
      '<label><input type="checkbox" id="npAdvOk"'+(box&&box.querySelector("#npAdvOk")&&box.querySelector("#npAdvOk").checked?" checked":"")+'> <span>I understand: <b>no cancellation or refund after the advance is paid.</b></span></label><p class="err" id="npAdvE" role="status" style="margin:6px 0 0"></p>';
    if(!box){box=document.createElement("div");box.id="npAdv";var h=panel.querySelector("#npSpotHint");(h||book).insertAdjacentElement("beforebegin",box)}
    if(box.dataset.k!==p+"|"+amt){box.dataset.k=p+"|"+amt;box.innerHTML=html}
  }
  panel.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("#book");if(!b)return;
    var box=panel.querySelector("#npAdv");if(!box)return;
    if(!box.querySelector("#npAdvOk").checked){e.preventDefault();e.stopImmediatePropagation();box.querySelector("#npAdvE").textContent="Please tick the box to accept the advance and no-cancellation rule.";box.scrollIntoView({behavior:"smooth",block:"center"})}
    else{var c=venueInPanel();window.__npLastAdv=c?{club:c.id,pct:pctOf(c.id)}:null}
  },true);
  function doneNote(){
    var d=panel.querySelector(".done .code");if(!d||panel.querySelector("#npAdvDone")||!window.__npLastAdv||!window.__npLastAdv.pct)return;
    var n=document.createElement("div");n.id="npAdvDone";n.className="npadv-t";n.style.margin="12px 0";
    n.innerHTML='⏳ <b>Awaiting advance ('+window.__npLastAdv.pct+'%).</b> '+esc(PAYSOON);
    d.closest(".done").appendChild(n);
  }

  /* ---------- My bookings ---------- */
  async function loadMine(){
    MINE={};if(!user)return;
    try{var r=await sb.from("np_bookings").select("code,advance_pct,advance_amount,advance_paid,status").eq("customer_id",user.id);(r.data||[]).forEach(function(x){MINE[x.code]=x})}catch(e){}
  }
  function tickets(){
    if(typeof bookings==="undefined")return;
    document.querySelectorAll("#bookingList .ticket").forEach(function(t){
      var code=((t.querySelector(".code")||{}).textContent||"").trim(),bk=bookings.find(function(x){return x.code===code});if(!bk)return;
      var srv=MINE[code],p=srv?srv.advance_pct:pctOf(bk.club),paid=!!(srv&&srv.advance_paid),amt=srv&&srv.advance_amount!=null?srv.advance_amount:Math.round((bk.total||0)*(p||0)/100);
      var el=t.querySelector(".npadv-t"),cancel=t.querySelector(".cancel");
      if(!p&&!paid){if(el)el.remove();return}
      var key=(paid?"p":"u")+amt;if(el&&el.dataset.k===key)return;if(el)el.remove();
      el=document.createElement("div");el.className="npadv-t"+(paid?" paid":"");el.dataset.k=key;
      el.innerHTML=paid?'✅ <b>Advance paid ('+B(amt)+').</b> Your table is reserved. This booking cannot be cancelled.':
        '⏳ <b>Awaiting advance: '+p+'% = '+B(amt)+'.</b> Not reserved yet.<br><button type="button">Pay advance</button>';
      var body=t.querySelector(".tbody")||t;body.appendChild(el);
      var pb=el.querySelector("button");if(pb)pb.onclick=function(){alert(PAYSOON)};
      if(cancel)cancel.style.display=paid?"none":"";
    });
  }
  document.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("#bookingList .cancel");if(!b)return;
    var t=b.closest(".ticket"),code=((t&&t.querySelector(".code"))||{}).textContent;code=(code||"").trim();
    if(MINE[code]&&MINE[code].advance_paid){e.preventDefault();e.stopImmediatePropagation();alert("This booking cannot be cancelled because the advance is paid.")}
  },true);
  if(typeof renderBookings==="function"){var _rb=renderBookings;renderBookings=function(){_rb();try{tickets()}catch(e){}}}

  /* ---------- club dashboard: advance setting + status on each reservation ---------- */
  var RS={},CAN={};
  async function dash(){
    var view=document.getElementById("dview"),dv=document.getElementById("dVenue");
    if(!view||!dv||typeof dTab==="undefined"||dTab!=="res"||!user)return;
    var v=dv.value,can=CAN[v];if(can===undefined){can=false;try{var r=await sb.rpc("np_can_manage",{p_venue:v});can=!r.error&&r.data===true}catch(e){}CAN[v]=can}
    if(can&&!view.querySelector("#npAdvSet")){
      var c=document.createElement("div");c.className="lcard";c.id="npAdvSet";c.style.marginBottom="12px";
      c.innerHTML='<div class="lrow"><div><h4>Advance to reserve</h4><p class="small">Guests must pay this % online before the table is reserved. No cancellation after it is paid.</p></div>'+
        '<select id="npAdvPct" aria-label="Advance percent">'+[0,10,20,25,30,40,50,60,70,80,90,100].map(function(x){return '<option value="'+x+'">'+(x?x+"%":"No advance")+'</option>'}).join("")+'</select></div><p class="small" id="npAdvMsg"></p>';
      view.insertBefore(c,view.firstChild);c.querySelector("#npAdvPct").value=String(pctOf(v));
      c.querySelector("#npAdvPct").onchange=async function(){var n=parseInt(this.value,10),m=c.querySelector("#npAdvMsg");
        var x=await sb.rpc("np_set_advance",{p_venue:v,p_pct:n});if(x.error){m.textContent=/function|does not exist/i.test(x.error.message)?"Please run np-advance.sql in Supabase first.":x.error.message;return}
        ADV[v]=n;m.textContent=n?"Saved. New bookings need a "+n+"% advance.":"Saved. No advance needed."}
    }
    var ids=[].map.call(view.querySelectorAll("#rsList [data-id]"),function(x){return x.dataset.id}).filter(function(id){return !(id in RS)});
    if(ids.length){var q=await sb.from("np_bookings").select("id,advance_pct,advance_amount,advance_paid").in("id",ids);(q.data||[]).forEach(function(x){RS[x.id]=x})}
    view.querySelectorAll("#rsList [data-id]").forEach(function(card){
      var x=RS[card.dataset.id];if(!x||!x.advance_pct||card.querySelector(".npadv-chip"))return;
      var chip=document.createElement("span");chip.className="npadv-chip"+(x.advance_paid?" paid":"");
      chip.textContent=x.advance_paid?"Advance paid "+B(x.advance_amount):"Advance "+x.advance_pct+"% not paid · "+B(x.advance_amount);
      var h=card.querySelector("h4")||card.firstChild;h.insertAdjacentElement("afterend",chip);
      if(!x.advance_paid&&can){var btns=card.querySelector(".rsbtns");if(btns&&!btns.querySelector("[data-advpaid]")){var b=document.createElement("button");b.className="pill";b.dataset.advpaid="1";b.textContent="Advance paid (at venue)";
        b.onclick=async function(){if(!confirm("Mark the advance as paid? After this the guest cannot cancel."))return;var u=await sb.from("np_bookings").update({advance_paid:true}).eq("id",card.dataset.id);if(u.error){alert(u.error.message);return}delete RS[card.dataset.id];renderDash()};btns.appendChild(b)}}
    });
  }
  if(typeof renderDash==="function"){var _rd=renderDash;renderDash=function(){_rd();RS={};setTimeout(dash,350)}}

  var busy=false;
  new MutationObserver(function(){if(busy)return;busy=true;requestAnimationFrame(function(){busy=false;try{formBox();doneNote()}catch(e){}})})
    .observe(panel,{childList:true,subtree:true,characterData:true});
  var bl=document.getElementById("bookingList");
  if(bl)new MutationObserver(function(){try{tickets()}catch(e){}}).observe(bl,{childList:true});
  var rsBusy=false,rsT=null;
  new MutationObserver(function(){var l=document.getElementById("rsList");if(!l||rsBusy||!l.querySelector("[data-id]"))return;
    clearTimeout(rsT);rsT=setTimeout(function(){rsBusy=true;dash().finally(function(){setTimeout(function(){rsBusy=false},50)})},150)})
    .observe(document.body,{childList:true,subtree:true});

  /* hide the admin bell while a sheet is open (it was covering buttons) */
  var sh=document.querySelector(".sheet");
  if(sh)new MutationObserver(function(){var b=document.getElementById("npBell");if(b)b.style.visibility=sh.classList.contains("open")?"hidden":""}).observe(sh,{attributes:true,attributeFilter:["class"]});

  async function onUser(u){user=u;CAN={};await loadMine();tickets()}
  loadSettings().then(function(){formBox();tickets()});
  sb.auth.getSession().then(function(r){onUser(r.data.session?r.data.session.user:null)});
  sb.auth.onAuthStateChange(function(e,s){onUser(s?s.user:null)});
  window.npAdvanceSettings=ADV;
})();

/* ===== no-flash: Home is arranged, show the page (index.html hides it for a moment while loading) ===== */
(function(){
  function show(){document.documentElement.classList.remove("np-loading")}
  requestAnimationFrame(function(){requestAnimationFrame(show)});
  setTimeout(show,800);
})();

/* ===== Card backgrounds (1 Oct 2026): soft artwork on the right side of 10 Home cards.
   Drawn with code (no photos), sits behind the text, nothing else changes. ===== */
(function(){
  if(document.getElementById("npArtCss"))return;
  function svg(vb,body){return 'url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+vb+'" preserveAspectRatio="xMaxYMid slice">'+body+'</svg>')+'")'}
  function glow(id,c,o){return '<radialGradient id="'+id+'"><stop offset="0" stop-color="'+c+'" stop-opacity="'+o+'"/><stop offset="1" stop-color="'+c+'" stop-opacity="0"/></radialGradient>'}
  var ART={
    raju:svg("0 0 380 330",'<defs>'+glow("a","#7F77DD",".45")+glow("b","#1D9E75",".22")+'</defs><circle cx="70" cy="70" r="90" fill="url(#a)"/><circle cx="340" cy="300" r="90" fill="url(#b)"/>'+
      '<g fill="#AFA9EC" fill-opacity=".1"><rect x="0" y="306" width="380" height="24"/><rect x="18" y="282" width="16" height="48"/><rect x="38" y="272" width="22" height="58"/><rect x="250" y="278" width="18" height="52"/><rect x="272" y="266" width="24" height="64"/><rect x="352" y="282" width="20" height="48"/></g>'+
      '<g fill="none" stroke="#AFA9EC" stroke-opacity=".18" stroke-width="1.2"><circle cx="200" cy="296" r="30"/><path d="M200 266 V326 M170 296 H230 M179 275 L221 317 M221 275 L179 317"/></g>'+
      '<g fill="none" stroke="#5DCAA5" stroke-opacity=".2" stroke-width="1.6"><path d="M335 330 C338 312 336 300 330 288 M330 288 C318 282 308 284 300 292 M330 288 C340 278 352 278 360 284 M330 288 C326 276 318 270 308 270"/></g>'+
      '<g fill="#fff" opacity=".3"><circle cx="150" cy="16" r="1.2"/><circle cx="30" cy="190" r="1"/><circle cx="365" cy="200" r="1.2"/></g>'),
    lang:svg("0 0 140 170",'<defs>'+glow("a","#7F77DD",".35")+'</defs><circle cx="125" cy="150" r="60" fill="url(#a)"/><g fill="#CECBF6" font-family="sans-serif"><text x="74" y="22" font-size="13" opacity=".12">नमस्ते</text><text x="92" y="42" font-size="11" opacity=".1">สวัสดี</text><text x="76" y="162" font-size="11" opacity=".1">வணக்கம்</text></g>'),
    conv:svg("0 0 230 170",'<defs>'+glow("a","#1D9E75",".35")+'</defs><circle cx="200" cy="150" r="80" fill="url(#a)"/><text x="150" y="150" font-size="90" font-family="sans-serif" fill="#9FE1CB" opacity=".08">฿</text><text x="185" y="95" font-size="70" font-family="sans-serif" fill="#FAC775" opacity=".08">₹</text><path d="M120 160 C160 120 190 150 235 105" fill="none" stroke="#5DCAA5" stroke-opacity=".3" stroke-width="1.5"/>'),
    girls:svg("0 0 380 160",'<defs>'+glow("a","#ED93B1",".55")+glow("b","#AFA9EC",".45")+'</defs><circle cx="300" cy="40" r="90" fill="url(#a)"/><circle cx="350" cy="130" r="70" fill="url(#b)"/><circle cx="220" cy="140" r="50" fill="url(#a)"/>'+
      '<circle cx="270" cy="70" r="12" fill="#F4C0D1" opacity=".35"/><circle cx="330" cy="95" r="7" fill="#F4C0D1" opacity=".5"/><circle cx="245" cy="30" r="5" fill="#fff" opacity=".4"/><circle cx="360" cy="45" r="9" fill="#CECBF6" opacity=".35"/>'+
      '<path d="M150 150 C230 90 280 150 380 70" fill="none" stroke="#ED93B1" stroke-opacity=".55" stroke-width="2.5"/><path d="M170 160 C250 110 300 165 390 95" fill="none" stroke="#ED93B1" stroke-opacity=".35" stroke-width="1.2"/>'+
      '<g transform="translate(318 58)" fill="none" stroke="#F4C0D1" stroke-opacity=".55" stroke-width="1.6"><path d="M0 26 C-12 14 -12 0 0 -10 C12 0 12 14 0 26Z"/><path d="M0 26 C-20 22 -30 10 -28 -2 C-16 0 -6 10 0 26Z"/><path d="M0 26 C20 22 30 10 28 -2 C16 0 6 10 0 26Z"/></g>'),
    gold:svg("0 0 380 170",'<defs><linearGradient id="w" x1="0" x2="1"><stop offset="0" stop-color="#FAC775" stop-opacity="0"/><stop offset=".45" stop-color="#FAC775" stop-opacity=".9"/><stop offset=".8" stop-color="#EF9F27" stop-opacity=".6"/><stop offset="1" stop-color="#BA7517" stop-opacity=".2"/></linearGradient>'+glow("g","#EF9F27",".35")+'</defs>'+
      '<circle cx="320" cy="60" r="110" fill="url(#g)"/><path d="M120 170 C200 110 250 150 390 60" fill="none" stroke="url(#w)" stroke-width="3"/><path d="M140 175 C220 125 270 165 400 80" fill="none" stroke="url(#w)" stroke-width="1.5"/><path d="M100 165 C190 100 240 130 390 35" fill="none" stroke="url(#w)" stroke-width="1"/>'+
      '<circle cx="300" cy="45" r="2.5" fill="#FAEEDA"/><circle cx="345" cy="110" r="2" fill="#FAEEDA" opacity=".8"/>'),
    packages:svg("0 0 180 150",'<defs>'+glow("a","#F0997B",".4")+'</defs><circle cx="150" cy="40" r="70" fill="url(#a)"/><g fill="none" stroke="#FAC775" stroke-opacity=".35" stroke-width="1.4"><rect x="118" y="30" width="44" height="34" rx="4"/><path d="M140 30 V64 M118 44 H162"/><path d="M140 30 C132 18 122 22 130 30 M140 30 C148 18 158 22 150 30"/></g><g fill="#FAC775" opacity=".5"><circle cx="112" cy="70" r="2"/><circle cx="170" cy="22" r="2.5"/><circle cx="155" cy="100" r="1.8"/></g>'),
    buddy:svg("0 0 180 150",'<defs>'+glow("a","#ED93B1",".38")+'</defs><circle cx="145" cy="45" r="70" fill="url(#a)"/><g stroke="#ED93B1" stroke-opacity=".35" stroke-width="1.2"><path d="M110 30 L150 50 L130 85 L165 95 M150 50 L172 28 M130 85 L105 70"/></g><g fill="#ED93B1" fill-opacity=".55"><circle cx="110" cy="30" r="5"/><circle cx="150" cy="50" r="7"/><circle cx="130" cy="85" r="6"/><circle cx="165" cy="95" r="4.5"/><circle cx="172" cy="28" r="4"/></g>'),
    mall:svg("0 0 180 150",'<defs>'+glow("a","#F0997B",".4")+'</defs><circle cx="150" cy="50" r="70" fill="url(#a)"/><g fill="none" stroke="#F5C4B3" stroke-opacity=".4" stroke-width="1.4"><path d="M118 40 H150 L154 80 H114 Z"/><path d="M126 40 C126 28 142 28 142 40"/><path d="M148 58 H172 L175 92 H145 Z"/><path d="M154 58 C154 48 166 48 166 58"/></g>'),
    paybill:svg("0 0 180 150",'<defs>'+glow("a","#1D9E75",".4")+'</defs><circle cx="150" cy="50" r="70" fill="url(#a)"/><g fill="none" stroke="#9FE1CB" stroke-opacity=".38" stroke-width="1.3"><path d="M120 20 H160 V78 L154 73 L148 78 L142 73 L136 78 L130 73 L124 78 L120 74 Z"/><path d="M128 34 H152 M128 44 H152 M128 54 H144"/><path d="M140 20 V78" stroke-dasharray="3 3"/></g><g fill="none" stroke="#5DCAA5" stroke-opacity=".5" stroke-width="1.8"><circle cx="158" cy="104" r="11"/><path d="M152 104 L156 108 L164 99"/></g>'),
    dash:svg("0 0 180 150",'<defs>'+glow("a","#378ADD",".38")+'</defs><circle cx="150" cy="60" r="70" fill="url(#a)"/><g fill="#85B7EB" fill-opacity=".25"><rect x="112" y="80" width="12" height="30" rx="2"/><rect x="130" y="64" width="12" height="46" rx="2"/><rect x="148" y="48" width="12" height="62" rx="2"/><rect x="166" y="30" width="12" height="80" rx="2"/></g><path d="M108 76 L128 60 L146 64 L170 26" fill="none" stroke="#B5D4F4" stroke-opacity=".6" stroke-width="1.8"/><circle cx="170" cy="26" r="3.5" fill="#B5D4F4" fill-opacity=".8"/>')
  };
  ART.welcome=svg("0 0 360 170",'<defs>'+glow("a","#ED93B1",".5")+glow("b","#7F77DD",".55")+'</defs><circle cx="300" cy="40" r="90" fill="url(#a)"/><circle cx="60" cy="150" r="90" fill="url(#b)"/>'+
    '<g fill="#F4C0D1" fill-opacity=".4"><circle cx="270" cy="70" r="14"/><circle cx="305" cy="62" r="17"/><circle cx="340" cy="72" r="13"/></g><g fill="#F4C0D1" fill-opacity=".28"><path d="M250 112 C252 90 288 90 290 112Z"/><path d="M283 112 C285 86 325 86 327 112Z"/><path d="M322 112 C324 92 356 92 358 112Z"/></g>'+
    '<g opacity=".7"><rect x="230" y="20" width="5" height="10" fill="#FAC775" transform="rotate(30 232 25)"/><rect x="350" y="120" width="5" height="10" fill="#5DCAA5" transform="rotate(-25 352 125)"/><circle cx="330" cy="20" r="3" fill="#FAC775"/><circle cx="245" cy="55" r="2.5" fill="#5DCAA5"/></g>');
  ART.me=svg("0 0 360 190",'<defs>'+glow("a","#7F77DD",".45")+'</defs><circle cx="320" cy="50" r="90" fill="url(#a)"/><g fill="none" stroke="#CECBF6" stroke-opacity=".22" stroke-width="1.3"><circle cx="320" cy="50" r="28"/><circle cx="320" cy="50" r="46"/><circle cx="320" cy="50" r="64" stroke-dasharray="3 6"/></g><g fill="#CECBF6" opacity=".5"><circle cx="276" cy="20" r="2"/><circle cx="352" cy="100" r="2.2"/></g>');
  ART.admin=svg("0 0 360 110",'<defs>'+glow("a","#EF9F27",".35")+'</defs><circle cx="320" cy="55" r="80" fill="url(#a)"/><g fill="none" stroke="#FAC775" stroke-opacity=".4" stroke-width="1.6"><path d="M318 18 L346 28 V52 C346 72 334 84 318 92 C302 84 290 72 290 52 V28 Z"/><path d="M305 54 L315 64 L333 44"/></g>');
  ART.person=svg("0 0 360 150",'<defs>'+glow("a","#ED93B1",".35")+'</defs><circle cx="330" cy="30" r="80" fill="url(#a)"/><path d="M320 30 C320 22 332 22 332 30 C332 22 344 22 344 30 C344 40 332 46 332 50 C332 46 320 40 320 30Z" fill="#ED93B1" fill-opacity=".35"/><g fill="#F4C0D1" opacity=".5"><circle cx="300" cy="18" r="2"/><circle cx="352" cy="62" r="1.8"/></g>');
  ART.rules=svg("0 0 360 170",'<defs>'+glow("a","#7F77DD",".4")+'</defs><circle cx="320" cy="40" r="90" fill="url(#a)"/><g fill="none" stroke="#CECBF6" stroke-opacity=".22" stroke-width="1.5"><path d="M320 14 L350 25 V50 C350 72 337 86 320 94 C303 86 290 72 290 50 V25 Z"/><path d="M320 46 C320 40 329 40 329 46 C329 52 320 57 320 60 C320 57 311 52 311 46 C311 40 320 40 320 46Z"/></g>');
  ART.ticket=svg("0 0 360 130",'<defs>'+glow("a","#F0997B",".38")+'</defs><circle cx="330" cy="100" r="90" fill="url(#a)"/>');
  ART.earn=svg("0 0 360 120",'<defs>'+glow("a","#1D9E75",".4")+'</defs><circle cx="320" cy="50" r="80" fill="url(#a)"/><g fill="none" stroke="#9FE1CB" stroke-opacity=".4" stroke-width="1.4"><ellipse cx="320" cy="88" rx="22" ry="6"/><path d="M298 88 V80 M342 88 V80"/><ellipse cx="320" cy="80" rx="22" ry="6"/><path d="M298 80 V72 M342 80 V72"/><ellipse cx="320" cy="72" rx="22" ry="6"/></g><path d="M276 60 L296 44 L312 50 L346 18 M338 18 H346 V26" fill="none" stroke="#5DCAA5" stroke-opacity=".55" stroke-width="1.8"/>');
  ART.chat=svg("0 0 360 80",'<defs>'+glow("a","#ED93B1",".35")+'</defs><circle cx="330" cy="40" r="60" fill="url(#a)"/><g fill="none" stroke="#F4C0D1" stroke-opacity=".3" stroke-width="1.3"><rect x="300" y="14" width="40" height="22" rx="11"/><rect x="318" y="42" width="34" height="18" rx="9"/></g>');
  ART.lounge=svg("0 0 360 120",'<defs>'+glow("a","#ED93B1",".45")+'</defs><circle cx="310" cy="40" r="80" fill="url(#a)"/><circle cx="290" cy="70" r="8" fill="#F4C0D1" opacity=".3"/><g transform="translate(322 50)" fill="none" stroke="#F4C0D1" stroke-opacity=".45" stroke-width="1.5"><path d="M0 22 C-10 12 -10 0 0 -8 C10 0 10 12 0 22Z"/><path d="M0 22 C-17 18 -25 8 -23 -2 C-13 0 -5 8 0 22Z"/><path d="M0 22 C17 18 25 8 23 -2 C13 0 5 8 0 22Z"/></g>');
  ART.kpi=svg("0 0 100 70",'<circle cx="85" cy="15" r="32" fill="#EF9F27" opacity=".14"/>');
  ART.inbox=svg("0 0 360 110",'<defs>'+glow("a","#EF9F27",".28")+'</defs><circle cx="330" cy="30" r="70" fill="url(#a)"/><g fill="none" stroke="#FAC775" stroke-opacity=".3" stroke-width="1.5" transform="translate(0 56)"><path d="M316 22 a14 14 0 0 1 28 0 c0 16 6 20 6 20 h-40 s6 -4 6 -20"/><path d="M326 48 a4 4 0 0 0 8 0"/></g>');
  ART.dkpi=svg("0 0 100 70",'<circle cx="85" cy="15" r="32" fill="#378ADD" opacity=".18"/>');
  ART.dcard=svg("0 0 360 100",'<defs>'+glow("a","#378ADD",".32")+'</defs><circle cx="320" cy="50" r="70" fill="url(#a)"/><g fill="#85B7EB" fill-opacity=".22"><rect x="290" y="60" width="9" height="26" rx="2"/><rect x="304" y="48" width="9" height="38" rx="2"/><rect x="318" y="36" width="9" height="50" rx="2"/><rect x="332" y="24" width="9" height="62" rx="2"/></g>');
  ART.sky=svg("0 0 360 70",'<defs>'+glow("a","#378ADD",".35")+'</defs><circle cx="300" cy="35" r="70" fill="url(#a)"/><circle cx="292" cy="30" r="10" fill="#FAC775" fill-opacity=".35"/><path d="M296 44 h34 a9 9 0 0 0 -3 -17 a12 12 0 0 0 -22 2 a8 8 0 0 0 -9 15z" fill="#B5D4F4" fill-opacity=".22"/>');
  ART.qa=svg("0 0 100 80",'<circle cx="90" cy="10" r="40" fill="#F0997B" opacity=".16"/>');
  ART.cat=svg("0 0 100 100",'<circle cx="92" cy="8" r="46" fill="#F0997B" opacity=".14"/><circle cx="10" cy="98" r="30" fill="#7F77DD" opacity=".1"/>');
  ART.catpink=svg("0 0 100 100",'<circle cx="92" cy="8" r="46" fill="#ED93B1" opacity=".2"/>');
  ART.rmeta=svg("0 0 360 100",'<defs>'+glow("a","#F0997B",".3")+'</defs><circle cx="330" cy="80" r="80" fill="url(#a)"/>');
  ART.dform=svg("0 0 360 120",'<defs>'+glow("a","#378ADD",".32")+'</defs><circle cx="330" cy="30" r="80" fill="url(#a)"/>');
  ART.refer=svg("0 0 380 160",'<defs>'+glow("a","#1D9E75",".5")+glow("b","#EF9F27",".3")+'</defs><circle cx="300" cy="40" r="90" fill="url(#a)"/><circle cx="350" cy="130" r="60" fill="url(#b)"/>'+
    '<g fill="none" stroke="#9FE1CB" stroke-opacity=".45" stroke-width="1.5"><ellipse cx="320" cy="112" rx="26" ry="7"/><path d="M294 112 V102 M346 112 V102"/><ellipse cx="320" cy="102" rx="26" ry="7"/><path d="M294 102 V92 M346 102 V92"/><ellipse cx="320" cy="92" rx="26" ry="7"/></g>'+
    '<path d="M240 120 C270 100 285 80 300 70 S340 40 360 30" fill="none" stroke="#5DCAA5" stroke-opacity=".55" stroke-width="2"/><path d="M350 28 H362 V40" fill="none" stroke="#5DCAA5" stroke-opacity=".55" stroke-width="2"/>'+
    '<g fill="#FAC775" opacity=".6"><circle cx="262" cy="42" r="2.5"/><circle cx="370" cy="80" r="2"/></g>');
  ART.ref=svg("0 0 360 90",'<defs>'+glow("a","#1D9E75",".35")+'</defs><circle cx="330" cy="45" r="70" fill="url(#a)"/>');
  ART.sheetbg=svg("0 0 360 1600",'<defs>'+glow("a","#F0997B",".22")+glow("b","#7F77DD",".25")+glow("c","#ED93B1",".2")+glow("d","#EF9F27",".18")+'</defs>'+
    '<circle cx="330" cy="160" r="170" fill="url(#a)"/><circle cx="20" cy="620" r="190" fill="url(#b)"/><circle cx="350" cy="1020" r="180" fill="url(#c)"/><circle cx="40" cy="1420" r="180" fill="url(#d)"/>');
  ART.pkg=svg("0 0 360 200",'<defs>'+glow("a","#F0997B",".28")+'</defs><circle cx="345" cy="10" r="90" fill="url(#a)"/>');
  ART.deal=svg("0 0 360 200",'<defs>'+glow("a","#EF9F27",".3")+'</defs><circle cx="340" cy="35" r="70" fill="url(#a)"/><g fill="#FAC775" opacity=".6"><circle cx="300" cy="18" r="2"/><circle cx="330" cy="52" r="1.6"/></g>');
  ART.addon=svg("0 0 360 200",'<defs>'+glow("a","#ED93B1",".28")+'</defs><circle cx="345" cy="10" r="75" fill="url(#a)"/><path d="M326 20 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#F4C0D1" opacity=".55"/>');
  ART.totalbg=svg("0 0 360 200",'<defs>'+glow("a","#1D9E75",".26")+'</defs><circle cx="20" cy="80" r="80" fill="url(#a)"/>');
  var MAP=[["#rajuCard","raju"],["#panel:has(#pkgs) .pbody","sheetbg"],["#panel .pkg","pkg",'rgba(240,153,123,.35)'],["#panel .deal","deal"],["#panel .addon","addon",'rgba(237,147,177,.35)'],["#panel .total","totalbg"],[".npstrip","sky",'rgba(133,183,235,.4)'],["#npHomeFill [data-qa]","qa",'rgba(240,153,123,.4)'],["#cats .cat:not(#npFLBcat)","cat",'rgba(240,153,123,.35)'],["#npFLBcat","catpink",'rgba(237,147,177,.45)'],
    [".rcard","rmeta"],["#grid .club","rmeta",'rgba(240,153,123,.35)'],[".npreftile","refer"],["#dview .partner","dform",'rgba(133,183,235,.45)'],["#dview .tblw","dform",'rgba(133,183,235,.4)'],
    ["#panel:has(#umAcc) .lcard","me",'rgba(175,169,236,.5)'],["#panel .refcode","ref",'rgba(93,202,165,.6)'],["#panel:has(#ppDash) .lcard","dform",'rgba(133,183,235,.5)'],["#npmDeck .npm-empty-card","welcome"],["#npMeet > .npm-card.hl","me"],["#npMeet > .npm-card:not(.hl)","admin",'rgba(239,159,39,.55)'],
    ["#npmList .npm-card","person",'rgba(237,147,177,.45)'],["#npLList .npm-card","person",'rgba(237,147,177,.45)'],["#npPurpose","rules",'rgba(175,169,236,.5)'],
    ["#bookingList .ticket","ticket",'rgba(240,153,123,.5)'],["#npAgEarn","earn",'rgba(93,202,165,.55)'],["#ibL .npm-card","chat",'rgba(237,147,177,.45)'],
    ["#lview .lcard","lounge",'rgba(237,147,177,.5)'],[".npcc-kpi > div","kpi"],[".npcc-it","inbox"],["#dview .kpi","dkpi",'rgba(133,183,235,.45)'],["#dview .lcard","dcard",'rgba(133,183,235,.45)'],["#npxLang","lang"],[".npx-tools","conv"],[".hubtile.ladies","girls"],[".goldarea","gold"],
    ['.hubtile[data-go="packages"]',"packages",'rgba(240,153,123,.45)'],['.hubtile[data-go="buddy"]',"buddy",'rgba(237,147,177,.45)'],
    ['.hubtile[data-go="mall"]',"mall",'rgba(240,153,123,.45)'],['.hubtile[data-go="paybill"]',"paybill",'rgba(93,202,165,.45)'],['.hubtile[data-go="dash"]',"dash",'rgba(133,183,235,.5)']];
  var css='#bookingList .ticket.npart::before,.rcard.npart::before,#grid .club.npart::before{top:auto;height:55%}.npart{isolation:isolate}.npart::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:-1;background-repeat:no-repeat;background-size:100% 100%}';
  css+='.goldarea.npart::before{bottom:auto;height:170px;border-bottom-left-radius:0;border-bottom-right-radius:0;-webkit-mask-image:linear-gradient(#000 60%,transparent);mask-image:linear-gradient(#000 60%,transparent)}';
  css+='#panel .pbody.npart::before{background-size:100% auto;background-position:center top}#panel .pkg[aria-pressed="true"].npart{box-shadow:0 0 28px -8px #F0997B}';
  var FIXED=["pkg","deal","addon","totalbg","refer","welcome","me","admin","person","rules","ticket","earn","chat","lounge","inbox","dcard","dform","sky","ref"];
  MAP.forEach(function(m){css+=m[0]+'.npart::before{background-image:'+ART[m[1]]+(FIXED.indexOf(m[1])>-1?';background-size:360px auto;background-position:right top':'')+'}';if(m[2])css+=m[0]+'.npart{border-color:'+m[2]+'}'});
  var st=document.createElement("style");st.id="npArtCss";st.textContent=css;document.head.appendChild(st);
  function tag(){MAP.forEach(function(m){var list;try{list=document.querySelectorAll(m[0])}catch(e){return}list.forEach(function(el){
    if(el.classList.contains("npart"))return;
    if(getComputedStyle(el).position==="static")el.style.position="relative";
    el.classList.add("npart")})})}
  tag();window.addEventListener("load",tag);setTimeout(tag,1500);
  var busy=false;new MutationObserver(function(){if(busy)return;busy=true;requestAnimationFrame(function(){busy=false;tag()})}).observe(document.body,{childList:true,subtree:true});
})();

/* ===== Clearer photos: lighter dark layer on photos (index.html), names keep a soft shadow so they stay readable ===== */
(function(){if(document.getElementById("npPhotoCss"))return;var s=document.createElement("style");s.id="npPhotoCss";
  s.textContent='.art .name,.art h2.name{text-shadow:0 2px 14px rgba(0,0,0,.7),0 1px 3px rgba(0,0,0,.6)!important}.art{image-rendering:auto}';document.head.appendChild(s)})();

/* ===== Home: "Refer & earn" card above Empowered Girls (same size), and a compact Namaste Gold card ===== */
(function(){
  if(!document.getElementById("npRefCss")){var st=document.createElement("style");st.id="npRefCss";
    st.textContent='.npreftile{width:100%;background:linear-gradient(135deg,rgba(29,158,117,.32),rgba(8,20,16,.92) 60%);border:1.5px solid rgba(93,202,165,.6);box-shadow:0 0 40px -12px #1D9E75;cursor:pointer}'+
      '.npreftile>span{background:linear-gradient(135deg,#1D9E75,#5DCAA5);border:0;color:#fff}.npreftile b{font-size:17px}'+
      '.npreftile .nprates{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.npreftile .nprates{flex-wrap:nowrap}.npreftile .nprates i{white-space:nowrap;font-style:normal;font-size:11.5px;font-weight:700;padding:3px 8px;border-radius:999px;background:rgba(93,202,165,.18);border:1px solid rgba(93,202,165,.5);color:#C9F2E2}'+
      '.goldarea.npcompact{padding-top:14px;padding-bottom:14px}.goldarea.npcompact>*:not(.gtop):not(.gcta):not(.npgtog){display:none!important}.goldarea.npcompact .gtop{margin-bottom:10px}'+
      '.npgtog{display:block;width:100%;margin:0 0 10px;padding:8px;border:0;background:none;font:inherit;font-size:13px;font-weight:600;color:#E9D8A6;cursor:pointer;text-decoration:underline;text-underline-offset:3px}';
    document.head.appendChild(st)}
  function build(){
    var lt=document.querySelector(".hubtile.ladies");
    if(lt&&!document.getElementById("npRefTile")){
      var holder=lt.closest(".homeblk")||lt.parentNode;
      var w=document.createElement("div");w.className="homeblk";w.id="npRefWrap";w.style.marginBottom="12px";
      w.innerHTML='<button type="button" class="hubtile npreftile" id="npRefTile"><span>'+(typeof ico==="function"?ico("gift"):"")+'</span><b>Refer &amp; earn</b><small>Earn on every booking made with your code</small>'+
        '<div class="nprates"><i>Travellers 3%</i><i>Agents 5%</i><i>Promoters 5%</i></div></button>';
      holder.parentNode.insertBefore(w,holder);
      w.querySelector("button").onclick=function(){try{if(window.npTrack)window.npTrack("service_open","refer_earn")}catch(e){}if(typeof go==="function")go("earn")};
    }
    var g=document.querySelector(".goldarea");
    if(g&&!g.dataset.npc){g.dataset.npc="1";g.classList.add("npcompact");
      var t=document.createElement("button");t.type="button";t.className="npgtog";t.textContent="See all Gold benefits ▾";
      var cta=g.querySelector(".gcta");if(cta)cta.insertAdjacentElement("beforebegin",t);else g.appendChild(t);
      t.onclick=function(){var c=g.classList.toggle("npcompact");t.textContent=c?"See all Gold benefits ▾":"Show less ▴"}}
  }
  build();window.addEventListener("load",build);setTimeout(build,1500);
})();

/* ===== Map (1 Oct 2026): dark live map with photo pins, search, filters and "my location".
   Works offline: the map library and every map area you have looked at are saved on the phone;
   with no saved map it falls back to the simple Pattaya map. Pins show the venue's area. ===== */
(function(){
  var sec=document.getElementById("map");if(!sec||typeof CLUBS==="undefined")return;
  var LIBJS="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js",LIBCSS="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
  var TILES="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",ATTR='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
  var TCACHE="np-map-tiles-v1",LCACHE="np-map-lib-v1",MAXT=900;
  var AREA={"Naklua":[12.9645,100.8915],"North Pattaya":[12.9505,100.8875],"Pattaya Central":[12.9360,100.8830],"Central Pattaya":[12.9360,100.8830],"Soi Buakhao":[12.9330,100.8935],
    "Walking Street":[12.9272,100.8718],"Bali Hai Pier":[12.9215,100.8690],"Pratumnak":[12.9150,100.8660],"Jomtien":[12.8865,100.8705],"Koh Larn":[12.9200,100.7820],
    "East Pattaya":[12.9330,100.9150],"Thepprasit":[12.9105,100.8880],"U-Tapao Airport":[12.6800,101.0050],"Suvarnabhumi / U-Tapao":[12.9450,100.9300],"Pattaya":[12.9310,100.8820]};
  var CHIPS=[["all","All"],["book","⚡ Book now"],["night","Night clubs",["nightlife"]],["beach","Beach clubs",["beach"]],["food","Indian food",["indian","restaurants","grocery"]],
    ["hotel","Hotels",["hotels"]],["spa","Spa",["spa"]],["sea","Tours & sea",["tours","water","yacht","golf"]]];
  var chip="all",q="",map=null,layer=null,me=null,LF=null,built=false;
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function hash(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}
  function ll(c){if(c.lat&&c.lng)return [c.lat,c.lng];var a=AREA[c.area]||AREA.Pattaya,h=hash(c.id||c.name);return [a[0]+((h%41)-20)*0.00012,a[1]+(((h>>6)%41)-20)*0.00012]}
  function photo(c){var p=null;try{p=(store.get("np_photos_"+c.id,[])||[])[0]}catch(e){}return p||c.photo||null}
  function bookable(c){return (c.pkgs||[]).some(function(p){return p.p>0})}
  function colour(c){var k=c.cat;return /nightlife|beach|events/.test(k)?"#ED93B1":/indian|restaurants|grocery/.test(k)?"#F0997B":/hotels/.test(k)?"#378ADD":/spa/.test(k)?"#AFA9EC":"#5DCAA5"}
  function list(){var ch=CHIPS.find(function(x){return x[0]===chip}),t=q.trim().toLowerCase();
    return CLUBS.filter(function(c){if(!c||c.id==="np-test-restaurant")return false;
      if(chip==="book"&&!bookable(c))return false;if(ch&&ch[2]&&ch[2].indexOf(c.cat)<0)return false;
      return !t||[c.name,c.area,c.music,c.sub,c.type,(c.tags||[]).join(" "),(typeof CATNAME!=="undefined"?CATNAME[c.cat]:"")].join(" ").toLowerCase().indexOf(t)>-1})}

  /* ---------- styles + layout ---------- */
  if(!document.getElementById("npMapCss")){var st=document.createElement("style");st.id="npMapCss";
    st.textContent='#npMapWrap{position:relative;height:calc(100dvh - 210px);min-height:440px;border-radius:24px;overflow:hidden;border:1px solid rgba(255,255,255,.12);background:#0e0e12;margin:0 0 12px}'+
      '#npMapEl{position:absolute;inset:0;background:#0e0e12}#npMapEl .leaflet-control-attribution{background:rgba(0,0,0,.55);color:#aaa;font-size:9px}#npMapEl .leaflet-control-attribution a{color:#ccc}'+
      '.npmtop{position:absolute;left:10px;right:10px;top:10px;z-index:500;display:flex;flex-direction:column;gap:8px;pointer-events:none}.npmtop>*{pointer-events:auto}'+
      '.npmsearch{display:flex;align-items:center;gap:8px;padding:0 14px;height:48px;border-radius:999px;background:rgba(10,10,14,.92);border:1px solid rgba(255,255,255,.14);box-shadow:0 6px 20px rgba(0,0,0,.4)}'+
      '.npmsearch input{flex:1;min-width:0;border:0;background:none;color:#fff;font:inherit;font-size:15px;outline:none}.npmsearch button{border:0;background:none;color:#B4B2A9;font:inherit;font-size:14px}'+
      '.npmchips{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none}.npmchips::-webkit-scrollbar{display:none}.npmchips button{flex:0 0 auto;padding:9px 14px;border-radius:999px;font:inherit;font-size:13.5px;font-weight:600;color:#fff;background:rgba(10,10,14,.92);border:1px solid rgba(255,255,255,.16)}'+
      '.npmchips button.on{background:#fff;color:#111;border-color:#fff}'+
      '.npmloc{position:absolute;right:12px;bottom:16px;z-index:500;width:50px;height:50px;border-radius:50%;border:1px solid rgba(255,255,255,.2);background:rgba(10,10,14,.92);color:#fff;font-size:22px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(0,0,0,.45)}'+
      '.npmbadge{position:absolute;left:12px;bottom:18px;z-index:500;padding:7px 12px;border-radius:999px;background:rgba(10,10,14,.92);border:1px solid rgba(255,255,255,.16);color:#D3D1C7;font-size:12px}'+
      '.npmpin{display:flex;align-items:center;gap:6px;white-space:nowrap}.npmpin .ph{position:relative;width:46px;height:46px;border-radius:12px;border:2px solid rgba(255,255,255,.85);background:#222 center/cover;box-shadow:0 4px 14px rgba(0,0,0,.6)}'+
      '.npmpin .ph i{position:absolute;top:-8px;right:-8px;width:20px;height:20px;border-radius:50%;background:#EF9F27;color:#1a1026;font-style:normal;font-size:11px;display:flex;align-items:center;justify-content:center;border:2px solid #111}'+
      '.npmpin b{font-size:12.5px;font-weight:600;color:#fff;text-shadow:0 1px 4px #000,0 0 2px #000}.npmzoomout .npmpin b{display:none}.npmpin.sel .ph{border-color:#EF9F27;transform:scale(1.15)}'+
      '.npmdot{width:14px;height:14px;border-radius:50%;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.6)}.npmdot.sel{transform:scale(1.5)}'+
      '.npmme{width:18px;height:18px;border-radius:50%;background:#3d8bfd;border:3px solid #fff;box-shadow:0 0 0 8px rgba(61,139,253,.25)}'+
      '#npMapCard{position:absolute;left:10px;right:70px;bottom:12px;z-index:600}#npMapCard .club{margin:0}#npMapCard .x{position:absolute;top:-10px;right:-10px;z-index:2;width:30px;height:30px;border-radius:50%;border:1px solid rgba(255,255,255,.3);background:#111;color:#fff}'+
      '#npMapFallback{position:absolute;inset:0;overflow:auto;padding:110px 10px 10px;background:#0e0e12}#npMapFallback svg{width:100%;height:auto}';
    document.head.appendChild(st)}
  function build(){
    if(built)return;built=true;
    [].forEach.call(sec.children,function(ch){if(!/sectiontitle/.test(ch.className))ch.style.display="none"});
    var w=document.createElement("div");w.id="npMapWrap";
    w.innerHTML='<div id="npMapEl" role="application" aria-label="Map of Pattaya venues"></div>'+
      '<div class="npmtop"><div class="npmsearch"><span aria-hidden="true">🔍</span><input id="npmQ" type="search" placeholder="Search venue, area, music, vibe..." aria-label="Search the map"><button id="npmClr" type="button">Clear</button></div>'+
      '<div class="npmchips" role="tablist">'+CHIPS.map(function(c){return '<button type="button" data-c="'+c[0]+'"'+(c[0]===chip?' class="on"':'')+'>'+esc(c[1])+'</button>'}).join("")+'</div></div>'+
      '<button class="npmloc" id="npmLoc" type="button" aria-label="Show my location">◎</button><div class="npmbadge" id="npmBadge" hidden></div><div id="npMapCard"></div>';
    var t=sec.querySelector(".sectiontitle");if(t)t.insertAdjacentElement("afterend",w);else sec.insertBefore(w,sec.firstChild);
    w.querySelector("#npmQ").oninput=function(){q=this.value;draw()};
    w.querySelector("#npmClr").onclick=function(){q="";w.querySelector("#npmQ").value="";chip="all";chips();draw()};
    w.querySelectorAll("[data-c]").forEach(function(b){b.onclick=function(){chip=b.dataset.c;chips();draw();fit()}});
    w.querySelector("#npmLoc").onclick=locate;
    start();
  }
  function chips(){document.querySelectorAll("#npMapWrap [data-c]").forEach(function(b){b.classList.toggle("on",b.dataset.c===chip)})}
  function badge(t){var b=document.getElementById("npmBadge");if(!b)return;b.hidden=!t;b.textContent=t||""}

  /* ---------- load the map library (saved on the phone for offline use) ---------- */
  async function getText(url){
    try{var r=await fetch(url,{mode:"cors"});if(r.ok){var c=r.clone();try{(await caches.open(LCACHE)).put(url,c)}catch(e){}return await r.text()}}catch(e){}
    try{var m=await (await caches.open(LCACHE)).match(url);if(m)return await m.text()}catch(e){}
    return null;
  }
  async function loadLib(){
    if(window.L&&window.L.map)return true;
    var css=await getText(LIBCSS),js=await getText(LIBJS);if(!js)return false;
    if(css){var s=document.createElement("style");s.textContent=css;document.head.appendChild(s)}
    try{var sc=document.createElement("script");sc.text=js;document.head.appendChild(sc)}catch(e){return false}
    return !!(window.L&&window.L.map);
  }

  /* ---------- tiles: from the internet, saved for offline; offline uses the saved ones ---------- */
  function tileLayer(){
    var TL=L.TileLayer.extend({createTile:function(coords,done){
      var img=document.createElement("img");img.alt="";img.setAttribute("role","presentation");
      var url=this.getTileUrl(coords);
      (async function(){
        var cache=null;try{cache=await caches.open(TCACHE)}catch(e){}
        async function fromCache(){if(!cache)return null;var m=await cache.match(url);return m?URL.createObjectURL(await m.blob()):null}
        var src=null;
        if(navigator.onLine!==false){try{var r=await fetch(url,{mode:"cors"});if(r.ok){var b=await r.clone().blob();src=URL.createObjectURL(b);if(cache){cache.put(url,r);trim(cache)}}}catch(e){}}
        if(!src)src=await fromCache();
        if(!src&&navigator.onLine!==false)src=url;   /* online but the tile server blocks saving: show it normally */
        if(src){img.onload=function(){done(null,img)};img.onerror=function(){done(null,img)};img.src=src}
        else{img.src="data:image/gif;base64,R0lGODlhAQABAAAAACw=";done(null,img)}
      })();
      return img;
    }});
    return new TL(TILES,{subdomains:"abcd",maxZoom:19,minZoom:10,attribution:ATTR});
  }
  var trimT=null;function trim(cache){clearTimeout(trimT);trimT=setTimeout(async function(){try{var k=await cache.keys();for(var i=0;i<k.length-MAXT;i++)await cache.delete(k[i])}catch(e){}},4000)}

  async function start(){
    var ok=await loadLib();
    if(!ok){fallback();return}
    LF=window.L;
    map=LF.map("npMapEl",{zoomControl:false,attributionControl:true,preferCanvas:false}).setView([12.9272,100.8740],14);
    tileLayer().addTo(map);
    layer=LF.layerGroup().addTo(map);
    map.on("zoomend",function(){document.getElementById("npMapWrap").classList.toggle("npmzoomout",map.getZoom()<14)});
    map.on("click",function(){card(null)});
    draw();
    if(navigator.onLine===false)badge("Offline · showing saved map");
    setTimeout(function(){map.invalidateSize()},300);
  }
  function fit(){if(!map)return;var l=list();if(!l.length)return;var b=LF.latLngBounds(l.map(ll));map.fitBounds(b.pad(0.15),{maxZoom:16})}
  var sel=null;
  function draw(){
    if(!map){if(document.getElementById("npMapFallback"))fallbackDraw();return}
    layer.clearLayers();var l=list();
    l.forEach(function(c){
      var p=photo(c),html,size,anchor;
      if(p){html='<div class="npmpin'+(sel===c.id?' sel':'')+'"><div class="ph" style="background-image:url(\''+esc(p)+'\')">'+(bookable(c)?'<i>⚡</i>':'')+'</div><b>'+esc(c.name)+'</b></div>';size=[180,50];anchor=[23,25]}
      else{html='<div class="npmdot'+(sel===c.id?' sel':'')+'" style="background:'+colour(c)+'"></div>';size=[14,14];anchor=[7,7]}
      var m=LF.marker(ll(c),{icon:LF.divIcon({html:html,className:"",iconSize:size,iconAnchor:anchor}),title:c.name,keyboard:true,riseOnHover:true,zIndexOffset:p?500:0});
      m.on("click",function(){sel=c.id;card(c);draw()});layer.addLayer(m);
    });
    badge(l.length?(navigator.onLine===false?"Offline · ":"")+l.length+" places":"Nothing found here");
  }
  function card(c){
    var box=document.getElementById("npMapCard");if(!box)return;box.innerHTML="";if(!c){sel=null;return}
    try{mapSel=c.id;var mc=document.getElementById("mapcard");if(typeof renderMapCard==="function"){renderMapCard();if(mc&&mc.firstChild){box.appendChild(mc.firstChild)}}}catch(e){}
    if(!box.firstChild){var b=document.createElement("button");b.className="cta";b.textContent="Open "+c.name;b.onclick=function(){openClub(c)};box.appendChild(b)}
    var x=document.createElement("button");x.className="x";x.setAttribute("aria-label","Close");x.textContent="×";x.onclick=function(e){e.stopPropagation();card(null);draw()};box.appendChild(x);
  }
  function locate(){
    if(!navigator.geolocation){alert("Location is not available on this phone.");return}
    navigator.geolocation.getCurrentPosition(function(p){
      var at=[p.coords.latitude,p.coords.longitude];
      if(map){if(me)me.remove();me=LF.marker(at,{icon:LF.divIcon({html:'<div class="npmme"></div>',className:"",iconSize:[18,18],iconAnchor:[9,9]}),zIndexOffset:1000}).addTo(map);map.setView(at,16)}
      else alert("Your location: "+at[0].toFixed(4)+", "+at[1].toFixed(4));
    },function(){alert("Please allow location for this site to see where you are.")},{enableHighAccuracy:true,timeout:12000,maximumAge:60000});
  }

  /* ---------- no map library and no saved copy: simple Pattaya map (always works offline) ---------- */
  function fallback(){
    var w=document.getElementById("npMapWrap");if(!w)return;
    var f=document.createElement("div");f.id="npMapFallback";var mb=document.getElementById("mapbox");
    if(mb){mb.style.display="";f.appendChild(mb)}var mc=document.getElementById("mapcard");if(mc){mc.style.display="";f.appendChild(mc)}w.insertBefore(f,w.firstChild);
    badge("Offline · simple map");fallbackDraw();
  }
  function fallbackDraw(){try{if(typeof renderMap==="function")renderMap()}catch(e){}}

  if(typeof go==="function"){var _go=go;go=function(t){_go(t);if(t==="map"){build();if(map)setTimeout(function(){map.invalidateSize()},200)}}}
  if(!sec.hidden)build();
  window.addEventListener("online",function(){badge("");if(!map&&built){var f=document.getElementById("npMapFallback");if(f)f.remove();start()}else if(map)draw()});
  window.addEventListener("offline",function(){badge("Offline · showing saved map")});
})();

/* ===== Recent screens (1 Oct 2026): a multitasking / task switcher like the phone's Overview screen.
   Every important screen you open is kept as a card: swipe between them, tap to jump back,
   swipe a card up (or ✕) to close it, "Close all". Open it from More → Recent screens,
   or press and hold any button in the bottom menu. ===== */
(function(){
  var KEY="np_recents",MAX=14,busyOpen=false;
  var SEC={explore:["Home","me","#7F77DD","🏠"],map:["Map","services","#378ADD","🗺️"],bookings:["My bookings","me","#F0997B","🎟️"],earn:["Earn & referrals","agent","#1D9E75","💰"],
    concierge:["Raju chat","me","#7F77DD","💬"],buddy:["Meet new people","me","#ED93B1","❤️"],ladies:["Empowered Girls","me","#ED93B1","🌸"],mall:["Namaste Mall","services","#F0997B","🛍️"],
    packages:["Packages","services","#F0997B","🎁"],paybill:["Pay my bill","me","#1D9E75","🧾"],dash:["Partner dashboard","partner","#378ADD","📊"],clubs:["Clubs","services","#F0997B","🪩"]};
  var GROUPS=[["all","All"],["services","Services"],["me","My app"],["partner","Partners"],["agent","Agents"],["admin","Admin"]];
  var grp="all";
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return []}}
  function save(a){try{localStorage.setItem(KEY,JSON.stringify(a.slice(0,MAX)))}catch(e){}}
  function add(it){if(busyOpen)return;it.t=Date.now();var a=load().filter(function(x){return x.k!==it.k});a.unshift(it);save(a)}
  function ago(t){var m=Math.round((Date.now()-t)/60000);return m<1?"just now":m<60?m+" min ago":m<1440?Math.round(m/60)+" h ago":Math.round(m/1440)+" d ago"}
  function isAdmin(){var b=document.getElementById("npBell");return !!(b&&b.classList.contains("show"))}
  function isStaff(){var d=document.getElementById("dVenue");return isAdmin()||!!(d&&[].some.call(d.options,function(o){return o.value&&o.value!=="__none"})&&d.dataset.allow)}

  /* ---------- remember screens ---------- */
  function wrap(name,fn){if(typeof window[name]!=="function")return;var orig=window[name];window[name]=function(){try{fn.apply(null,arguments)}catch(e){}return orig.apply(this,arguments)}}
  if(typeof go==="function"){var _go=go;go=function(t){try{if(SEC[t])add({k:"go:"+t,ty:"sec",id:t})}catch(e){}return _go.apply(this,arguments)}}
  if(typeof openClub==="function"){var _oc=openClub;openClub=function(c){try{if(c&&c.id)add({k:"v:"+c.id,ty:"venue",id:c.id})}catch(e){}return _oc.apply(this,arguments)}}
  wrap("openService",function(cat){add({k:"s:"+cat,ty:"svc",id:cat})});
  wrap("npControlCenter",function(){add({k:"f:cc",ty:"fn",id:"npControlCenter",ti:"Control Center",g:"admin",c:"#EF9F27",e:"🔔"})});
  wrap("npMeetAdmin",function(){add({k:"f:meetadm",ty:"fn",id:"npMeetAdmin",ti:"Verify women & reports",g:"admin",c:"#EF9F27",e:"✅"})});
  wrap("npAgentsAdmin",function(){add({k:"f:agadm",ty:"fn",id:"npAgentsAdmin",ti:"Agents (admin)",g:"admin",c:"#EF9F27",e:"🤝"})});
  wrap("npOpenAgent",function(){add({k:"f:agent",ty:"fn",id:"npOpenAgent",ti:"Agent dashboard",g:"agent",c:"#1D9E75",e:"🤝"})});

  /* ---------- what a card shows ---------- */
  function info(x){
    var C=typeof CLUBS!=="undefined"?CLUBS:[];
    if(x.ty==="sec"){var s=SEC[x.id]||[x.id,"me","#7F77DD","•"];return {ti:s[0],sub:"Screen",g:s[1],c:s[2],e:s[3]}}
    if(x.ty==="venue"){var v=C.find(function(c){return c.id===x.id});if(!v)return null;var ph=null;try{ph=(store.get("np_photos_"+v.id,[])||[])[0]}catch(e){}
      return {ti:v.name,sub:[v.area,v.music||v.sub].filter(Boolean).join(" · "),g:"services",c:"#F0997B",e:"🪩",ph:ph||v.photo||null}}
    if(x.ty==="svc"){var n=(typeof CATNAME!=="undefined"&&CATNAME[x.id])||x.id;return {ti:n,sub:"Service",g:"services",c:"#F0997B",e:"✨",ph:"photos/"+x.id+".jpg"}}
    if(x.ty==="fn")return {ti:x.ti,sub:x.g==="admin"?"Admin":"Earnings",g:x.g,c:x.c,e:x.e};
    return null;
  }
  function reopen(x){
    busyOpen=true;try{
      if(x.ty==="sec"&&typeof go==="function")go(x.id);
      else if(x.ty==="venue"){var v=CLUBS.find(function(c){return c.id===x.id});if(v)openClub(v)}
      else if(x.ty==="svc"&&window.openService)window.openService(x.id);
      else if(x.ty==="fn"&&typeof window[x.id]==="function")window[x.id]();
    }finally{busyOpen=false}
    add(x);
  }
  function shortcuts(){
    var s=[["Home",function(){go("explore")},"🏠"],["Map",function(){go("map")},"🗺️"],["Bookings",function(){go("bookings")},"🎟️"],["Meet",function(){go("buddy")},"❤️"],["Raju",function(){var r=document.querySelector("#rajuFab,.rajufab,[data-raju-open]");if(r)r.click();else go("concierge")},"💬"],
      ["Earnings",function(){if(window.npOpenAgent)npOpenAgent();else go("earn")},"💰"]];
    if(isStaff())s.push(["Club dashboard",function(){go("dash")},"📊"],["Restaurant",function(){location.href="restaurant.html"},"🍛"]);
    if(isAdmin())s.push(["Control Center",function(){npControlCenter()},"🔔"]);
    return s;
  }

  /* ---------- the switcher ---------- */
  if(!document.getElementById("npRecCss")){var st=document.createElement("style");st.id="npRecCss";
    st.textContent='#npRec{position:fixed;inset:0;z-index:10050;background:rgba(8,6,16,.86);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);display:flex;flex-direction:column;color:#fff;padding:calc(14px + env(safe-area-inset-top)) 0 calc(14px + env(safe-area-inset-bottom))}'+
      '#npRec .hd{display:flex;align-items:center;justify-content:space-between;padding:0 18px}#npRec .hd b{font-size:20px}#npRec .hd button{border:0;background:rgba(255,255,255,.1);color:#fff;width:40px;height:40px;border-radius:50%;font-size:20px}'+
      '#npRec .gr{display:flex;gap:8px;overflow-x:auto;padding:12px 18px 6px;scrollbar-width:none}#npRec .gr::-webkit-scrollbar{display:none}#npRec .gr button{flex:0 0 auto;padding:8px 14px;border-radius:999px;font:inherit;font-size:13px;font-weight:600;color:#fff;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.16)}#npRec .gr button.on{background:#fff;color:#111}'+
      '#npRec .row{flex:1;display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;padding:18px 12%;align-items:center;scrollbar-width:none}#npRec .row::-webkit-scrollbar{display:none}'+
      '#npRec .cd{position:relative;flex:0 0 76%;max-width:340px;height:min(62vh,520px);scroll-snap-align:center;display:flex;flex-direction:column;transition:transform .25s,opacity .25s}'+
      '#npRec .cd .tp{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:10px;font-size:14px;font-weight:600}#npRec .cd .tp i{font-style:normal;width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px}'+
      '#npRec .cd .bd{flex:1;border-radius:24px;overflow:hidden;position:relative;border:1px solid rgba(255,255,255,.16);background:#141225;box-shadow:0 18px 40px rgba(0,0,0,.5);cursor:pointer}'+
      '#npRec .cd .ph{position:absolute;inset:0;background:center/cover no-repeat}#npRec .cd .gl{position:absolute;inset:0}#npRec .cd .tx{position:absolute;left:0;right:0;bottom:0;padding:60px 18px 18px;background:linear-gradient(180deg,transparent,rgba(0,0,0,.85))}'+
      '#npRec .cd .tx b{display:block;font-size:22px}#npRec .cd .tx small{display:block;opacity:.85;font-size:13px;margin-top:4px}#npRec .cd .big{position:absolute;top:28%;left:0;right:0;text-align:center;font-size:72px;opacity:.9}'+
      '#npRec .cd .x{position:absolute;top:34px;right:-8px;z-index:3;width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.3);background:#111;color:#fff;font-size:16px}'+
      '#npRec .cd.gone{transform:translateY(-120%);opacity:0}#npRec .emp{flex:1;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 30px;opacity:.85}'+
      '#npRec .sc{display:flex;gap:8px;overflow-x:auto;padding:4px 18px 10px;scrollbar-width:none}#npRec .sc::-webkit-scrollbar{display:none}#npRec .sc button{flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:4px;width:74px;padding:10px 4px;border-radius:16px;font:inherit;font-size:11.5px;color:#fff;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12)}#npRec .sc button span{font-size:22px}'+
      '#npRec .ca{align-self:center;margin-top:6px;padding:12px 34px;border-radius:999px;border:0;font:inherit;font-size:16px;font-weight:700;background:rgba(255,255,255,.14);color:#fff}';
    document.head.appendChild(st)}
  function open(){
    var old=document.getElementById("npRec");if(old)old.remove();
    var o=document.createElement("div");o.id="npRec";o.setAttribute("role","dialog");o.setAttribute("aria-label","Recent screens");
    document.body.appendChild(o);document.body.style.overflow="hidden";draw();
    try{if(window.npTrack)npTrack("service_open","recent_screens")}catch(e){}
  }
  function closeSw(){var o=document.getElementById("npRec");if(o)o.remove();document.body.style.overflow=""}
  window.npRecents=open;
  function draw(){
    var o=document.getElementById("npRec");if(!o)return;
    var items=load().map(function(x){var i=info(x);return i?{x:x,i:i}:null}).filter(Boolean).filter(function(r){return r.i.g!=="admin"||isAdmin()});
    var show=items.filter(function(r){return grp==="all"||r.i.g===grp});
    var gs=GROUPS.filter(function(g){return g[0]==="all"||items.some(function(r){return r.i.g===g[0]})});
    o.innerHTML='<div class="hd"><b>Recent screens</b><button type="button" id="rcX" aria-label="Close">×</button></div>'+
      '<div class="gr">'+gs.map(function(g){return '<button type="button" data-g="'+g[0]+'" class="'+(g[0]===grp?"on":"")+'">'+g[1]+'</button>'}).join("")+'</div>'+
      (show.length?'<div class="row">'+show.map(function(r,n){var i=r.i;
        return '<div class="cd" data-n="'+n+'"><div class="tp"><i style="background:'+i.c+'">'+i.e+'</i>'+esc(i.ti)+'</div><div class="bd" data-open="'+n+'">'+
          (i.ph?'<div class="ph" style="background-image:url(\''+esc(i.ph)+'\')"></div>':'<div class="gl" style="background:radial-gradient(circle at 75% 20%,'+i.c+'88,transparent 55%),radial-gradient(circle at 15% 85%,'+i.c+'44,transparent 50%),#141225"></div><div class="big">'+i.e+'</div>')+
          '<div class="tx"><b>'+esc(i.ti)+'</b><small>'+esc(i.sub||"")+' · '+ago(r.x.t)+'</small></div></div><button type="button" class="x" data-x="'+n+'" aria-label="Close '+esc(i.ti)+'">✕</button></div>'}).join("")+'</div>'
        :'<div class="emp">No recent screens yet. Open clubs, services or dashboards and they will appear here.</div>')+
      '<div class="sc" aria-label="Quick open">'+shortcuts().map(function(s,n){return '<button type="button" data-s="'+n+'"><span>'+s[2]+'</span>'+esc(s[0])+'</button>'}).join("")+'</div>'+
      (show.length?'<button type="button" class="ca" id="rcAll">Close all</button>':'');
    o.querySelector("#rcX").onclick=closeSw;
    o.querySelectorAll("[data-g]").forEach(function(b){b.onclick=function(){grp=b.dataset.g;draw()}});
    var sc=shortcuts();o.querySelectorAll("[data-s]").forEach(function(b){b.onclick=function(){closeSw();try{sc[+b.dataset.s][1]()}catch(e){}}});
    var ca=o.querySelector("#rcAll");if(ca)ca.onclick=function(){var keep=load().filter(function(x){var i=info(x);return i&&!(grp==="all"||i.g===grp)});save(keep);draw()};
    function remove(n){var r=show[n];if(!r)return;var cd=o.querySelector('.cd[data-n="'+n+'"]');if(cd)cd.classList.add("gone");
      setTimeout(function(){save(load().filter(function(x){return x.k!==r.x.k}));draw()},230)}
    o.querySelectorAll("[data-x]").forEach(function(b){b.onclick=function(e){e.stopPropagation();remove(+b.dataset.x)}});
    o.querySelectorAll("[data-open]").forEach(function(b){
      var n=+b.dataset.open,y0=null,dy=0,cd=b.parentNode;
      b.addEventListener("touchstart",function(e){y0=e.touches[0].clientY;dy=0;cd.style.transition="none"},{passive:true});
      b.addEventListener("touchmove",function(e){if(y0===null)return;dy=Math.min(0,e.touches[0].clientY-y0);cd.style.transform="translateY("+dy+"px)";cd.style.opacity=String(1+dy/400)},{passive:true});
      b.addEventListener("touchend",function(){cd.style.transition="";if(dy<-110){remove(n)}else{cd.style.transform="";cd.style.opacity=""}y0=null});
      b.onclick=function(){if(dy<-20)return;var r=show[n];closeSw();try{if(typeof closeSheet==="function")closeSheet()}catch(e){}reopen(r.x)};
    });
    var row=o.querySelector(".row");if(row)row.scrollLeft=0;
  }

  /* ---------- ways to open it ---------- */
  new MutationObserver(function(){
    var m=document.querySelector("#npMoreSheet .in");if(!m||m.querySelector("#npRecBtn"))return;
    var b=document.createElement("button");b.type="button";b.className="it";b.id="npRecBtn";
    b.innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="6" width="12" height="15" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v12"/></svg>Recent screens';
    b.onclick=function(){var s=document.getElementById("npMoreSheet");if(s)s.remove();open()};
    var h=m.querySelector("h4");if(h)h.insertAdjacentElement("afterend",b);else m.insertBefore(b,m.firstChild);
  }).observe(document.body,{childList:true});
  /* press and hold any bottom-menu button */
  var hold=null,held=false;
  document.addEventListener("touchstart",function(e){var t=e.target.closest&&e.target.closest("nav button,nav a,.tabs button,#npMoreTab");if(!t)return;held=false;clearTimeout(hold);
    hold=setTimeout(function(){held=true;try{navigator.vibrate&&navigator.vibrate(20)}catch(x){}open()},550)},{passive:true});
  ["touchend","touchmove","touchcancel"].forEach(function(n){document.addEventListener(n,function(){clearTimeout(hold)},{passive:true})});
  document.addEventListener("click",function(e){if(held&&e.target.closest&&e.target.closest("nav,.tabs")){e.preventDefault();e.stopPropagation();held=false}},true);
  document.addEventListener("keydown",function(e){if(e.key==="Escape")closeSw()});
})();

/* ===== Booking rules table above the privacy tick on every service booking page (1 Oct 2026).
   Rows depend on the type of venue; the tick now also accepts these rules. ===== */
(function(){
  if(typeof panel==="undefined")return;
  var NIGHT=["nightlife","beach","events"],FOOD=["restaurants","indian","grocery"];
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  if(!document.getElementById("npRulesCss")){var st=document.createElement("style");st.id="npRulesCss";
    st.textContent='#npRulesPop{position:fixed;inset:0;z-index:10060;background:rgba(5,4,12,.72);display:flex;align-items:center;justify-content:center;padding:12px}'+
      '#npRulesPop .bx{width:100%;max-width:520px;max-height:86vh;overflow:auto;background:#141225;border:1px solid rgba(237,147,177,.5);border-radius:22px;padding:16px 16px calc(16px + env(safe-area-inset-bottom));color:#F3EFFF}'+
      '#npRulesPop .hd{display:flex;justify-content:space-between;align-items:center}#npRulesPop .hd b{font-size:18px}#npRulesPop .x{width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.2);background:none;color:#fff;font-size:20px}'+
      '#npRulesPop .vn{margin:2px 0 8px;font-size:13px;color:#F4C0D1}#npRulesPop table{width:100%;border-collapse:collapse;font-size:13px;line-height:1.4}'+
      '#npRulesPop th{width:36%;text-align:left;vertical-align:top;font-weight:600;padding:8px 8px 8px 0;color:#F4C0D1}#npRulesPop td{vertical-align:top;padding:8px 0;color:#E6E1F5}'+
      '#npRulesPop tr+tr th,#npRulesPop tr+tr td{border-top:1px solid rgba(255,255,255,.08)}#npRulesPop h5{margin:14px 0 4px;font-size:15px}#npRulesPop .pp{margin:0;font-size:13px;line-height:1.45;color:#E6E1F5}'+
      '#npRulesPop .full{display:inline-block;margin:10px 0 14px;color:#EF9F27;font-weight:600;font-size:13px}#npRulesPop .ok{display:block;width:100%;padding:13px;border:0;border-radius:14px;background:#E9B949;color:#1a1026;font:inherit;font-weight:700;font-size:15px}'+
      '.nppdpa .nprulesv{display:inline-block;margin-top:4px;color:#E5861A;font-weight:600}';
    document.head.appendChild(st)}
  function venue(){var t=panel.querySelector("#sheetTitle");if(!t||typeof CLUBS==="undefined")return null;var n=t.textContent.trim();return CLUBS.find(function(c){return c.name===n})||null}
  function rows(c){
    var cat=c?c.cat:"",pct=0;try{pct=(window.npAdvanceSettings||{})[c&&c.id]||0}catch(e){}
    var r=[];
    if(NIGHT.indexOf(cat)>-1)r.push(["👤 Age and ID","20+ only (Thai law). Bring your passport or a copy."]);
    r.push(["💳 Payment",pct?pct+"% advance to reserve, paid online in the app. The rest is paid at the venue.":"No advance needed. You pay at the venue."]);
    r.push(["❌ Cancellation",pct?"No cancellation or refund after the advance is paid.":"You can cancel in My bookings before your visit."]);
    if(FOOD.indexOf(cat)>-1)r.push(["⏰ Time","Arrive on time. For delivery, someone must be at the address."]);
    else if(NIGHT.indexOf(cat)>-1)r.push(["⏰ Arrival","Arrive on time. Late tables may be given to other guests."]);
    else r.push(["⏰ Time","Be ready at the booked time. The provider confirms the details with you."]);
    r.push(["🧾 Bill","Prices come from the venue. Service charge and VAT may be added on the bill."]);
    if(NIGHT.indexOf(cat)>-1)r.push(["🚭 House rules","Dress code and venue rules apply. Illegal drugs are strictly not allowed (Thai law)."]);
    else r.push(["📋 Venue rules","The venue's or provider's own rules apply."]);
    r.push(["🔒 Your data","Your name and phone go only to this venue for this booking (PDPA). You can ask us to delete them."]);
    return r;
  }
  function sync(){
    if(!panel.querySelector("#pkgs"))return;
    var book=panel.querySelector("#book"),lab=panel.querySelector(".nppdpa");
    /* every service booking page gets the privacy tick (some pages were missing it) */
    if(!lab&&book){lab=document.createElement("label");lab.className="nppdpa";
      lab.innerHTML='<input type="checkbox"><span>I agree that Namaste Pattaya and this venue use my name, phone number only to handle this booking. <a href="privacy.html" target="_blank" rel="noopener">Privacy policy</a></span>';
      book.insertAdjacentElement("beforebegin",lab)}
    if(!lab)return;
    var c=venue(),key=(c?c.id:"")+"|"+((window.npAdvanceSettings||{})[c&&c.id]||0);
    if(lab.dataset.rk===key&&lab.querySelector(".nprulesv"))return;
    lab.dataset.rk=key;
    var sp=lab.querySelector("span");if(!sp)return;
    var del=/address|location/i.test(sp.textContent)||!!panel.querySelector(".npdel");
    sp.innerHTML='<b>I accept the rules of this booking</b> and the privacy policy'+(del?' (incl. my delivery address)':'')+'. <a href="#" class="nprulesv">View rules &amp; privacy policy</a>';
    sp.querySelector(".nprulesv").onclick=function(e){e.preventDefault();e.stopPropagation();pop(c)};
  }
  function pop(c){
    var old=document.getElementById("npRulesPop");if(old)old.remove();
    var o=document.createElement("div");o.id="npRulesPop";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","Booking rules and privacy policy");
    o.innerHTML='<div class="bx"><div class="hd"><b>Booking rules</b><button type="button" class="x" aria-label="Close">×</button></div>'+
      (c?'<p class="vn">'+esc(c.name)+'</p>':'')+
      '<table>'+rows(c).map(function(x){return '<tr><th scope="row">'+esc(x[0])+'</th><td>'+esc(x[1])+'</td></tr>'}).join("")+'</table>'+
      '<h5>Privacy policy (short)</h5><p class="pp">We use your name and phone number only to handle this booking, and share them only with this venue. We do not sell your data. You can ask us to see or delete your data at any time (Thailand PDPA).</p>'+
      '<a class="full" href="privacy.html" target="_blank" rel="noopener">Read the full privacy policy</a>'+
      '<button type="button" class="ok">I understand</button></div>';
    document.body.appendChild(o);
    function close(){o.remove()}
    o.querySelector(".x").onclick=close;o.querySelector(".ok").onclick=close;o.onclick=function(e){if(e.target===o)close()};
    o.querySelector(".ok").focus();
  }
  var busy=false;
  new MutationObserver(function(){if(busy)return;busy=true;requestAnimationFrame(function(){busy=false;try{sync()}catch(e){}})}).observe(panel,{childList:true,subtree:true});
})();

/* ===== Raju language button (7 Oct 2026): a "🌐 English ▾" button in the Home Raju box and in the bottom-right Raju chat.
   It uses the SAME language setting as the app menu, so Raju and the full app change together. Nothing removed. ===== */
(function(){
  var L=[["en","English","English"],["hi","हिंदी","Hindi"],["pa","ਪੰਜਾਬੀ","Punjabi"],["gu","ગુજરાતી","Gujarati"],["ta","தமிழ்","Tamil"],["mr","मराठी","Marathi"],["th","ไทย","Thai"]];
  var NAME=/Raju|राजू|ਰਾਜੂ|રાજુ|ராஜு|ராஜூ|ราจู/;
  var POP="#panel,.sheet,#npMoreSheet,#npLangSheet";
  function cur(){var l="en";try{l=localStorage.getItem("np_lang")||"en"}catch(e){}for(var i=0;i<L.length;i++)if(L[i][0]===l)return L[i];return L[0]}
  function vis(el){return !!(el&&el.getClientRects().length)}
  if(!document.getElementById("npLangBtnCss")){
    var st=document.createElement("style");st.id="npLangBtnCss";
    st.textContent='.nplrow{display:flex;justify-content:flex-end;margin:6px 0}'+
      '.nplbtn{display:inline-flex;align-items:center;gap:6px;border:1px solid #7F77DD;background:#26215C;color:#CECBF6;border-radius:999px;padding:6px 12px;font-size:13px;font-weight:600;cursor:pointer;min-height:34px}'+
      '#npLangSheet{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center}'+
      '#npLangSheet .in{width:100%;max-width:480px;background:#17132a;color:#f2eefc;border-radius:20px 20px 0 0;padding:18px 16px calc(18px + env(safe-area-inset-bottom,0px))}'+
      '#npLangSheet .hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-weight:700;font-size:17px}'+
      '#npLangSheet .x{background:none;border:0;color:#f2eefc;font-size:22px;width:40px;height:40px;cursor:pointer}'+
      '#npLangSheet .g{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}'+
      '#npLangSheet .o{border:1px solid #3a2f5c;background:#1f1a36;color:#f2eefc;border-radius:14px;padding:12px;text-align:left;font-size:16px;cursor:pointer}'+
      '#npLangSheet .o small{display:block;color:#b3a9d6;font-size:12px;margin-top:2px}#npLangSheet .o.on{border-color:#7F77DD;background:#26215C;color:#CECBF6}#npLangSheet .in{border-top:1px solid #534AB7}';
    document.head.appendChild(st);
  }
  /* change the language with the app's fast switch (see "Fast language change" below) */
  function setLang(code){if(typeof window.npFastLang==="function")window.npFastLang(code);else{try{localStorage.setItem("np_lang",code)}catch(e){}location.reload()}}
  function openSheet(){
    var old=document.getElementById("npLangSheet");if(old)old.remove();
    var c=cur()[0],o=document.createElement("div");o.id="npLangSheet";
    o.innerHTML='<div class="in" role="dialog" aria-label="Choose language"><div class="hd"><span>🌐 Choose language</span><button class="x" aria-label="Close">×</button></div><div class="g">'+
      L.map(function(x){return '<button class="o'+(x[0]===c?" on":"")+'" data-l="'+x[0]+'">'+x[1]+'<small>'+x[2]+'</small></button>'}).join("")+'</div></div>';
    document.body.appendChild(o);
    function close(){o.remove()}
    o.querySelector(".x").onclick=close;o.onclick=function(e){if(e.target===o)close()};
    [].forEach.call(o.querySelectorAll(".o"),function(b){b.onclick=function(){var l=b.getAttribute("data-l");close();setLang(l)}});
  }
  function refresh(){var c=cur();[].forEach.call(document.querySelectorAll(".nplbtn span"),function(s){if(s.textContent!==c[1])s.textContent=c[1]})}
  /* find Raju's text boxes: the Home Raju box and the bottom-right Raju chat */
  function targets(){
    return [].slice.call(document.querySelectorAll('input[type="text"],input:not([type]),input[type="search"],textarea')).filter(function(inp){
      if(inp.closest(POP))return false;
      if(inp.closest("#rajuChat"))return true;
      var a=inp;for(var i=0;i<4&&a.parentElement;i++){a=a.parentElement;var t=a.textContent||"";if(t.length>1500)return false;if(NAME.test(t))return true}
      return false;
    });
  }
  function attach(){
    targets().forEach(function(inp){
      var row=(inp.parentElement&&inp.parentElement.querySelector("button")&&inp.parentElement.tagName!=="FORM")?inp.parentElement:inp;
      var prev=row.previousElementSibling;if(prev&&prev.classList.contains("nplrow"))return;
      if(row.parentElement&&row.parentElement.querySelector(":scope > .nplrow"))return;
      var r=document.createElement("div");r.className="nplrow";
      r.innerHTML='<button type="button" class="nplbtn" aria-label="Change language">🌐 <span>'+cur()[1]+'</span> ▾</button>';
      r.querySelector("button").onclick=function(e){e.preventDefault();e.stopPropagation();openSheet()};
      row.insertAdjacentElement("beforebegin",r);
    });
    refresh();
  }
  var busy=false;
  new MutationObserver(function(){if(busy)return;busy=true;setTimeout(function(){busy=false;try{attach()}catch(e){}},250)}).observe(document.body,{childList:true,subtree:true});
  window.addEventListener("storage",refresh);
  try{attach()}catch(e){}
})();

/* ===== 7 Oct 2026: fast language change (no full reload), suggestion buttons in the chosen language,
   and Raju's fixed English lines translated. Only added; the old reload way stays as backup. ===== */
(function(){
  var NAMES={en:"English",hi:"Hindi",pa:"Punjabi",gu:"Gujarati",ta:"Tamil",mr:"Marathi",th:"Thai"};
  var SHORT={en:"EN",hi:"हि",pa:"ਪੰ",gu:"ગુ",ta:"த",mr:"म",th:"ไท"};
  var NATIVE={en:"English",hi:"हिंदी",pa:"ਪੰਜਾਬੀ",gu:"ગુજરાતી",ta:"தமிழ்",mr:"मराठी",th:"ไทย"};
  var WAITTXT={en:"Changing language…",hi:"भाषा बदल रही है…",pa:"ਭਾਸ਼ਾ ਬਦਲ ਰਹੀ ਹੈ…",gu:"ભાષા બદલાઈ રહી છે…",ta:"மொழி மாறுகிறது…",mr:"भाषा बदलत आहे…",th:"กำลังเปลี่ยนภาษา…"};
  var SCRIPT={hi:/[\u0900-\u097F]/g,mr:/[\u0900-\u097F]/g,pa:/[\u0A00-\u0A7F]/g,gu:/[\u0A80-\u0AFF]/g,ta:/[\u0B80-\u0BFF]/g,th:/[\u0E00-\u0E7F]/g};
  function getLang(){try{return localStorage.getItem("np_lang")||"en"}catch(e){return "en"}}
  function setCookie(l){
    var exp=(l==="en")?"; expires=Thu, 01 Jan 1970 00:00:00 GMT":"",v=(l==="en")?"":"/en/"+l;
    document.cookie="googtrans="+v+"; path=/"+exp;
    document.cookie="googtrans="+v+"; path=/; domain="+location.hostname+exp;
  }
  function overlay(l,on){
    var o=document.getElementById("npLangWait");
    if(!on){if(o)o.remove();return}
    if(!o){o=document.createElement("div");o.id="npLangWait";o.className="notranslate";o.setAttribute("translate","no");
      o.style.cssText="position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);z-index:100000;background:#26215C;color:#CECBF6;border:1px solid #7F77DD;border-radius:999px;padding:12px 20px;font-weight:600;font-size:15px;box-shadow:0 8px 30px rgba(0,0,0,.5)";
      document.body.appendChild(o)}
    o.textContent="🌐 "+(WAITTXT[l]||WAITTXT.en);
  }
  function labels(l){
    var b=document.querySelector("#npxLang b");if(b)b.textContent=NAMES[l]||"English";
    [].forEach.call(document.querySelectorAll(".langbtn"),function(btn){var n=btn.lastChild;if(n&&n.nodeType===3)n.nodeValue=SHORT[l]||"EN"});
    [].forEach.call(document.querySelectorAll(".nplbtn span"),function(s){s.textContent=NATIVE[l]||"English"});
  }
  function reload(){setTimeout(function(){location.reload()},60)}
  window.npLiveLang=function(l){
    if(!NAMES[l])return;
    var cur=getLang();
    try{localStorage.setItem("np_lang",l)}catch(e){}
    if(l===cur)return;
    setCookie(l);document.documentElement.lang=l;overlay(l,true);
    var sel=document.querySelector("select.goog-te-combo");
    var has=sel&&[].some.call(sel.options,function(o){return o.value===l});
    if(!has)return reload();
    sel.value=l;sel.dispatchEvent(new Event("change",{bubbles:true}));
    labels(l);
    setTimeout(function(){overlay(l,false)},900);
    /* safety: if the page did not change, do it the old way (reload) */
    setTimeout(function(){
      var tr=/translated-(ltr|rtl)/.test(document.documentElement.className);
      if((l==="en"&&tr)||(l!=="en"&&!tr)){overlay(l,true);reload()}
    },l==="en"?1800:4500);
  };
  /* the app's own language menu uses the fast way too */
  document.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest(".langlist [data-l]");if(!b)return;
    e.preventDefault();e.stopImmediatePropagation();
    try{if(typeof closeSheet==="function")closeSheet()}catch(err){}
    window.npLiveLang(b.getAttribute("data-l"));
  },true);
  /* suggestion buttons: send the question in the language the guest sees */
  document.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("#quick button,#rajuQ button");if(!b||getLang()==="en")return;
    var t=(b.innerText||b.textContent||"").trim();
    if(!t||!/[^\x00-\x7F]/.test(t))return;
    e.preventDefault();e.stopImmediatePropagation();
    if(b.closest("#rajuQ")){var rin=document.getElementById("rajuIn"),go=document.getElementById("rajuGo");if(rin&&go){rin.value=t;go.click();return}}
    if(typeof ask==="function")ask(t);
  },true);
  /* Raju's fixed English lines (sales tips, backup answers): translate them into the chosen language */
  if(typeof ask!=="function"||typeof chatEl==="undefined")return;
  var sb=null;try{if(window.supabase)sb=window.supabase.createClient("https://mymtgbmcjbwsnetzwgoy.supabase.co","sb_publishable_ViFodxG8kAENr78Fyp-BwQ_iA_BfAD0")}catch(e){}
  function cache(l){try{return JSON.parse(localStorage.getItem("np_tr_"+l)||"{}")}catch(e){return {}}}
  function saveCache(l,c){try{var k=Object.keys(c);if(k.length>300)k.slice(0,k.length-300).forEach(function(x){delete c[x]});localStorage.setItem("np_tr_"+l,JSON.stringify(c))}catch(e){}}
  function needs(t,l){
    var re=SCRIPT[l];if(!re)return false;
    var own=(t.match(re)||[]).length,lat=(t.match(/[A-Za-z]/g)||[]).length;
    return lat>=15&&own<lat*0.3&&!/typing|लिख रहा|soch raha/i.test(t);
  }
  function put(el,t){el.textContent=t;el.classList.add("notranslate");el.setAttribute("translate","no")}
  async function fix(){
    var l=getLang();if(l==="en"||!SCRIPT[l])return;
    var kids=[].slice.call(chatEl.children),last=-1;
    kids.forEach(function(el,i){if(el.classList&&el.classList.contains("me"))last=i});
    var todo=kids.slice(last+1).filter(function(el){return el.classList&&el.classList.contains("bot")&&needs((el.textContent||"").trim(),l)});
    if(!todo.length)return;
    var c=cache(l),miss=[];
    todo.forEach(function(el){var t=el.textContent.trim();if(c[t])put(el,c[t]);else miss.push(el)});
    if(!miss.length||!sb)return;
    var lines=miss.map(function(el,i){return (i+1)+") "+el.textContent.trim().replace(/\s+/g," ")}).join("\n");
    var msg="TRANSLATION TASK (not a guest question). Translate each numbered line into "+NAMES[l]+" using "+NAMES[l]+" script. "+
      "Keep the same meaning and friendly tone. Keep numbers, prices, ฿ amounts, venue names and phone numbers unchanged. "+
      "Reply with ONLY the translated lines, same numbering, one per line, like '1) ...'. No greeting, no extra words, no tips, no IDS line.\n\n"+lines;
    try{
      var call=sb.functions.invoke("bright-responder",{body:{messages:[{role:"user",text:msg}],venues:"For this message you are only a translator. Do not act as Raju, do not add anything else.",lang:l}});
      var r=await Promise.race([call,new Promise(function(ok){setTimeout(function(){ok(null)},25000)})]);
      var rep=r&&!r.error&&r.data&&r.data.reply;if(!rep)return;
      var got={};String(rep).split(/\n+/).forEach(function(line){var m=line.match(/^\s*(\d+)\s*[).:\-]\s*(.+)$/);if(m)got[+m[1]]=m[2].replace(/\*\*/g,"").trim()});
      miss.forEach(function(el,i){var tr=got[i+1];if(tr&&!needs(tr,l)){c[el.textContent.trim()]=tr;put(el,tr)}});
      saveCache(l,c);
    }catch(e){}
  }
  var _a=ask;
  ask=async function(q){var r=await _a.apply(this,arguments);try{await fix()}catch(e){}return r};
})();

/* ===== Fast language change (7 Oct 2026): switch the language instantly with Google Translate, without reloading the app.
   Used by the app menu and the Raju 🌐 button. If anything fails, it falls back to the old reload. Nothing removed. ===== */
(function(){
  var NATIVE={en:"English",hi:"हिन्दी",pa:"ਪੰਜਾਬੀ",gu:"ગુજરાતી",ta:"தமிழ்",mr:"मराठी",th:"ไทย"};
  var SHORT={en:"EN",hi:"हि",pa:"ਪੰ",gu:"ગુ",ta:"த",mr:"म",th:"ไท"};
  var WAIT={en:"Changing language…",hi:"भाषा बदल रही है…",pa:"ਭਾਸ਼ਾ ਬਦਲ ਰਹੀ ਹੈ…",gu:"ભાષા બદલાઈ રહી છે…",ta:"மொழி மாறுகிறது…",mr:"भाषा बदलत आहे…",th:"กำลังเปลี่ยนภาษา…"};
  function getL(){try{return localStorage.getItem("np_lang")||""}catch(e){return ""}}
  function cookie(l){
    var exp=(l==="en")?"; expires=Thu, 01 Jan 1970 00:00:00 GMT":"",v=(l==="en")?"":"/en/"+l;
    document.cookie="googtrans="+v+"; path=/"+exp;
    document.cookie="googtrans="+v+"; path=/; domain="+location.hostname+exp;
  }
  function labels(l){
    try{var b=document.querySelector("#npxLang b");if(b)b.textContent=NATIVE[l]||"English"}catch(e){}
    try{var t=document.querySelector(".langbtn");if(t){var n=t.lastChild;if(n&&n.nodeType===3)n.nodeValue=SHORT[l]||"EN"}}catch(e){}
    try{[].forEach.call(document.querySelectorAll(".nplbtn span"),function(s){s.textContent=NATIVE[l]==="हिन्दी"?"हिंदी":NATIVE[l]})}catch(e){}
  }
  function wait(l,show){
    var w=document.getElementById("npLangWait");
    if(!show){if(w)w.remove();return}
    if(!w){w=document.createElement("div");w.id="npLangWait";w.className="notranslate";w.setAttribute("translate","no");
      w.style.cssText="position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:100000;background:#26215C;color:#CECBF6;border:1px solid #7F77DD;border-radius:16px;padding:14px 20px;font-size:15px;font-weight:600;box-shadow:0 10px 40px rgba(0,0,0,.5)";
      document.body.appendChild(w)}
    w.textContent="🌐 "+(WAIT[l]||WAIT.en);
  }
  function reload(l){wait(l,true);try{localStorage.setItem("np_lang",l)}catch(e){}cookie(l);location.reload()}
  window.npFastLang=function(l){
    if(!NATIVE[l])l="en";
    var cur=getL();
    if(!cur&&l==="en"){try{localStorage.setItem("np_lang","en")}catch(e){}return}
    if((cur||"en")===l)return;
    if(l==="en")return reload(l);              /* going back to English needs a fresh page */
    var sel=document.querySelector("select.goog-te-combo");
    if(!sel)return reload(l);
    var has=[].some.call(sel.options,function(o){return o.value===l});
    if(!has)return reload(l);
    wait(l,true);
    try{localStorage.setItem("np_lang",l)}catch(e){}
    cookie(l);document.documentElement.lang=l;labels(l);
    try{sel.value=l;sel.dispatchEvent(new Event("change"))}catch(e){return reload(l)}
    var n=0;(function check(){n++;
      var ok=/translated-(ltr|rtl)/.test(document.documentElement.className);
      if(ok){setTimeout(function(){wait(l,false)},300);return}
      if(n<40)setTimeout(check,100);else reload(l);   /* not switched after 4 s: use the old way */
    })();
  };
  /* the app's own language menu uses the fast switch too */
  document.addEventListener("click",function(e){
    var b=e.target&&e.target.closest?e.target.closest(".langlist [data-l]"):null;if(!b)return;
    e.preventDefault();e.stopImmediatePropagation();
    try{if(typeof closeSheet==="function")closeSheet()}catch(err){}
    window.npFastLang(b.getAttribute("data-l"));
  },true);
})();

/* ===== Raju suggestion buttons (7 Oct 2026): send the question in the language the guest sees. Nothing removed. ===== */
(function(){
  if(typeof ask!=="function")return;
  document.addEventListener("click",function(e){
    var b=e.target&&e.target.closest?e.target.closest("#quick button,#rajuQ button"):null;if(!b)return;
    var l="en";try{l=localStorage.getItem("np_lang")||"en"}catch(err){}
    if(l==="en")return;
    var seen=(b.innerText||"").trim();
    if(seen&&seen!==(b.getAttribute("data-en")||"")){window.__npChipQ=seen;setTimeout(function(){window.__npChipQ=null},3000)}
  },true);
  var _a=ask;
  ask=function(q){
    if(window.__npChipQ){q=window.__npChipQ;window.__npChipQ=null}
    return _a.call(this,q);
  };
})();
