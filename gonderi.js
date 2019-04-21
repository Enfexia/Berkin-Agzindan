/*

if(document.getElementsByClassName('background')[0]) {
  document.getElementsByClassName('background')[0].remove();
}

*/
var gonderiid = window.location.hash.substr(1);
if(gonderiid != "" && gonderiid != undefined) {
  verilerial(gonderiid)
} else {
  window.location.replace("404.html");
}

function verilerial() {
  var kullaniciadi = "";
  db.collection("sesler").doc(gonderiid).get().then(function(querySnapshot) {
    var sesverileri = querySnapshot.data()
    if(sesverileri == undefined) {
      window.location.replace("404.html");
      return false;
    }
    var kullaniciadi = sesverileri.Kad;
    var gonderimetni = sesverileri.Metin;
    var gonderitarih = sesverileri.Tarih;
    begenilerial(kullaniciadi, gonderimetni, gonderitarih)
  });
}

function begenilerial(kullaniciadi, gonderimetni, gonderitarih) {
  db.collection("begeniler").doc(gonderiid).get().then(function(querySnapshot) {
    var begendimi = Object.keys(querySnapshot.data()).some(function(key) {
      return key == uid;
    });
    var begeniverileri = querySnapshot.data()
    var begenisayisi = begeniverileri.bs;
    var gonderiid = begeniverileri.gid;
    verilerirenderla(kullaniciadi, gonderimetni, gonderitarih, begenisayisi, gonderiid, begendimi)
  });
}

function verilerirenderla(kullaniciadi, gonderimetni, gonderitarih, begenisayisi, gonderiid, begendimi) {
  document.getElementsByClassName('gonderiyazanadi')[0].innerText = kullaniciadi;
  document.getElementsByClassName('paylasilangonderimetin')[0].innerText = gonderimetni;
  document.getElementsByClassName('paylasilangonderitarih')[0].innerText = tarihdonustur(gonderitarih);
  document.getElementsByClassName('paylasilanmetinbegenisayi')[0].innerText = begenisayisi;
  if(begendimi == true) {
    document.getElementsByClassName('paylasilanmetinpath')[0].setAttribute("fill", "#09AD61")
  } else {
    document.getElementsByClassName('paylasilanmetinpath')[0].setAttribute("fill", "#DCDCDC")
  }
  document.getElementsByClassName('paylasilmisgonderibegeni')[0].id = "begeni/" + gonderiid;
  document.getElementsByClassName('paylasilmisgonderibegeni')[0].setAttribute('onclick', "begen('" + gonderiid + "')");
  document.getElementsByClassName('paylasilanmetinpath')[0].classList.add(gonderiid)
  document.getElementsByClassName('paylasilanmetinbegenisayi')[0].classList.add(gonderiid)
  if(document.getElementsByClassName('background_paylasilan')[0]) {
    document.getElementsByClassName('background_paylasilan')[0].remove();
    document.getElementsByClassName('paylasilankapsayici')[0].style.display = ''
    document.getElementsByClassName('paylasilankapsayici')[1].style.display = ''
  }
}

function urlyikopyala(para) {
  kakabok = para;
  navigator.clipboard.writeText(location.href).then(function() {
    kakabok.textContent = "URL Kopyalandı"
    kakabok.style.backgroundColor = "#09AD61"
    setTimeout(function() {
      kakabok.textContent = "Arkadaşlarına Yolla";
      kakabok.style.backgroundColor = "#12AAFA"
    }, 1500);
  }, function(err) {
    kakabok.textContent = "URL Kopyalanamadı"
  });
}