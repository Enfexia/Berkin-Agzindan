/*
/// Veri al
var docRef = db.collection("sesler").doc("1");
db.collection("sesler").get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  });
});
/// Veri Kaydet
db.collection("sesler").doc(Date.now().toString() + Math.floor(Math.random() * 100).toString()).set({
  Kad: "Cemile",
  Metin: "CAasfasfasfasfafsaf",
  Tarih: Date.now()
}).then(function() {
  console.log("Document successfully written!");
}).catch(function(error) {
  console.error("Error writing document: ", error);
});
/// Begeni edit
if(uid != false) {
  db.collection("begeniler").doc("15555306380714").set({
    uid: uid,
  }).then(function() {
    console.log("Document successfully written!");
  }).catch(function(error) {
    console.error("Error writing document: ", error);
  });
}
*/
function boslukkontrolu(value) {
  if(value != "" && value.length > 3) {
    document.getElementsByClassName("paylasbuton")[0].disabled = false;
    document.getElementsByClassName("paylasbuton")[0].style.cursor = "auto";
  } else {
    document.getElementsByClassName("paylasbuton")[0].disabled = true;
    document.getElementsByClassName("paylasbuton")[0].style.cursor = "not-allowed"
  }
}

function paylas() {
  var metin = document.getElementById("metinkutusu").value;
  var kullaniciadi = document.getElementById("kullaniciadi").value;
  if(kullaniciadi == "") {
    var kullaniciadi = "Anonim"
  }
  var gonderiuid = Date.now().toString() + Math.floor(Math.random() * 100).toString();
  db.collection("sesler").doc(gonderiuid).set({
    Kad: kullaniciadi,
    Metin: metin,
    Tarih: Date.now(),
    gid: gonderiuid,
  }).then(ilkgonderibegeni(gonderiuid)).catch(function(error) {
    console.error("Error writing document: ", error);
  });
}
db.collection("begeniler").orderBy("bs", "desc").limit(10).get().then(function(querySnapshot) {
  //  console.log(querySnapshot)
  querySnapshot.forEach(function(doc) {
    // doc.data() is never undefined for query doc snapshots
    //  console.log(doc.id, " => ", Object.keys(doc.data()).length);
  });
});

function begen(guid) {
  db.collection("begeniler").doc(guid).get().then(function(doc) {
    var begendimi = Object.keys(doc.data()).some(function(key) {
      return key == uid;
    });
    var begenisayisi = (Object.keys(doc.data()).length - 1);
    //  console.log(begenisayisi)
    if(begendimi == true) {
      begenisil(guid, begenisayisi - 1)
    } else {
      begendirici(guid, begenisayisi)
    }
  });
}

function begendirici(guid, bsdegeri) {
  db.collection("begeniler").doc(guid).update({
    [uid]: 1,
    bs: bsdegeri
  }).then(function() {
    if(document.getElementsByClassName(guid)[2]) {
      document.getElementsByClassName(guid)[0].setAttribute("fill", "#09AD61")
      document.getElementsByClassName(guid)[1].innerHTML = bsdegeri;
      document.getElementsByClassName(guid)[2].setAttribute("fill", "#09AD61")
      document.getElementsByClassName(guid)[3].innerHTML = bsdegeri;
    } else {
      document.getElementsByClassName(guid)[1].innerHTML = bsdegeri;
      document.getElementsByClassName(guid)[0].setAttribute("fill", "#09AD61")
    }
  }).catch(function(error) {
    console.error("Error writing document: ", error);
  });
}

