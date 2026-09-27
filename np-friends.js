/* Namaste Pattaya Reservations: Find a buddy (one feature, clear purpose), Find My Friends & Bill Splitter */
(function(){
  var sb=window.supabase?window.supabase.createClient("https://mymtgbmcjbwsnetzwgoy.supabase.co","sb_publishable_ViFodxG8kAENr78Fyp-BwQ_iA_BfAD0"):null;
  var TITLE="Find My Friends & Bill Splitter";
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function rer(list){list.forEach(function(f){try{if(typeof window[f]==="function")window[f]()}catch(e){}})}

  if(typeof INTENTS!=="undefined")INTENTS.forEach(function(i){if(i[0]==="dating")i[2]="Meet new people"});
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
      h+='<p class="small">Log in first to use Find my friends.</p><button class="cta" id="fdLog">Log in</button>';
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
    if(!code){root.innerHTML='<p class="about">Start or join a group in <b>Find my friends</b> first. Then everyone in the group can add and split bills here.</p><button class="cta" id="bsGo">Go to Find my friends</button>';
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
      '<div class="fbtabs" role="tablist"><button role="tab" data-t="find">Find my friends</button><button role="tab" data-t="bill">Bill splitter</button></div>'+
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
