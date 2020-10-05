function myFunction() {
    const rates = document.querySelectorAll("tr td:nth-child(n+5)")
    let selectedMatches = []
    let closeTheCoupon = 0

    // misli için select option ekle
    const select = document.getElementById('misli')
    for (let index = 1; index < 21; index++) {
        select.insertAdjacentHTML("beforeend", `<option value='${index}'>${index}</option>`)
    }

    rates.forEach(item => {
        item.addEventListener('click', () => {
            let rate = 1
            //CouponDetail Aç
            if (closeTheCoupon === 0) {
                document.getElementsByClassName('couponDetail')[0].style.display = 'block'
                document.getElementsByClassName('arrow')[0].classList.remove('up')
                document.getElementsByClassName('arrow')[0].classList.add('down')
                closeTheCoupon = 1
            }
            //seçilmiş maç yoksa
            if (selectedMatches.length === 0) {
                selectedMatches.push(item.parentElement)
            }
            //seçilmiş maç varsa
            else {
                const thereisMatch = selectedMatches.find(match => {
                    return match.id === item.parentElement.id
                })
                //aynı rowdan seçilmiş maç yoksa pushla
                if (!thereisMatch) {
                    selectedMatches.push(item.parentElement)
                }
                //aynı rowdan seçilmiş maç varsa son seçilenle arrayi güncelle ve eski maçı karttan kaldır
                if (thereisMatch) {
                    const withoutSame = selectedMatches.filter(match => {
                        return match.id !== item.parentElement.id
                    })
                    withoutSame.push(item.parentElement)
                    selectedMatches = withoutSame
                    const rowId = thereisMatch.id;
                    document.querySelector(`#${rowId} .getItem`).classList.remove('getItem');

                    const allCloseBtn = document.querySelectorAll('.close')
                    allCloseBtn.forEach(btn => {
                        const btngrandParent = btn.parentElement.parentElement.parentElement
                        const nameId = btngrandParent.id.slice(0, 6)
                        if (item.parentElement.id === nameId) {
                            btngrandParent.remove()
                        }
                    })
                }
            }

            document.getElementById('totalMatch').innerHTML = `Maç:${selectedMatches.length} Kolon:1`
            document.getElementById('ruleMbs').innerHTML = 3 - selectedMatches.length
            if (selectedMatches.length === 3) {
                document.getElementsByClassName('warning')[0].style.display = 'none'
                document.getElementsByClassName('play')[0].style.backgroundColor = 'green'
            }

            item.classList.toggle("getItem");

            //maç sonucu ve takımı getir
            const coupons = document.getElementsByClassName("couponList")[0]
            const rateValue = item.textContent
            const matchId = item.parentElement.id
            const team1 = document.querySelector(`#${matchId} .team1`).textContent
            const team2 = document.querySelector(`#${matchId} .team2`).textContent
            const index = [...item.parentElement.children].findIndex(x => {
                return x.className === "getItem"
            })

            const score = document.getElementById('head').children[index].textContent
            coupons.insertAdjacentHTML("afterbegin", `<div style="display: block;" id="${matchId}coupon"><div class="p-3 addedMatch" ><p>${team1}-${team2}</p><p><span class="dot close">x</span></p></div><div class="couponInfo p-3 addedMatch"><div><button class="button">3</button><button class="button outlined ml-1">B</button><p class="ml-1">Maç Sonucu:${score}</p></div><p>${rateValue}</p></div></div>`)

            //misli tıklandıgında hesaplamaları değiştir
            var selectedValue = document.getElementById('misli').value
            document.getElementById('misli').addEventListener("change", () => {
                selectedValue = document.getElementById("misli").value;
                document.getElementById('factor').innerHTML = `${selectedValue}`
                const maxGain = (rate * selectedValue).toFixed(2)
                document.getElementById('maxGain').innerHTML = `${maxGain} TL`
            })

            // Arrayin içindeki oranları carp
            selectedMatches.forEach(Element => {
                const rateValue = Element.querySelector('.getItem').textContent
                rate = (rateValue * rate).toFixed(2)
            });

            document.getElementById('totalRate').innerHTML = `${rate}`
            document.getElementById('totalRateHeader').innerHTML = ` Kuponum | T.oran ${rate}`

            // maksimum Kazanç
            const maxGain = (rate * selectedValue).toFixed(2)
            document.getElementById('maxGain').innerHTML = `${maxGain} TL`

            // kupondan mac kaldırma ve Array Güncelleme
            const allCloseBtn = document.querySelectorAll('.close')
            allCloseBtn.forEach(btn => {
                btn.addEventListener('click', () => {
                    let rate = 1
                    const btngrandParent = btn.parentElement.parentElement.parentElement
                    btngrandParent.remove()
                    const thereisMatch = selectedMatches.find(match => {
                        return match.id === btngrandParent.id.slice(0, 6)
                    })
                    const rowId = thereisMatch.id;
                    document.querySelector(`#${rowId} .getItem`).classList.remove('getItem');
                    const willRemove = selectedMatches.find(match => {
                        return match.id === btngrandParent.id.slice(0, 6)
                    })
                    if (willRemove) {
                        const deger = selectedMatches.filter(item => {
                            return item.id !== willRemove.id
                        })
                        selectedMatches = deger
                    }
                    selectedMatches.forEach(Element => {
                        const rateValue = Element.querySelector('.getItem').textContent
                        rate = (rateValue * rate).toFixed(2)
                    });
                    document.getElementById('totalRate').innerHTML = `${rate}`
                    document.getElementById('totalRateHeader').innerHTML = ` Kuponum | T.oran ${rate}`
                    const maxGain = (rate * selectedValue).toFixed(2)
                    document.getElementById('maxGain').innerHTML = `${maxGain} TL`

                    //bazı macları kupondan çıkar ve yeni misli seç
                    document.getElementById('misli').addEventListener("change", () => {
                        selectedValue = document.getElementById("misli").value;
                        document.getElementById('factor').innerHTML = `${selectedValue}`
                        const maxGain = (rate * selectedValue).toFixed(2)
                        document.getElementById('maxGain').innerHTML = `${maxGain} TL`
                    })

                    // tüm elemanları sildiğinde coupon tabını kapat
                    if (selectedMatches.length === 0 && closeTheCoupon === 1) {
                        document.getElementsByClassName('arrow')[0].classList.remove('down')
                        document.getElementsByClassName('arrow')[0].classList.add('up')
                        document.getElementsByClassName('couponDetail')[0].style.display = 'none'
                        rate = 0.00
                        closeTheCoupon = 0
                        document.getElementById('totalRateHeader').innerHTML = ` Kuponum | T.oran ${rate.toPrecision(3)}`
                    }

                    // kupondan maç sildiğinde eleman sayısını kontrol et 
                    if(selectedMatches.length<3){
                        document.getElementsByClassName('play')[0].style.backgroundColor = 'rgba(133, 131, 119, 0.336)'
                        document.getElementById('totalMatch').innerHTML = `Maç:${selectedMatches.length} Kolon:1`
                        document.getElementsByClassName('warning')[0].style.display = 'block'
                        document.getElementById('ruleMbs').innerHTML = 3 - selectedMatches.length
                    }
                })
            })
        })
    })

}

document.addEventListener("DOMContentLoaded", () => {
    myFunction();
});