function begenisil(guid, bsdegeri) {
  db.collection("begeniler").doc(guid).update({
    [uid]: firebase.firestore.FieldValue.delete(),
    bs: bsdegeri - 1
  }).then(function() {
    if(document.getElementsByClassName(guid)[2]) {
      document.getElementsByClassName(guid)[0].setAttribute("fill", "#DCDCDC")
      document.getElementsByClassName(guid)[1].innerHTML = bsdegeri - 1;
      document.getElementsByClassName(guid)[2].setAttribute("fill", "#DCDCDC")
      document.getElementsByClassName(guid)[3].innerHTML = bsdegeri - 1;
    } else {
      document.getElementsByClassName(guid)[1].innerHTML = bsdegeri - 1;
      document.getElementsByClassName(guid)[0].setAttribute("fill", "#DCDCDC")
    }
  })
}
/*
function begenisayibulucu(guid) {
  db.collection("begeniler").doc(guid).get().then(function(querySnapshot) {
    var bsdegeri = Object.keys(querySnapshot.data()).length;
    begendirici(guid, bsdegeri)
  });
  // BSDEĞERİ yamuk dönüyp onu düzgün döndürmek lazım
}
*/
function ilkgonderibegeni(guid, gonderiuid) {
  db.collection("begeniler").doc(guid).set({
    [uid]: 1,
    bs: 1,
    gid: guid
  }).then(function() {
    //  console.log("Document successfully written!");
    window.location.replace("gonderi.html#" + guid);
  }).catch(function(error) {
    console.error("Error writing document: ", error);
  });
}

function enbegenilen() {
  db.collection("begeniler").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      //    console.log(doc.id, " => ", Object.keys(doc.data()).length);
    });
  });
}

function enyenigonderilerial() {
  db.collection("sesler").orderBy("gid", "desc").limit(5).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(tarih) {
      // doc.data() is never undefined for query doc snapshots
      var tarihler = tarih.data()
      db.collection("begeniler").doc(tarih.id).get().then(function(querySnapshot) {
        if(querySnapshot.data()[uid] != undefined) {
          var begendimi = true
        } else {
          var begendimi = false
        }
        gonderirenderla(tarihler['Kad'], tarihdonustur(tarihler['Tarih']), tarihler['Metin'], querySnapshot.data()['bs'], begendimi, tarih.id, "yeni")
      });
    });
  });
}

function sayfalandirma() {
  var tumgiriler = document.querySelectorAll(".kapsayici");
  var tumbegeniler = document.querySelectorAll(".begenisayi");
  var ensongirdiid = tumgiriler[tumgiriler.length - 1].id;
  var girdininturu = ensongirdiid.split("/")[0];
  var girdiid = ensongirdiid.split("/")[1];
  var ensongirdibegenisayisi = tumbegeniler[tumbegeniler.length - 1].innerText;
  //  console.log("sayfalandirma")
  if(girdininturu == "begeni") {
    enbegenilengonderilerisayfalandir(girdiid, ensongirdibegenisayisi)
  } else if(girdininturu == "yeni") {
    enyenigonderilerisayfalandir(girdiid)
  } else {
    //console.log("sayfalandirmada hata var")
  }
}

function enyenigonderilerisayfalandir(girdiid) {
  var bittimi = false
  db.collection("sesler").orderBy("gid", "desc").startAfter(girdiid).limit(5).get().then(function(querySnapshot) {
    var gelenverisayisi = querySnapshot.size
    //  console.log(bittimi)
    var i = 0;
    querySnapshot.forEach(function(tarih) {
      // doc.data() is never undefined for query doc snapshots
      var tarihler = tarih.data()
      db.collection("begeniler").doc(tarih.id).get().then(function(querySnapshot) {
        if(querySnapshot.data()[uid] != undefined) {
          var begendimi = true
        } else {
          var begendimi = false
        }
        i++
        if(gelenverisayisi == i && gelenverisayisi != 5) {
          bittimi = true;
        }
        ilkkezmi = false;
        gonderirenderla(tarihler['Kad'], tarihdonustur(tarihler['Tarih']), tarihler['Metin'], querySnapshot.data()['bs'], begendimi, tarih.id, "yeni", bittimi)
      });
    });
    /*


    */
  })
}

function enbegenilengonderilerisayfalandir(girdiid, ensongirdibegenisayisi) {
  //console.log(ensongirdibegenisayisi, girdiid)
  var bittimi = false;
  //  console.log("enbegenilengonderilerisayfalandir")
  db.collection("begeniler").orderBy("bs", "desc").orderBy("gid", "desc").startAfter(parseInt(ensongirdibegenisayisi, 10), girdiid).limit(5).get().then(function(querySnapshot) {
    var gelenverisayisi = querySnapshot.size
    //  console.log(bittimi)
    //  console.log(querySnapshot.size)
    if(gelenverisayisi == 0) {}
    var i = 0
    querySnapshot.forEach(function(begeni) {
      //    console.log(begeni.data())
      //  var gelenverisayisi = gelenverisayisi - 1;
      var begenenkisiler = begeni.data();
      //  console.log(begeni.id)
      var begenisayi = begenenkisiler['bs']
      if(begenenkisiler[uid] != undefined) {
        var begendimi = true
      } else {
        var begendimi = false
      }
      db.collection("sesler").doc(begeni.id).get().then(function(querySnapshot) {
        var gonderi_verileri = querySnapshot.data()
        i++
        if(gelenverisayisi == i && gelenverisayisi != 5) {
          bittimi = true;
        }
        //  console.log(i)
        gonderirenderla(gonderi_verileri['Kad'], tarihdonustur(gonderi_verileri['Tarih']), gonderi_verileri['Metin'], begenisayi, begendimi, querySnapshot.id, "begeni", bittimi)
      });
      /*
      db.collection("sesler").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(sesler) {
          var gelenverisayisi = gelenverisayisi - 1;
          if(gelenverisayisi == 0) {
            bittimi = true
          }
          console.log(gelenverisayisi)
          // doc.data() is never undefined for query doc snapshots
          if(begeni.id == sesler.id) {
            var gonderi_verileri = sesler.data();
            //    console.log(begendimi)
            gonderirenderla(gonderi_verileri['Kad'], tarihdonustur(gonderi_verileri['Tarih']), gonderi_verileri['Metin'], begenisayi, begendimi, sesler.id, "begeni", bittimi)
          }
        });
      });
      */
    })
  });
}

function enbegenilengonderilerial() {
  db.collection("begeniler").orderBy("bs", "desc").limit(5).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(begeni) {
      // doc.data() is never undefined for query doc snapshots
      var begenenkisiler = begeni.data();
      var begenisayi = begenenkisiler['bs']
      if(begenenkisiler[uid] != undefined) {
        var begendimi = true
      } else {
        var begendimi = false
      }
      db.collection("sesler").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(sesler) {
          // doc.data() is never undefined for query doc snapshots
          if(begeni.id == sesler.id) {
            var gonderi_verileri = sesler.data();
            //    console.log(begendimi)
            gonderirenderla(gonderi_verileri['Kad'], tarihdonustur(gonderi_verileri['Tarih']), gonderi_verileri['Metin'], begenisayi, begendimi, sesler.id, "begeni")
          }
        });
      });
    });
  });
}

function gonderirenderla(kullaniciadi, gonderipaylasimtarihi, gonderi, gonderibegenisayisi, begendimi, sesid, girdituru, ensonmu) {
  var frag = document.createDocumentFragment(),
    temp = document.createElement('div');
  temp.innerHTML = gonderiduzenle(kullaniciadi, gonderipaylasimtarihi, gonderi, gonderibegenisayisi, begendimi, sesid, girdituru, ensonmu);
  while(temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }
  document.getElementById("paylasilanlarinhepsi").appendChild(frag);
  ilkkezmi = true;
}

function gonderiduzenle(kullaniciadi, gonderipaylasimtarihi, gonderi, gonderibegenisayisi, begendimi, sesid, girdituru, ensonmu) {
  if(begendimi == true) {
    gonderirengi = "#09AD61"
  } else {
    gonderirengi = "#DCDCDC"
  }
  if(ensonmu == true) {
    var sayfaalti = '<div class="besbosluk"></div><div class="ondortbosluk" style="height:100%"><span class="sayfasonu">Tüm Gönderileri Görüntüledin</span></div><div class="besbosluk"></div>'
    var yukleniyor = ''
  } else {
    var yukleniyor = '<div class="besbosluk ikimobilbosluk"></div><div class="ondortbosluk yirmimobilbosluk" style="height:100%"><div class="paylasilan background"></div></div><div class="besbosluk ikimobilbosluk"></div>'
    var sayfaalti = ''
  }
  if(document.getElementsByClassName('background')[0]) {
    document.getElementsByClassName('background')[0].remove();
  }
  return '<div class="besbosluk ikimobilbosluk"></div><div class="ondortbosluk yirmimobilbosluk" style="height:100%"><div class="paylasilan"><div class="ikibosluk"><div class="kapsayici" id="' + girdituru + "/" + sesid + '" onclick="begen(\'' + sesid + '\')"><svg class="begeni" viewBox="0 0 29 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path  class="' + sesid + '" d="M28.4812 12.064C28.4812 13.064 27.3236 18.437 26.7366 20.314C25.8984 23.003 23.8357 24 20.8562 24C18.176 24 16.0675 23.383 14.5918 22.842C12.1851 21.959 10.1412 21.323 7.34952 21.096L7.34952 22L0.305633 22L0.305632 10L7.34952 10L7.34952 10.73C10.2305 10.145 13.0457 8.664 14.863 3.328C15.43 1.668 16.0041 -1.3724e-06 18.1889 -1.5634e-06C22.2368 -1.91728e-06 21.7167 5.531 20.767 8.814C22.0654 9.28 24.0154 9.506 25.4359 9.558C27.11 9.618 28.4812 10.416 28.4812 12.064ZM5.00156 12L2.65359 12L2.6536 20L5.00156 20L5.00156 12ZM23.4976 13.302L25.1342 13.135C26.3962 13.006 26.4314 11.61 25.194 11.551C21.9668 11.397 19.2537 10.538 18.0093 9.995C18.5141 8.247 19.0893 6.532 19.0893 4.461C19.0893 1.956 18.1725 0.794997 17.1182 3.887C14.7785 10.746 11.1814 12.251 7.34952 13L7.34952 19C10.3091 19.072 12.8907 20.041 15.5193 21.005C17.5514 21.75 21.2119 22.5 23.0515 21.619C24.5718 20.783 24.3593 19.885 23.3943 19.958L22.4892 19.99C21.5324 20.084 21.4091 18.922 22.3612 18.849C22.3612 18.849 23.912 18.787 24.4098 18.734C25.5556 18.611 25.6167 17.127 24.3629 17.183C23.8263 17.207 23.021 17.224 23.021 17.224C22.0853 17.255 21.9938 16.146 22.8555 16.052C22.8555 16.052 23.6937 16.047 24.9228 15.953C26.152 15.859 26.1884 14.344 24.9181 14.39C23.8991 14.427 23.6632 14.417 23.6632 14.417C22.7827 14.412 22.6359 13.389 23.4976 13.302Z" fill="' + gonderirengi + '"/></svg><span class="begenisayi ' + sesid + '">' + gonderibegenisayisi + '</span> </div> </div> <div class="yirmibosluk"><div class="onikigrid"><div class="ikibosluk "><span class="gonderiyazanadi">' + kullaniciadi + '</span></div><div class="dokuzbosluk" ></div><div class="birbosluk" style="display:flex"><span class="gonderipaylasimtarihi">' + gonderipaylasimtarihi + '</span></div><div class="onikibosluk"><span class="gonderimetin"  id=' + sesid + '>' + gonderi + '</span></div><div class="dokuzbosluk" ></div><div class="ikibosluk" ><div class="onikigrid mobildekaydir"><div class="altibosluk"><svg class="paylassvg" onclick="gonderipaylas(\'' + sesid + '\')" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.875 2.625C2.91037 2.625 3.75 3.46463 3.75 4.5C3.75 5.53538 2.91037 6.375 1.875 6.375C0.839625 6.375 0 5.53538 0 4.5C0 3.46463 0.839625 2.625 1.875 2.625ZM6.04575 7.14937C6.01837 7.26225 6 7.3785 6 7.5C6 8.32837 6.67163 9 7.5 9C8.32837 9 9 8.32837 9 7.5C9 6.67163 8.32837 6 7.5 6C7.06313 6 6.6735 6.18975 6.39937 6.48787L4.34137 5.39025C4.25513 5.62875 4.1355 5.85113 3.98775 6.05175L6.04575 7.14937ZM9 1.5C9 0.671625 8.32837 0 7.5 0C6.67163 0 6 0.671625 6 1.5C6 1.6215 6.01837 1.73775 6.04575 1.85063L3.98775 2.94825C4.13587 3.14887 4.25513 3.37088 4.34137 3.60975L6.39937 2.51213C6.6735 2.81025 7.06313 3 7.5 3C8.32837 3 9 2.32838 9 1.5Z" fill="#12AAFA"/></svg></div><div class="altibosluk"><span class="paylasgonderimetin" onclick="gonderipaylas(\'' + sesid + '\')">Paylaş</span></div></div></div><div class="birbosluk" ><div class="onikigrid" onclick="metincal(\'' + sesid + '\',\'gonderi\',this)"><div class="altibosluk"><svg class="gonderidinlebuton" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.467468 9.16668V0.833344L9.27233 5.00001L0.467468 9.16668Z" fill="#09AD61"/></svg></div><div class="altibosluk"><span class="gonderidinlemetin" >Dinle</span></div></div></div></div></div><div class="ikibosluk"></div></div></div><div class="besbosluk"></div><div class="yirmidortbosluk" style="height: 4vw;"></div>' + yukleniyor + sayfaalti
}

function tarihdonustur(gonderitarihi) {
  var time = gonderitarihi;
  var date = new Date(time);
  return date.toLocaleDateString();
}

function paylasilantemizle() {
  document.getElementById('paylasilanlarinhepsi').innerHTML = "";
}

function enbegenileyenile() {
  document.getElementsByClassName('altbasliksonuk')[0].style.color = "#838E96"
  document.getElementsByClassName('altbaslik')[0].style.color = "#DCDCDC";
  if(typeof sayac !== 'undefined') {
    clearInterval(sayac);
  }
  paylasilantemizle();
  yukleniyorkismiekle();
  enbegenilengonderilerial();
}

function enyenibutonu() {
  document.getElementsByClassName('altbasliksonuk')[0].style.color = "#DCDCDC";
  document.getElementsByClassName('altbaslik')[0].style.color = "#838E96";
  if(typeof sayac !== 'undefined') {
    clearInterval(sayac);
  }
  paylasilantemizle();
  yukleniyorkismiekle();
  enyenigonderilerial();
}

function yukleniyorkismiekle() {
  var frag = document.createDocumentFragment(),
    temp = document.createElement('div');
  temp.innerHTML = '<div class="besbosluk ikimobilbosluk"></div><div class="ondortbosluk yirmimobilbosluk" style="height:100%"><div class="paylasilan background"></div></div><div class="besbosluk ikimobilbosluk"></div>'
  while(temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }
  document.getElementById("paylasilanlarinhepsi").appendChild(frag);
}
ilkkezmi = true;
window.onscroll = function() {
  kaydirma()
};

function kaydirma() {
  if(ilkkezmi == true && document.getElementsByClassName("kapsayici")[0] && (window.innerHeight + window.scrollY) >= document.getElementById(document.getElementsByClassName("kapsayici")[document.getElementsByClassName("kapsayici").length - 2].id).offsetTop) {
    //  console.log("ilk kez yükleniyo")
    //  console.log("kaydirma")
    ilkkezmi = false;
    sayfalandirma()
  }
}
turn = 0;
bioncekielement = ""
i = 0;

function metincal(divid, gonderituru, value, gonderimi) {
  var tiklananelement = value;
  if(gonderituru == "metinkutusu" && document.getElementById(divid).value.replace(/\n/g, " ") == "") {
    return false;
  }
  /*
  if(bioncekielement != "" && bioncekielement.getAttribute('onclick') == "metincal('metinkutusu',false,this)" && spanmi == true) {
    //kendi yazdığı metni dinledi canı sıkıldı tak diye başka bişeye bastı
    bioncekielement.firstElementChild.firstElementChild.setAttribute("d", "M2 2h20v20h-20z");
    bioncekielement.lastElementChild.textContent = "Durdur";
    tiklananelement.lastElementChild.lastElementChild.textContent = "Durdur";
    bioncekielement.firstElementChild.firstElementChild.firstElementChild.setAttribute("d", "M2 2h20v20h-20z");
    console.log("tet")
    clearInterval(sayac);
    turn = 0;
    i = 0;
  }
  */
  /*
  ---- Metin kutusu
bioncekielement.firstElementChild.firstElementChild.setAttribute("d", "M2 2h20v20h-20z"); // Kare
bioncekielement.lastElementChild.textContent = "Durdur";

bioncekielement.firstElementChild.firstElementChild.setAttribute("d", "M0.467468 9.16668V0.833344L9.27233 5.00001L0.467468 9.16668Z"); // Baslatma
bioncekielement.lastElementChild.textContent = "Dinle";
  --- gonderi
  bioncekielement.firstElementChild.firstElementChild.firstElementChild.setAttribute("d", "M2 2h20v20h-20z"); // Kare
  bioncekielement.lastElementChild.lastElementChild.textContent = "Durdur"

  bioncekielement.firstElementChild.firstElementChild.firstElementChild.setAttribute("d", "M0.467468 9.16668V0.833344L9.27233 5.00001L0.467468 9.16668Z"); // Baslatma
  bioncekielement.lastElementChild.lastElementChild.textContent = "Dinle"

  --- Paylai

  bioncekielement.firstElementChild.firstElementChild.setAttribute("d", "M2 2h20v20h-20z"); // Kare
  bioncekielement.lastElementChild.textContent = "Durdur";

  bioncekielement.firstElementChild.firstElementChild.setAttribute("d", "M0.467468 9.16668V0.833344L9.27233 5.00001L0.467468 9.16668Z"); // Baslatma
  bioncekielement.lastElementChild.textContent = "Dinle";



  */
  //console.log(bioncekielement)
  if(bioncekielement != "") {
    if(gonderituru == "gonderi" && bioncekielement.getAttribute('onclick') == "metincal('metinkutusu','metinkutusu',this)") {
      bioncekielement.firstElementChild.firstElementChild.setAttribute("d", "M0.467468 9.16668V0.833344L9.27233 5.00001L0.467468 9.16668Z"); // Baslatma
      bioncekielement.lastElementChild.textContent = "Dinle";
      tiklananelement.firstElementChild.firstElementChild.firstElementChild.setAttribute("d", "M2 2h20v20h-20z"); // Kare
      tiklananelement.lastElementChild.lastElementChild.textContent = "Durdur"
      //  console.log("Ana sayfada metin kutusundan bişi dinlerken diğer şeye tıkladı");
      clearInterval(sayac);
      turn = 0;
      //Ana sayfada metin kutusundan bişi dinlerken diğer şeye tıkladı
    } else if(gonderituru == "metinkutusu" && bioncekielement.getAttribute('onclick').split(",")[1] == "'gonderi'") {
      bioncekielement.firstElementChild.firstElementChild.firstElementChild.setAttribute("d", "M0.467468 9.16668V0.833344L9.27233 5.00001L0.467468 9.16668Z"); // Baslatma
      bioncekielement.lastElementChild.lastElementChild.textContent = "Dinle";
      tiklananelement.firstElementChild.firstElementChild.setAttribute("d", "M2 2h20v20h-20z"); // Kare
      tiklananelement.lastElementChild.textContent = "Durdur";
      clearInterval(sayac);
      turn = 0;
      //    console.log("Ana sayfada bi gönderi dinlerken yeni metin olşturdu")
      // Ana sayfada bi gönderi dinlerken yeni metin olşturdu
    } else if(gonderituru == "gonderi" && bioncekielement == tiklananelement) {
      // kendi kendine tıkladı adam;
      //  console.log(" kendi kendine tıkladı adam;")
      clearInterval(sayac);
    } else if(gonderituru == "gonderi" && bioncekielement.getAttribute('onclick').split(",")[1] == "'gonderi'" && turn != 0) {
      bioncekielement.firstElementChild.firstElementChild.firstElementChild.setAttribute("d", "M0.467468 9.16668V0.833344L9.27233 5.00001L0.467468 9.16668Z"); // Baslatma
      bioncekielement.lastElementChild.lastElementChild.textContent = "Dinle"
      //    console.log("gonderi dinlerken baska bi gonderiye tıkladi");
      clearInterval(sayac);
      turn = 0
      // gonderi dinlerken baska bi gonderiye tıkladi
    } else if(gonderituru == "paylasgonderi" && bioncekielement.getAttribute('onclick').split(",")[1] == "'gonderi'") {
      // paylas sayfasında ilk alltakini dinlerken sonra kendi mesajını
      clearInterval(sayac);
      turn = 0;
      bioncekielement.firstElementChild.firstElementChild.firstElementChild.setAttribute("d", "M0.467468 9.16668V0.833344L9.27233 5.00001L0.467468 9.16668Z"); // Baslatma
      bioncekielement.lastElementChild.lastElementChild.textContent = "Dinle"
      tiklananelement.firstElementChild.firstElementChild.setAttribute("d", "M2 2h20v20h-20z"); // Kare
      tiklananelement.lastElementChild.textContent = "Durdur";
      //    console.log("paylas sayfasında ilk alltakini dinledi sonra kendi mesajını")
    } else if(gonderituru == "gonderi" && bioncekielement.getAttribute('onclick') == "metincal('paylasilangonderimetni','paylasgonderi',this,true)") {
      // paylaş sayfasıdna kendi şeyini dinledrken başkasınkine bastı
      clearInterval(sayac);
      turn = 0;
      //    console.log("paylaş sayfasıdna kendi şeyini dinledrken başkasınkine bastı")
      tiklananelement.firstElementChild.firstElementChild.firstElementChild.setAttribute("d", "M2 2h20v20h-20z"); // Kare
      tiklananelement.lastElementChild.lastElementChild.textContent = "Durdur"
      bioncekielement.firstElementChild.firstElementChild.setAttribute("d", "M0.467468 9.16668V0.833344L9.27233 5.00001L0.467468 9.16668Z"); // Baslatma
      bioncekielement.lastElementChild.textContent = "Dinle";
    }
  }
  if(gonderituru == "metinkutusu" && turn == 0) {
    tiklananelement.firstElementChild.firstElementChild.setAttribute("d", "M2 2h20v20h-20z"); // Kare
    tiklananelement.lastElementChild.textContent = "Durdur";
    //    console.log("metin kutusu dinliyo")
  } else if(gonderituru == "metinkutusu" && turn != 0) {
    tiklananelement.firstElementChild.firstElementChild.setAttribute("d", "M0.467468 9.16668V0.833344L9.27233 5.00001L0.467468 9.16668Z"); // Baslatma
    tiklananelement.lastElementChild.textContent = "Dinle";
    //  console.log("metin kutusu durduruyo");
    turn++
    //çalan metin kutusu sesini durdurmaya çalışıyo
  } else if(gonderituru == "gonderi" && turn == 0) {
    //  console.log("gonderilerden birini dinlemeye basliyo");
    tiklananelement.firstElementChild.firstElementChild.firstElementChild.setAttribute("d", "M2 2h20v20h-20z"); // Kare
    tiklananelement.lastElementChild.lastElementChild.textContent = "Durdur"
    //    console.log(i, turn)
    // gonderilerden birini dinlemeye basliyo
  } else if(gonderituru == "gonderi" && turn != 0) {
    //    console.log("gonderilerden birini durduruyo");
    tiklananelement.firstElementChild.firstElementChild.firstElementChild.setAttribute("d", "M0.467468 9.16668V0.833344L9.27233 5.00001L0.467468 9.16668Z"); // Baslatma
    tiklananelement.lastElementChild.lastElementChild.textContent = "Dinle"
    turn++
    // gonderilerden birini durduruyo
  } else if(gonderituru == "paylasgonderi" && turn == 0) {
    //    console.log("paylasilan gönderiyi  baslatıyo")
    tiklananelement.firstElementChild.firstElementChild.setAttribute("d", "M2 2h20v20h-20z"); // Kare
    tiklananelement.lastElementChild.textContent = "Durdur";
    // paylasilan gönderiyi  baslatıyo
  } else if(gonderituru == "paylasgonderi" && turn != 0) {
    tiklananelement.firstElementChild.firstElementChild.setAttribute("d", "M0.467468 9.16668V0.833344L9.27233 5.00001L0.467468 9.16668Z"); // Baslatma
    tiklananelement.lastElementChild.textContent = "Dinle";
    //  console.log("paylasilan gönderiyi  durduruyo");
    turn++
    // paylasilan gönderiyi  durduruyo
  }
  if(gonderituru == 'gonderi' || gonderituru == 'paylasgonderi') {
    var gonderimetni = document.getElementById(divid).innerText.replace(/\n/g, " ");
  } else {
    var gonderimetni = document.getElementById(divid).value.replace(/\n/g, " ");
  }
  if(turn != 0) {
    //  console.log("durdur")
    clearInterval(sayac);
    i = 0;
    //  console.log(bioncekielement)
    turn = 0;
  } else {
    //console.log("caliyo")
    bioncekielement = tiklananelement;
    turn++;
    i = 0;
    //console.log(gonderimetni)
    sayac = setInterval(function() {
      if(i == gonderimetni.length) {
        clearInterval(sayac);
        turn = 0;
        i = 0;
        switch (gonderituru) {
          case "metinkutusu":
            bioncekielement.firstElementChild.firstElementChild.setAttribute("d", "M0.467468 9.16668V0.833344L9.27233 5.00001L0.467468 9.16668Z"); // Baslatma
            bioncekielement.lastElementChild.textContent = "Dinle";
            break;
          case "gonderi":
            bioncekielement.firstElementChild.firstElementChild.firstElementChild.setAttribute("d", "M0.467468 9.16668V0.833344L9.27233 5.00001L0.467468 9.16668Z"); // Baslatma
            bioncekielement.lastElementChild.lastElementChild.textContent = "Dinle"
            break;
          case "paylasgonderi":
            bioncekielement.firstElementChild.firstElementChild.setAttribute("d", "M0.467468 9.16668V0.833344L9.27233 5.00001L0.467468 9.16668Z"); // Baslatma
            bioncekielement.lastElementChild.textContent = "Dinle";
            break;
        }
      } else {
        var nota = notalar[gonderimetni[i]];
        if(gonderimetni[i] == " ") {
          //  console.log("bos")
        } else if(nota == undefined) {
          notacal(rastgelenotaal(notalar))
        } else {
          notacal(nota)
        }
        i++
      }
    }, 500)
  }
}

function notacal(nota) {
  var snd = new Audio("https://virtualpiano.net/wp-content/themes/twentyfourteen-child/newnotes/" + nota + ".mp3");
  snd.play();
}

function rastgelenotaal(obj) {
  var keys = Object.keys(obj)
  return obj[keys[keys.length * Math.random() << 0]];
};
enbegenilengonderilerial()

function gonderipaylas(guid) {
  window.open('gonderi.html#' + guid, '_blank');
}