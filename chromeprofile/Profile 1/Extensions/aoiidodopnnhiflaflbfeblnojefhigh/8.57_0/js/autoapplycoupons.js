var auto_coupon_retailers = {
  apply_shopify: {
      preApplyCodes: function(callback) {
        console.log('shopify');
        const elTotal = $('.payment-due__price');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        const prevCode = $('.edit_checkout .reduction-code__text, .applied-discount__code').first().text();
        callback(prevValue,prevCode);
      },
      applyCode: function(code, callback) {
        if(document.querySelector('#checkout_discount_code')){
          const windowVariables = retrieveWindowVariables(["window.store_id"]);
          const store_id = windowVariables["window.store_id"];
          const cart_token = $('input[name="cart_token"]:last').val();
          const email = $('#checkout_email').val();
          const customer_email = email?email:'abcd@gmail.com';
          const url = 'https://'+window.location.hostname+'/shippingamount_responsive?store_id='+store_id+'&cart_token='+cart_token+'&discount_code='+code+'&customer_email='+customer_email;
          $.ajax({
            url: url,
            type: 'GET',
            success: (responseGet) => {
              const value = responseGet.total_amount;
              callback(value);
            },
            error: (xhr, status, error) => {
              callback(Number.POSITIVE_INFINITY);
            },
            fail: (xhr, status, error) => {
              callback(Number.POSITIVE_INFINITY);
            }
          });
        }else{
            const authenticity_token = $('input[name="authenticity_token"]:last').val();
            const url = 'https://'+window.location.hostname+$(".edit_checkout ").attr('action');
            $.ajax({
              url: url,
              type: 'POST',
              data: {
                _method: 'patch',
                authenticity_token: authenticity_token,
                'checkout[reduction_code]': code,
                'checkout[client_details][browser_width]': 1349,
                'checkout[client_details][browser_height]': 657,
                'checkout[client_details][javascript_enabled]': 1
              },
              success: () => {
                $.get('https://'+window.location.hostname+window.location.pathname, (responseGet) => {             
                  const elTotal = $(responseGet).find('.payment-due__price');
                  const value = elTotal.length > 0 ? 
                                convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                Number.POSITIVE_INFINITY;
                  callback(value);
                });
              },
              error: (xhr, status, error) => {
                console.log(error);
                callback(Number.POSITIVE_INFINITY);
              },
              fail: (xhr, status, error) => {
                console.log(error);
                callback(Number.POSITIVE_INFINITY);
              }
            });
         }
      },
      applyBestCode: (bestCode) => {
        document.querySelector('[name="checkout[reduction_code]"], #checkout_discount_code').value = bestCode;
        document.querySelector('[name="checkout[reduction_code]"], #checkout_discount_code').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        if(document.querySelector('[data-trekkie-id="apply_discount_button"], #apply-discount, #apply_discount')){
           setTimeout(function(){
            document.querySelector('[data-trekkie-id="apply_discount_button"], #apply-discount, #apply_discount').click(); 
          }, 500);
        }else{
          try {
            $("button:contains(Apply), button:contains(apply)").removeAttr("disabled"); 
            $("button:contains(Apply), button:contains(apply)").click(); }catch(e){
            $("button:contains(Apply), button:contains(apply)").click(); }
        }
      }
    },

    apply_fanaticsbrand: {
      preApplyCodes: function(callback) {
        console.log('fanaticsbrand');
        const elTotal = $('.total-line .shipping-val, [data-talos="labelOrderTotal"]');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
         callback(prevValue);
      },
      applyCode: function(code, callback) {
        this._applyCode(code, function(value) {
             callback(value);
          }); 
      },
      applyBestCode: function(bestCode) {
        document.querySelector('.coupon-giftcard-container [data-talos="textCoupon"]:last-child').value = bestCode;
        document.querySelector('.coupon-giftcard-container [data-talos="textCoupon"]:last-child').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('.coupon-giftcard-container button[data-talos="buttonCouponApply"]:last-child').click();
      },
      _applyCode: function(code, callback) {
        const windowVariables = retrieveWindowVariables(["__platform_data__"]);
        var cartID,value;
        if(document.location.pathname.indexOf("/cart") === 0){
           cartID = windowVariables['__platform_data__']['cart-data'].cart.cartInfo.cartId;
        }else{
           cartID = windowVariables['__platform_data__']['chkt-data'].initialPaymentStore.cart.cartInfo.cartId;
        }
        const csrf = decodeURI(document.cookie.split(';').filter(function(c) { return c.indexOf('xsrft') !== -1 })[0]).trim().split('=')[1];
    
      $.ajax({
          url: 'https://'+window.location.hostname+'/api/cart/'+cartID+'/promotion',
          type: 'POST',
          data: JSON.stringify({promoCode: code}),
           headers: {
                    'x-xsrf-token': csrf,
                    'x-frg-promo': code,
                    'x-frg-pt': 'CART',
                    'content-type': 'application/json;charset=UTF-8'
                  },
          success: (response) => {            
            this._getPrice(function(value) {
               callback(value);
            }); 
          },
          error: (xhr, status, error) => {
            this._getPrice(function(value) {
               callback(value);
            });
          }
        });
      },
      _getPrice: function(callback) {
        $.get('https://'+window.location.hostname+window.location.pathname, (responseGet) => {             
          const elTotal = $(responseGet).find('.total-line .shipping-val, [data-talos="labelOrderTotal"]');
          const value = elTotal.length > 0 ? 
                        convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
          callback(value);
        });
      }
    },

    apply_potterybrand: {
      preApplyCodes: function(callback) {
        var elTotal,prevValue,prevCode,prevCodeSelector;
         if(document.querySelector('checkout-app')){
            elTotal = document.querySelector('checkout-app').shadowRoot.querySelector('summary-view').shadowRoot.querySelector('summary-feature').shadowRoot.querySelector('[title="Total"]').shadowRoot.querySelector('.value').innerText;
            prevValue = elTotal.replace(/[^0-9.,]/g, '').trim();
            prevCodeSelector = document.querySelector('checkout-app').shadowRoot.querySelector('#payment-region #payment-content checkout-module-feature payment-region').shadowRoot.querySelector('promotion-view').shadowRoot.querySelector('promotion-applied-feature');
            if(prevCodeSelector){
              prevCode = prevCodeSelector.getAttribute('code');
              prevCodeSelector.shadowRoot.querySelector('[name="promotion-remove-button"]').shadowRoot.querySelector('button').click();
              setTimeout(function(){ 
                callback(prevValue,prevCode);
              }, 4000);   
             }else{
                callback(prevValue); 
             }             
         }else{
            elTotal = $('div.order-summary-tally-total-block div span.price-amount');
            prevValue = elTotal.length > 0 ? 
                          convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;        
            callback(prevValue); 
        }       
      },
      applyCode: function(code, callback) {
        if(document.querySelector('checkout-app')){          
          const promotionView = document.querySelector('checkout-app').shadowRoot.querySelector('#payment-region #payment-content checkout-module-feature payment-region').shadowRoot.querySelector('promotion-view');
          if(!promotionView.shadowRoot.querySelector('promotion-input-feature')){
            promotionView.shadowRoot.querySelector('promo-code-collapsible-feature').shadowRoot.querySelector('.promo-code-collapsible-container').click();
          }
          setTimeout(function(){
          promotionView.shadowRoot.querySelector('promotion-input-feature').shadowRoot.querySelector('[name="promotion-input"]').shadowRoot.querySelector('#promotion-input').value = '';
          promotionView.shadowRoot.querySelector('promotion-input-feature').shadowRoot.querySelector('[name="promotion-input"]').shadowRoot.querySelector('#promotion-input').value = code.toUpperCase();
          promotionView.shadowRoot.querySelector('promotion-input-feature').shadowRoot.querySelector('[name="promotion-input"]').shadowRoot.querySelector('#promotion-input').dispatchEvent(new MouseEvent('input', {bubbles: true}));
          promotionView.shadowRoot.querySelector('promotion-input-feature').shadowRoot.querySelector('[name="promotion-input"]').shadowRoot.querySelector('#promotion-input').dispatchEvent(new Event('change', {bubbles: true}));
          promotionView.shadowRoot.querySelector('promotion-input-feature').shadowRoot.querySelector('[name="promotion-input"]').shadowRoot.querySelector('#promotion-input').dispatchEvent(new Event('blur'));
          }, 200);
          setTimeout(function(){ 
            promotionView.shadowRoot.querySelector('promotion-input-feature').shadowRoot.querySelector('[name="promotion-input-button"]').shadowRoot.querySelector('button').click();
           }, 500);
          setTimeout(function(){
           const elTotal = document.querySelector('checkout-app').shadowRoot.querySelector('summary-view').shadowRoot.querySelector('summary-feature').shadowRoot.querySelector('[title="Total"]').shadowRoot.querySelector('.value').innerText;
           const value = elTotal.replace(/[^0-9.,]/g, '').trim(); 
           prevCodeSelector = document.querySelector('checkout-app').shadowRoot.querySelector('#payment-region #payment-content checkout-module-feature payment-region').shadowRoot.querySelector('promotion-view').shadowRoot.querySelector('promotion-applied-feature');
           if(prevCodeSelector){
            prevCodeSelector.shadowRoot.querySelector('[name="promotion-remove-button"]').shadowRoot.querySelector('button').click();
            setTimeout(function(){ 
              callback(value); 
              }, 4000);
             }else{
              callback(value); 
             } 
           }, 4000);
        }else{
          const formData = getFormFieldsAsJson(document.querySelector('#paymentInformation'));
          formData['promoCode'] = code;
          $.post('https://'+window.location.hostname+'/checkout/payment.html', formData, 
          (response) => {
            const orderValueEl = $(response).find('div.order-summary-tally-total-block div span.price-amount');
            const value = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
            const formData2 = formData;
            delete formData2['promoCode'];
            delete formData2['promoApply'];
            formData2['releasePromo'] = code.toUpperCase();
            formData2['removePromoButton'] = 'Remove';
            $.post('https://'+window.location.hostname+'/checkout/payment.html', formData2, 
               (response) => {
                callback(value);
            });        
          });
        }
      },
      applyBestCode: (bestCode) => {  
       if(document.querySelector('checkout-app')){     
          const promotionView = document.querySelector('checkout-app').shadowRoot.querySelector('#payment-region #payment-content checkout-module-feature payment-region').shadowRoot.querySelector('promotion-view');
          if(!promotionView.shadowRoot.querySelector('promotion-input-feature')){
            promotionView.shadowRoot.querySelector('promo-code-collapsible-feature').shadowRoot.querySelector('.promo-code-collapsible-container').click();
          }
          setTimeout(function(){
          promotionView.shadowRoot.querySelector('promotion-input-feature').shadowRoot.querySelector('[name="promotion-input"]').shadowRoot.querySelector('#promotion-input').value = '';
          promotionView.shadowRoot.querySelector('promotion-input-feature').shadowRoot.querySelector('[name="promotion-input"]').shadowRoot.querySelector('#promotion-input').value = bestCode.toUpperCase();
          promotionView.shadowRoot.querySelector('promotion-input-feature').shadowRoot.querySelector('[name="promotion-input"]').shadowRoot.querySelector('#promotion-input').dispatchEvent(new MouseEvent('input', {bubbles: true}));
          promotionView.shadowRoot.querySelector('promotion-input-feature').shadowRoot.querySelector('[name="promotion-input"]').shadowRoot.querySelector('#promotion-input').dispatchEvent(new Event('change', {bubbles: true}));
          promotionView.shadowRoot.querySelector('promotion-input-feature').shadowRoot.querySelector('[name="promotion-input"]').shadowRoot.querySelector('#promotion-input').dispatchEvent(new Event('blur'));
          }, 200);
           setTimeout(function(){ 
            promotionView.shadowRoot.querySelector('promotion-input-feature').shadowRoot.querySelector('[name="promotion-input-button"]').shadowRoot.querySelector('button').click();
           }, 500);    
       }else{
          document.querySelector('#promoCode').value = bestCode.toUpperCase();
          document.querySelector('#promoCode').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
          document.querySelector('#applyPromo').click();
        }
      }
    },

  magestore: {
    removePrevCode: function(code, callback) {
      if(window.location.href.indexOf("cart") > -1){
        const url = $('#discount-coupon-form').attr('action');
        const form_key = $('[name="form_key"]').val();
        $.post(url, { remove: 1, coupon_code: code, form_key:form_key }, 
        (response) => {  callback(); }).fail(function() { callback(); });
      }else{
        const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
        const quoteId = windowVariables["window.checkoutConfig"].quoteId;
        const customerData = windowVariables["window.checkoutConfig"].customerData;
        const storeCode = windowVariables["window.checkoutConfig"].storeCode;
        var url;
        if(customerData.id){
          url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/carts/mine/coupons';
        }else{
          url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/guest-carts/'+quoteId+'/coupons';
        }
        $.ajax({
          url: url,
          type: 'DELETE',
          success: (response) => { callback(); },
          error: (response) => { callback(); }
        });
      }           
    },
    preApplyCodes: function(callback) {
      console.log('magestore');
      const elTotal = $('.grand.totals .price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#coupon_code, #discount-code').val();
      if(prevCode != ''){
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
      if(window.location.href.indexOf("cart") > -1){
        $.get('https://'+window.location.hostname+window.location.pathname, (responseGet) => {
          var index1 = 24;
          var index2 = 38;
          if(window.location.hostname.indexOf("physiciansformula") > -1 || window.location.hostname.indexOf("wetnwildbeauty") > -1 || window.location.hostname.indexOf("avenue") > -1 || window.location.hostname.indexOf("biffi") > -1  || window.location.hostname.indexOf("karmaloop") > -1){
            index1 = 22;
            index2 = 23;
          }else if(window.location.hostname.indexOf("4inkjets") > -1){
            index1 = 24;
            index2 = 36;
          }
          const checkoutconfigindex = responseGet.indexOf("window.checkoutConfig");
          const customerDataindex = responseGet.indexOf("window.customerData");
          const finalIndex = customerDataindex-checkoutconfigindex;
          const data = JSON.parse(responseGet.substr(responseGet.indexOf("window.checkoutConfig")+index1, finalIndex-index2));
          const value = data.totalsData.base_grand_total;
          this.removePrevCode(code, () => callback(value));
        }).fail(function() { callback(Number.POSITIVE_INFINITY); });  
       }else{
        const ts = Math.round(new Date().getTime());
        const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
        const quoteId = windowVariables["window.checkoutConfig"].quoteId;
        const customerData = windowVariables["window.checkoutConfig"].customerData;
        const storeCode = windowVariables["window.checkoutConfig"].storeCode;
        var url;
        if(customerData.id){
          url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/carts/mine/payment-information?_='+ts;
        }else{
          url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/guest-carts/'+quoteId+'/payment-information?_='+ts;
        }
        $.ajax({
            url: url,
            type: 'GET',
            success: (response) => {                  
               const value = response.totals.base_grand_total;
               callback(value.toFixed(2));
            },error: () => { callback(Number.POSITIVE_INFINITY); }
          });
       }   
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
        location.reload();
      }) ;
    },
    _applyCode: (code, callback) => {
      if(window.location.href.indexOf("cart") > -1){
        const form_key = $('[name="form_key"]').val();
        const url = $('#discount-coupon-form').attr('action');
        $.ajax({
          url: url,
          type: 'POST',
          data: { remove: 0, coupon_code: code, form_key:form_key },
          success: () => { callback(); },
          error: () => { callback(); }
        });
      }else{
        const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
        const quoteId = windowVariables["window.checkoutConfig"].quoteId;
        const customerData = windowVariables["window.checkoutConfig"].customerData;
        const storeCode = windowVariables["window.checkoutConfig"].storeCode;
        var url;
        if(customerData.id){
          url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/carts/mine/coupons/'+code;
        }else{
          url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/guest-carts/'+quoteId+'/coupons/'+code;
        }
        $.ajax({
          url: url,
          type: 'PUT',
          success: () => { callback(); },
          error: () => { callback(); }
        });
      }
    },
  },

  magestore2: {
    removePrevCode: function(code, callback) {
      const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
      const quoteId = windowVariables["window.checkoutConfig"].quoteData.entity_id;
      const customerData = windowVariables["window.checkoutConfig"].customerData;
      const storeCode = windowVariables["window.checkoutConfig"].storeCode;
      var url;
      if(customerData.id){
        url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/carts/mine/coupons';
      }else{
        url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/guest-carts/'+quoteId+'/coupons';
      }
      $.ajax({
        url: url,
        type: 'DELETE',
        success: (response) => { callback(); },
        error: (response) => { callback(); }
      });          
    },
    preApplyCodes: function(callback) {
      console.log('magestore2');
      const elTotal = $('.grand.totals .price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#coupon_code, #discount-code').val();
      if(prevCode != ''){
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
      const ts = Math.round(new Date().getTime());
      const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
      const quoteId = windowVariables["window.checkoutConfig"].quoteData.entity_id;
      const customerData = windowVariables["window.checkoutConfig"].customerData;
      const storeCode = windowVariables["window.checkoutConfig"].storeCode;
      var url;
      if(customerData.id){
        url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/carts/mine/payment-information?_='+ts;
      }else{
        url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/guest-carts/'+quoteId+'/payment-information?_='+ts;
      }
      $.ajax({
          url: url,
          type: 'GET',
          success: (response) => {                  
           const value = response.totals.base_grand_total;
           callback(value.toFixed(2));
          },error: () => { callback(Number.POSITIVE_INFINITY); }
        });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
        location.reload();
      }) ;
    },
    _applyCode: (code, callback) => {
      const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
      const quoteId = windowVariables["window.checkoutConfig"].quoteData.entity_id;
      const customerData = windowVariables["window.checkoutConfig"].customerData;
      const storeCode = windowVariables["window.checkoutConfig"].storeCode;
      var url;
      if(customerData.id){
        url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/carts/mine/coupons/'+code;
      }else{
        url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/guest-carts/'+quoteId+'/coupons/'+code;
      }
      $.ajax({
        url: url,
        type: 'PUT',
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
  },

  magestore3: {
    preApplyCodes: function(callback) {
      console.log('magestore3');
      const elTotal = $('#shopping-cart-totals-table tfoot tr:last-child td:last-child .price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        const locationUrl = location.href;
        $.get(locationUrl , (responseGet) => {
          const elTotal = $(responseGet).find('#shopping-cart-totals-table tfoot tr:last-child td:last-child .price');
          const value = elTotal.length > 0 ? 
                convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                Number.POSITIVE_INFINITY;              
          callback(value);
        });
      });
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
        location.reload();
      }) ;
    },
    _applyCode: (code, callback) => {
      const url = $('#discount-coupon-form').attr('action');
      $.ajax({
        url: url,
        type: 'POST',
        xhr: function() {
          var xhr = jQuery.ajaxSettings.xhr();
          var setRequestHeader = xhr.setRequestHeader;
          xhr.setRequestHeader = function(name, value) {
              if (name == 'X-Requested-With') return;
              setRequestHeader.call(this, name, value);
          }
          return xhr;
        },
        data: {
          remove: 0,
          coupon_code: code
        },
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
  },

  apply_merrellbrand: {
    preApplyCodes: function(callback) {
      console.log('merrellbrand');
      const elTotal = $('.order-total .textalign-right, .order-total td:last-child');
      const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      if(window.location.href.indexOf("cart") > -1){
         const windowVariables = retrieveWindowVariables(["CQuotient"]);
         const siteId = windowVariables.CQuotient.siteId;
          $.get('https://'+window.location.hostname+'/on/demandware.store/Sites-'+siteId+'-Site/default/Cart-AddCoupon?couponCode='+code+'&format=ajax', 
            (response) => {
             const value = response.basketTotal;
             callback(value);               
            });
        }else{
           const windowVariables = retrieveWindowVariables(["data"]);
           const url = windowVariables.data.urls.applyPromoCode;
           const csrf_token = windowVariables.data.csrfToken;
             $.ajax({
                url: url,
                type: 'POST',
                data : {code: code, csrf_token: csrf_token},
                headers: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: (response) => {
                  const elTotal = response.cart.totals.orderTotal;
                  const value = convertNumbers(elTotal.replace( /[^0-9.,]/g, '').trim());
                  callback(value);
                },
                error: (xhr, status, error) => {
                  console.log(error);
                  callback(Number.POSITIVE_INFINITY);
                }
              });
        }
    },
    applyBestCode: function(bestCode) {
      location.reload();
    }
  },

  apply_signetbrand: {
    preApplyCodes: function(callback) {
      console.log('signetbrand');
      const elTotal = $('.grand-total:last-child, .checkout-order-summary:last-child .totals span');
      const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) :  
                      Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      const formData = getFormFieldsAsJson(document.querySelector('form#promoForm'));       
      formData['voucherCode'] = code;
      const url = $('form#promoForm').attr('action');
      $.ajax({
        url: 'https://'+window.location.hostname+url,
        type: 'POST',
        xhr: function() {
              var xhr = jQuery.ajaxSettings.xhr();
              var setRequestHeader = xhr.setRequestHeader;
              xhr.setRequestHeader = function(name, value) {
                  if (name == 'X-Requested-With') return;
                  setRequestHeader.call(this, name, value);
              }
              return xhr;
          },
        data: formData,
        success: (data, textStatus, request) => {
          const elTotal = $(data).find('.grand-total:last-child, .checkout-order-summary:last-child .totals span');
          const value = elTotal.length > 0 ? 
                        convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
          callback(value);
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#promoCode').value = bestCode;
      document.querySelector('#promoCode').dispatchEvent(new MouseEvent('input', {bubbles: true}));
      document.querySelector('#promo-btn').click()
    }
  },

  apply_roamansbrand: {
    preApplyCodes: function(callback) {
      console.log('roamansbrand');
      const elTotal = $('.order-total.order-detail span.order-value.value');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#coupon-submitted .value, #dwfrm_billing .cartcoupon .value').first().text();       
      if(window.location.href.indexOf("cart") > -1){  
        const url = $('#cart-items-form').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
        formData['dwfrm_cart_coupons_i0_deleteCoupon'] = 'Remove';
        $.post(url, formData, 
          (response) => {
             callback(prevValue,prevCode);
        });
      }else{
        if(document.querySelector('#remove-coupon')){
          const removeId = $('#remove-coupon').attr('data-uuid');
          const removeUrl = 'https://'+window.location.hostname+'/on/demandware.store/Sites-oss-Site/default/Cart-RemoveCouponJson?uuid='+removeId+'&format=ajax;'                 
          $.post(removeUrl, 
            (responsePost) => {
              callback(prevValue,prevCode); 
          });
        }else{
          callback(prevValue,prevCode);
        }          
      }
    },
    applyCode: function(code, callback) {
      if(window.location.href.indexOf("cart") > -1){    
        this.preApplyCodes(() => {
          const url = $('#cart-items-form').attr('action');
          const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
          formData['dwfrm_cart_couponCode'] = code;
          formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
            $.post(url, formData, 
            (responsePost) => {
              $.get('https://'+window.location.hostname+'/cart', (response) => {
                const orderValueEl = $(response).find('.order-total.order-detail span.order-value.value');
                const value = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;  
                 callback(value);                 
              });
            }); 
        });
      }else{
        $.get('https://'+window.location.hostname+'/on/demandware.store/Sites-oss-Site/default/Cart-AddCouponJson?couponCode='+code+'&format=ajax', 
        (responseGet) => {
           const el = $(responseGet).find('#remove-coupon');
              if (el !== null && el !== undefined && el.length > 0) {
                const removeId = el.attr('data-uuid');
                $.get('https://'+window.location.hostname+'/on/demandware.store/Sites-oss-Site/default/COBilling-UpdateSummary?format=ajax&stepCount=2', 
                  (response) => {
                    const orderValueEl = $(response).find('.order-total.order-detail span.order-value.value');
                    const value = orderValueEl.length > 0 ? 
                                convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                                Number.POSITIVE_INFINITY;
                     const removeUrl = 'https://'+window.location.hostname+'/on/demandware.store/Sites-oss-Site/default/Cart-RemoveCouponJson?uuid='+removeId+'&format=ajax;'                 
                    $.post(removeUrl, 
                      (responsePost) => {
                        callback(value); 
                    });
                  });
              }else{ callback(Number.POSITIVE_INFINITY); }
        });
      }
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#dwfrm_cart_couponCode, #dwfrm_billing_couponCode').value = bestCode;
      document.querySelector('#dwfrm_cart_couponCode, #dwfrm_billing_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('#add-coupon').click();
    }
  },

  apply_chicosbrand: {
    preApplyCodes: function(callback) {
      console.log('chicosbrand');
      const elTotal = $('#sb-sum-total .sb-price, [data-review-info="orderTotal"]');
      const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
    if(window.location.href.indexOf("cart") > -1){
      const formData = getFormFieldsAsJson(document.querySelector('form[name="couponForm"]'));
      const url = $('form[name="couponForm"]').attr('action');     
      formData['claimCodeField'] = code;
      formData['/atg/commerce/promotion/CouponFormHandler.claimCoupon'] = 'Apply';
      formData['_D:/atg/commerce/promotion/CouponFormHandler.claimCoupon'] = '';
      $.ajax({
        url: url+'&isCartPage=-1&reprice=true',
        type: 'POST',
        data: formData,
        success: (data, textStatus, request) => {
              const total = data.itemsTotalNoShipping;
              const value = convertNumbers(total.replace( /[^0-9.,]/g, '').trim());
              callback(value);
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
    }else{
      const formData = getFormFieldsAsJson(document.querySelector('form[name="coupon"]'));
      const url = $('form[name="coupon"]').attr('action'); 
      formData['/atg/commerce/promotion/CouponFormHandler.couponClaimCode'] = code;
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: (data, textStatus, request) => {
              const total = data.order.orderDetails.orderTotal;
              const value = convertNumbers(total.replace( /[^0-9.,]/g, '').trim());
              callback(value);
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      }
    },
    applyBestCode: function(bestCode) {
      location.reload();
    }
  },

  apply_thehutsbrand: {
    preApplyCodes: function(callback) {
      console.log('thehutsbrand');
      const elTotal = $('.responsiveBasket_totalValue');
      const prevValue = elTotal.length > 0 ? 
              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
              Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
       $.post('https://'+window.location.hostname+'/my.basket', {
          discountCode: code
        }, (response) => {
          const elTotal = $(response).find('.responsiveBasket_totalValue');
          const value = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
          callback(value);
            if($(response).find('.responsiveBasket_removeItem-discount')){
              var url = $(response).find('.responsiveBasket_removeItem-discount').attr('href');
               $.get(url, () => {
               });
            }
        });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#discountcode').value = bestCode;
      document.querySelector('#discountcode').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('#add-discount-code').click();
    }
  },

  avidmax: {
    preApplyCodes: function(callback) {
      console.log('avidmax');
      const elTotal = $('.order-summary__total .order-summary__value, .cart-total-value.cart-total-grandTotal span, .cart-priceItem--total [data-test="cart-price-value"], .c-cart-total-value.c-cart-total-grandTotal span ');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       callback(value)      
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();
     }.bind(this));
    },
    _applyCode: (code, callback) => {
      const windowVariables = retrieveWindowVariables(["BCData"]);
      const csrf_token = windowVariables.BCData.csrf_token;
      var url;
      if(window.location.href.indexOf("cart") > -1){
        url = 'https://'+window.location.hostname+'/remote/v1/apply-code';
        $.ajax({
          url: url,
          type: 'POST',
          data: {code: code},
          headers: {
                'x-xsrf-token': csrf_token
              },
          success: (response, status, xhr) => {
          if(response.data && response.data.status=='success'){
           $.ajax({
              url: 'https://'+window.location.hostname+'/cart.php',
              type: 'GET',
              success: (responseGet, status, xhr) => {
                const elTotal = $(responseGet).find('.order-summary__total .order-summary__value, .cart-total-value.cart-total-grandTotal span, .c-cart-total-value.c-cart-total-grandTotal span ');
                const value = elTotal.length > 0 ? 
                          convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
                callback(value);
              }
            });
          }else{ callback(Number.POSITIVE_INFINITY); }
        },
        error: (error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });
     }else{
      $.ajax({
        url: 'https://'+window.location.hostname+'/api/storefront/checkout-settings',
        type: 'GET',
        headers: {
              'x-xsrf-token': csrf_token,
               'x-api-internal': 'This API endpoint is for internal use only and may change in the future'
            },
        success: (responseGet, status, xhr) => {
          const checkoutId = responseGet.context.checkoutId; 
           url = 'https://'+window.location.hostname+'/api/storefront/checkouts/'+checkoutId+'/coupons?include=cart.lineItems.physicalItems.options%2Ccart.lineItems.digitalItems.options%2Ccustomer%2Ccustomer.customerGroup%2Cpayments%2Cpromotions.banners%2Cconsignments.availableShippingOptions';
           $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify({couponCode: code}),
            headers: {
                  'x-xsrf-token': csrf_token,
                  'content-type': 'application/json'
                },
            success: (response, status, xhr) => {
              const value = response.outstandingBalance;
              callback(value);
          },error: (error) => {
            callback(Number.POSITIVE_INFINITY);
          }
        });
       }
      });           
     }                
    }
  },

  apply_shopify2: {
    preApplyCodes: function(callback) {
      console.log('shopify2');
      const elTotal = $('.payment-due__price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('.applied-reduction-code__information');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.innerText;
        callback(prevValue,prevCode);
      }else{
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {
      const formData = getFormFieldsAsJson(document.querySelector('.order-summary__section--discount .edit_checkout'));
      const url = $(".order-summary__section--discount .edit_checkout").attr('action');
      formData['applyCouponCode'] = code;
      $.ajax({
        url: 'https://'+window.location.hostname+url,
        type: 'POST',
        data: formData,
        contentType: 'application/x-www-form-urlencoded;',
        success: (response) => {            
         const elTotal = $(response).find('.payment-due__price');
         const value = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: (xhr, status, error) => {
          console.log(error);
          callback(Number.POSITIVE_INFINITY);
        }
      });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#checkout_reduction_code').value = bestCode;
      document.querySelector('#checkout_reduction_code').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
      document.querySelector('[name="checkout_reduction_code"]').click();
    }
  },

  wayrates: {
    preApplyCodes: function(callback) {
      console.log('wayrates');
      const elTotal = $('.payment-due__price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('.applied-reduction-code__information');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.innerText;
        callback(prevValue,prevCode);
      }else{
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {
      const windowVariables = retrieveWindowVariables(["window.javaVariable"]);
      const cartno = windowVariables["window.javaVariable"].cartNo;
      const url = '/checkout/unify/'+cartno+'.html';
      $.ajax({
        url: 'https://'+window.location.hostname+url,
        type: 'POST',
        data: JSON.stringify({'applyCouponCode' : code}),
        contentType: 'application/json',
        success: (response) => {        
         const elTotal = $(response).find('.payment-due__price');
         const value = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: (xhr, status, error) => {
          console.log(error);
          callback(Number.POSITIVE_INFINITY);
        }
      });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#checkout_reduction_code').value = bestCode;
      document.querySelector('#checkout_reduction_code').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
      $("button:contains(Apply)").click();
    }
  },

 ghbassbrand: {
    id: 14429, 
    preApplyCodes: function(callback) {
      console.log('ghbassbrand');
      const elTotal = $('div#EstTaxShipItemTable_estBasketTotal, .ml-summary-total .ml-accordion-summary-item-value');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.last().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      if(window.location.href.indexOf("basket.do") > -1){
        $.ajax({
          url: 'https://'+window.location.hostname+'/basket.do?method=applySourceCode&r=0.8716907298950933',
          type: 'POST',
          data: {sourceCode: code},
          success: () => {
            $.ajax({
              url: 'https://'+window.location.hostname+'/basket.do',
              type: 'GET',
              success: (response) => {
                const elTotal = $(response).find('div#EstTaxShipItemTable_estBasketTotal');
                const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.last().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
                callback(value);
              },
              error: (xhr, status, error) => {
                callback(Number.POSITIVE_INFINITY);
              }
            })
          },
          error: (xhr, status, error) => {
            callback(Number.POSITIVE_INFINITY);
          }
        });
    }else{
      $.ajax({
        url: 'https://'+window.location.hostname+'/checkout/accordion.do?method=applySourceCode',
        type: 'POST',
        data: {sourceCode: code},
        success: (response) => {
            const elTotal = response.targetDataForUpdate['2'].data.orderTotals['0'].value;
            const value = elTotal.length > 0 ? 
                      convertNumbers(elTotal.replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
            callback(value);
        },
        error: (xhr, status, error) => {
          console.log(error);
          callback(Number.POSITIVE_INFINITY);
        }
      });
     }
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#sourceCode').value = bestCode;
      document.querySelector('#sourceCode').dispatchEvent(new MouseEvent('input', {bubbles: true}));
      document.querySelector('input.sourceCodeApplyBtn, .ml-payment-source-code-apply .ml-secondary-button-understated').click();
    }
  },

  wilsonsleather: {
    id: 1774, 
    preApplyCodes: function(callback) {
      const elTotal = $('div#EstTaxShipItemTable_estBasketTotal, .ml-summary-total .ml-accordion-summary-item-value');
      const prevValue = elTotal.length > 0 ? 
              convertNumbers(elTotal.last().text().replace( /[^0-9.,]/g, '').trim()) : 
              Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      if(window.location.href.indexOf("basket.do") > -1){
         const csrf = $('meta[name="_csrf"]').attr('content');
        $.ajax({
          url: 'https://'+window.location.hostname+'/basket.do?method=applySourceCode&r=0.7030118057703232',
          type: 'POST',
          data: {sourceCode: code},
           headers: {
            'x-xsrf-token': csrf
          },
          success: () => {
            $.ajax({
              url: 'https://'+window.location.hostname+'/basket.do',
              type: 'GET',
              success: (response) => {
                const elTotal = $(response).find('div#EstTaxShipItemTable_estBasketTotal');
                const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
                callback(value);
              },
              error: (xhr, status, error) => {
                callback(Number.POSITIVE_INFINITY);
              }
            })
          },
          error: (xhr, status, error) => {
            callback(Number.POSITIVE_INFINITY);
          }
        });
    }else{
      const csrf = $('meta[name="_csrf"]').attr('content');
      $.ajax({
        url: 'https://www.wilsonsleather.com/basket.do',
        type: 'POST',
        data: {method:'applySourceCode', sourceCode: code},
        headers: {
          'x-xsrf-token': csrf
        },
        success: (response) => {
           $.ajax({
            url: 'https://www.wilsonsleather.com/checkout/accordioncheckout.do?method=view',
            type: 'GET',
            success: (responseget) => {
              const elTotal = $(responseget).find('.ml-recommendation-page-context').attr('data-ml-recommendation-page-context');
              const total = JSON.parse(elTotal);
              const value = total.amount;
              $.get('https://www.wilsonsleather.com/sourcecode.do?method=reomoveSourceCode&sourceCode='+code, 
              (data) => {
                callback(value);
              });
            },
            error: (xhr, status, error) => {
              callback(Number.POSITIVE_INFINITY);
            }
          }) 
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });
     }
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#sourceCode').value = bestCode;
      document.querySelector('#sourceCode').dispatchEvent(new MouseEvent('input', {bubbles: true}));
      document.querySelector('input.sourceCodeApplyBtn, .ml-checkout-source-code-button .ml-secondary-button').click();
    }
  }, 

    '1800petmeds': {
      id: 264,
      preApplyCodes: function(callback) {
        const elTotal = $('div.checkout div.top div.price');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        
        callback(prevValue);
      },
      applyCode: function(code, callback) {      
        const formData = getFormFieldsAsJson(document.querySelector('div.checkout form[name="couponForm_full"]'));
        formData['coupon'] = code;
        $.post('https://www.1800petmeds.com/cart.jsp?_DARGS=/cart.jsp.coupon_full', formData, 
          () => {
            const url = 'https://www.1800petmeds.com/cart.jsp';
            $.get(url, 
              (response) => {
                const elTotal = $(response).find('div.checkout div.top div.price');
                const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
                callback(value);
              });
          });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#coupon_full').value = bestCode;
        document.querySelector('#coupon_full').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('form[name="couponForm_full"]').submit();
      }
    },
  
    allivet: {
      id: 24524,
      getServiceToken: function(callback) {
        $.ajax({
          url: 'https://www.allivet.com/ActionService.asmx/GetGlobalConfig',
          type: 'POST',
          dataType: 'json',
          headers: {
            'accept': 'application/json, text/javascript, */*; q=0.0',
            'content-type': 'application/json; charset=utf-8'
          },
          success: (response) => {
            if (response !== null && response.d !== undefined && response.d !== null) {
              const values = JSON.parse(response.d);
              this.allivetToken = values.find((element) => {
                return element.Key === 'Service.Token';
              }).Value;
              callback();
            } else {
              callback();
            }
          },
          error: (xhr, status, error) => {
            callback();
          }
        });
      },
      preApplyCodes: function(callback) {
        const elTotal = $('#sCartTotal');
        const prevValue = elTotal.length > 0 ? 
                          convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
        var removeCoupon = function(token) {
          $.ajax({
            url: 'https://www.allivet.com/ActionService.asmx/Allivet_RemoveCartCoupon',
            type: 'POST',
            headers: {
              'token': token,
              'content-type': 'application/json; charset=utf-8'
            },
            success: () => {
              callback(prevValue);
            },
            error: (xhr, status, error) => {
              console.log(error);
              callback(prevValue);
            }
          });
        }
        if (this.allivetToken !== undefined && this.allivetToken !== null) {
          removeCoupon(this.allivetToken);
        } else {
          this.getServiceToken(() => removeCoupon(this.allivetToken));
        }
      },
      applyCode: function(code, callback) {
        $.ajax({
          url: 'https://www.allivet.com/ActionService.asmx/Allivet_UpdateCartCoupon',
          type: 'POST',
          data: JSON.stringify({CouponCode: code, CurrentUser: 'website'}),
          dataType: 'json',
          headers: {
            'token': this.allivetToken,
            'content-type': 'application/json; charset=utf-8'
          },
          success: () => {
            $.ajax({
              url: 'https://www.allivet.com/ActionService.asmx/Allivet_CartHTML',
              type: 'POST',
              data: JSON.stringify({SizeMode: 'FullSize'}),
              dataType: 'json',
              headers: {
                'token': this.allivetToken,
                'content-type': 'application/json; charset=utf-8'
              },
              success: (response) => {
                if (response && response.d !== undefined && response.d !== null) {
                  if (response.d.length >= 2) {
                    const cartHtmlContent = response.d[1];
                    const elTotal = $(cartHtmlContent).find('#sCartTotal');
                    const value = elTotal.length > 0 ? 
                                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                      Number.POSITIVE_INFINITY;
                    this.preApplyCodes(() => {
                      callback(value);
                    });
                    return;
                  }
                }
                callback(Number.POSITIVE_INFINITY);
              },
              error: (xhr, status, error) => {
                console.log(error);
                callback(Number.POSITIVE_INFINITY);
              }
            });
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
        });
        
      },
      applyBestCode: function(bestCode) {
        $.ajax({
          url: 'https://www.allivet.com/ActionService.asmx/Allivet_UpdateCartCoupon',
          type: 'POST',
          data: JSON.stringify({CouponCode: bestCode, CurrentUser: 'website'}),
          dataType: 'json',
          headers: {
            'token': this.allivetToken,
            'content-type': 'application/json; charset=utf-8'
          },
          success: () => {
            location.reload();
          }
        });
      }
    },
  
    banggood: {
      id: 6980,
      preApplyCodes: function(callback) {
        const elTotal = $('.total-payment-wrap .price');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        this.preApplyCodes(() => {
          $.post('https://'+window.location.hostname+'/index.php', {
            com: 'shopcartnew',
            t: 'useCoupon',
            coupon_code: code,
            step: 2,
            useCoupstep: 2,
            clearCoupon: ''
          }, (response) => {
            const data = JSON.parse(response);
            const html = data.html;
            const elTotal = $(html).find('.total-payment-wrap .price');
            var value = Number.POSITIVE_INFINITY;
            if (elTotal.length > 0) {
              value = convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim());
            }
            callback(value);
          });
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('.coupon-code-input input').value = bestCode;
        document.querySelector('.coupon-code-input input').dispatchEvent(new Event('input', { bubbles: true } ));
        $('.coupon-code-input button, .order-total-list div:contains(Coupon Discount)').click();
      }
    },

    bathandbodyworks: {
      id: 3516,
      preApplyCodes: (callback) => {
        const orderValueEl = $('.cart-order-totals .order-total .order-value');
        const prevValue = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {
        const url = $('#cart-items-form').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
        formData['dwfrm_cart_couponCode'] = code;
        formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
        $.post(url, formData, 
          (response) => {
            const orderValueEl = $(response).find('.cart-order-totals .order-total .order-value');
            const value = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
            callback(value);
          });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#dwfrm_cart_couponCode').value = bestCode;
        document.querySelector('#dwfrm_cart_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('#add-coupon').click();
      }
    },

    belk: {
      id: 7417,
      removePrevCode: function(code, uuid, callback) {
        const removeCouponUrl = $('.delete-coupon-confirmation-btn').attr('data-action');
        const url = 'https://'+window.location.hostname+removeCouponUrl + '?code=' + code + '&uuid=' + uuid; 
        $.ajax({
          url: url,
          type: 'GET',
          success: () => { callback(); },
          error: () => { callback(); }
        });
      },
      preApplyCodes: (callback) => {
        const orderValueEl = $('.order-totals-table .order-total .order-value');
        const prevValue = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
        const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
        formData['dwfrm_cart_coupons_i0_deleteCoupon'] = 'Remove';
        $.post('https://www.belk.com/missing-coupon/', formData, 
          (response) => {
            callback(prevValue);
        });
      },
      applyCode: (code, callback) => {
        const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
        formData['dwfrm_cart_couponCode'] = code;
        formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
        $.post('https://www.belk.com/missing-coupon/', formData, 
          (response) => {
            const orderValueEl = $(response).find('.order-totals-table .order-total .order-value');
            const value = orderValueEl.length > 0 ? 
                              convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
            callback(value);
          });
      },
      applyBestCode: (bestCode) => {
        location.reload();
      }
    },

    skiphop: {
      id: 5543,
      preApplyCodes: (callback) => {
        const orderValueEl = $('#orderTotal');
        const prevValue = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {
        const url = $('#applyPromos').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('#applyPromos'));
        formData['dwfrm_cart_couponCode'] = code;
        formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
        $.post(url, formData, 
          (response) => {
            const orderValueEl = $(response).find('#orderTotal');
            const value = orderValueEl.length > 0 ? 
                              convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
            callback(value);
            const formData2 = formData;
            delete  formData2['dwfrm_cart_couponCode'];
            delete  formData2['dwfrm_cart_addCoupon'];
            formData2['dwfrm_cart_coupons_i0_deleteCoupon'] = 'Remove';
              $.post(url, formData2, 
                (response) => {
                 
              });
          });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#dwfrm_cart_couponCode').value = bestCode;
        document.querySelector('#dwfrm_cart_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('#add-coupon').click();
      }
    },

    ediblearrangements: {
      id: 7439,
      preApplyCodes: (callback) => {
        const orderValueEl = $('.GrandTotal');
        console.log(orderValueEl);
        const prevValue = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) :
                          Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {
        const url = 'https://www.ediblearrangements.com/fruit-cart.aspx';
        const formData = getFormFieldsAsJson(document.querySelector('#aspnetForm'));
        formData['ctl00$cpBody$rptSale$ctl00$txtCoupon'] = code;
        formData['ctl00$cpBody$rptSale$ctl00$btnApplyCoupon'] = 'Apply';

        $.post(url, formData, 
          (response) => {
            const orderValueEl = $(response).find('.GrandTotal');
            const value = orderValueEl.length > 0 ? 
                              convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
            callback(value);
          });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('input[name="ctl00$cpBody$rptSale$ctl00$txtCoupon"]').value = bestCode;
        document.querySelector('input[name="ctl00$cpBody$rptSale$ctl00$txtCoupon"]').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('input[name="ctl00$cpBody$rptSale$ctl00$btnApplyCoupon"]').click();
      }
    },

    expedia: {
      id: 184,
      preApplyCodes: (callback) => {
        callback();
      },
      applyCode: (code, callback) => {
        callback(code);
      },
      applyBestCode: (bestCode) => {
        // document.querySelector('#couponId').value = bestCode;
        // document.querySelector('#couponId').dispatchEvent(new Event('input', {bubbles: true}));
        // document.querySelector('#apply_coupon_button').click();
      }
    },

    eyebuydirect: {
      id: 780, 
      preApplyCodes: (callback) => {
        const elTotal   = $('dt.js-order-total span.price-symbol');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace(/[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {
        $.ajax({
          url: 'https://www.eyebuydirect.com/cart?action=redeem_coupon',
          type: 'POST',
          data: {
            'redeem_coupon': code
          },
          success: (response) => {
            const json = response;
            if (json !== null && json.data !== undefined && json.data !== null) {
              var total = json.data.totalAmount;
              if (total !== undefined && total !== null) {
                total = Number.parseFloat(total.replace(/[^0-9.,]/g, ''));
              } else {
                total = Number.POSITIVE_INFINITY;
              }
              callback(total);
            } else {
              callback(Number.POSITIVE_INFINITY);
            }
          },
          error: () => {
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('input[name="redeem_coupon"]').value = bestCode;
        document.querySelector('input[name="redeem_coupon"]').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('button.btn-apply-code').click();
      }
    },

    fragrancenet: {
      id: 830,
      preApplyCodes: function(callback) {
        const orderValueEl = $('div.total span.subtotalPrice');
        const prevValue = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().attr('data-price').trim()) : 
                          Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        this.preApplyCodes(() => {
          const formData = getFormFieldsAsJson(document.querySelector('#couponform'));
          formData['gc_coupon_id'] = code;
          $.post('https://www.fragrancenet.com/f/net/ord/basket.html', formData, 
            (response) => {
              const orderValueEl = $(response).find('div.total span.subtotalPrice');
              const value = orderValueEl.length > 0 ? 
                            convertNumbers(orderValueEl.first().attr('data-price').trim()) : 
                            Number.POSITIVE_INFINITY;
              callback(value);
            });
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#coupon_input').value = bestCode;
        document.querySelector('#coupon_input').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('#couponform').submit();
      }
    },

    hanes: {
      id: 2982,
      preApplyCodes: function(callback) {
        const elTotal = $('#cart-totals .price.bfx-price.bfx-total-grandtotal, tr.grand.totals');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
          const url = $('#discount-coupon-form').attr('action');
          const formData = getFormFieldsAsJson(document.querySelector('#discount-coupon-form'));
          formData['coupon_code_fake'] = code;
          formData['coupon_code'] = code;
          formData['last_code'] = code;
          $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            success: () => {
              $.get('https://'+window.location.hostname+window.location.pathname, (responseGet) => {
                const checkoutconfigindex = responseGet.indexOf("window.checkoutConfig");
                const customerDataindex = responseGet.indexOf("window.isCustomerLoggedIn");
                const finalIndex = customerDataindex-checkoutconfigindex;
                const data = JSON.parse(responseGet.substr(responseGet.indexOf("window.checkoutConfig")+23, finalIndex-107));
                const value = data.totalsData.base_grand_total;
                const formData2 = getFormFieldsAsJson(document.querySelector('#discount-coupon-form'));
                formData2['last_code'] = code;
                formData2['remove_coupon'] = code;
                 $.post(url, formData2, 
                  (response) => {
                   callback(value);
                  });              
              });
            },
            error: (xhr, status, error) => {
               callback(Number.POSITIVE_INFINITY);
            }
          });
      },
        applyBestCode: (bestCode) => {
          document.querySelector('#coupon_code_fake, #discount-code-fake').value = bestCode;
          document.querySelector('#coupon_code_fake, #discount-code-fake').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
          document.querySelector('#coupon_code_fake, #discount-code-fake').dispatchEvent(new Event('change', {bubbles: true}));
          document.querySelector('#coupon_code_fake, #discount-code-fake').dispatchEvent(new Event('blur')); 
          document.querySelector('#coupon_code_fake, #discount-code-fake').dispatchEvent(new Event('focus'));    
          document.querySelector('#discount-coupon-form button.action.apply,#discount-form button.action.action-apply').click();    
        }
    },

  champion: {
      id: 544,
      preApplyCodes: function(callback) {
        const elTotal = $('#cart-totals .price.bfx-price.bfx-total-grandtotal, tr.grand.totals');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
          const url = $('#discount-coupon-form').attr('action');
          const formData = getFormFieldsAsJson(document.querySelector('#discount-coupon-form'));
          formData['coupon_code_fake'] = code;
          formData['coupon_code'] = code;
          formData['last_code'] = code;
          $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            success: () => {
              $.get('https://'+window.location.hostname+window.location.pathname, (responseGet) => {
                const checkoutconfigindex = responseGet.indexOf("window.checkoutConfig");
                const customerDataindex = responseGet.indexOf("window.isCustomerLoggedIn");
                const finalIndex = customerDataindex-checkoutconfigindex;
                const data = JSON.parse(responseGet.substr(responseGet.indexOf("window.checkoutConfig")+23, finalIndex-107));
                const value = data.totalsData.base_grand_total;
                const formData2 = getFormFieldsAsJson(document.querySelector('#discount-coupon-form'));
                formData2['last_code'] = code;
                formData2['remove_coupon'] = code;
                 $.post(url, formData2, 
                  (response) => {
                   callback(value);
                  });              
              });
            },
            error: (xhr, status, error) => {
               callback(Number.POSITIVE_INFINITY);
            }
          });
      },
        applyBestCode: (bestCode) => {
          document.querySelector('#coupon_code_fake, #discount-code-fake').value = bestCode;
          document.querySelector('#coupon_code_fake, #discount-code-fake').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
          document.querySelector('#coupon_code_fake, #discount-code-fake').dispatchEvent(new Event('change', {bubbles: true}));
          document.querySelector('#coupon_code_fake, #discount-code-fake').dispatchEvent(new Event('blur')); 
          document.querySelector('#coupon_code_fake, #discount-code-fake').dispatchEvent(new Event('focus'));    
          document.querySelector('#discount-coupon-form button.action.apply,#discount-form button.action.action-apply').click();    
        }
    },

  justmysize: {
      id: 1046,
      preApplyCodes: function(callback) {
        const elTotal = $('#cart-totals .price.bfx-price.bfx-total-grandtotal, tr.grand.totals');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
          const url = $('#discount-coupon-form').attr('action');
          const formData = getFormFieldsAsJson(document.querySelector('#discount-coupon-form'));
          formData['coupon_code_fake'] = code;
          formData['coupon_code'] = code;
          formData['last_code'] = code;
          $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            success: () => {
              $.get('https://'+window.location.hostname+window.location.pathname, (responseGet) => {
                const checkoutconfigindex = responseGet.indexOf("window.checkoutConfig");
                const customerDataindex = responseGet.indexOf("window.isCustomerLoggedIn");
                const finalIndex = customerDataindex-checkoutconfigindex;
                const data = JSON.parse(responseGet.substr(responseGet.indexOf("window.checkoutConfig")+23, finalIndex-107));
                const value = data.totalsData.base_grand_total;
                const formData2 = getFormFieldsAsJson(document.querySelector('#discount-coupon-form'));
                formData2['last_code'] = code;
                formData2['remove_coupon'] = code;
                 $.post(url, formData2, 
                  (response) => {
                   callback(value);
                  });              
              });
            },
            error: (xhr, status, error) => {
               callback(Number.POSITIVE_INFINITY);
            }
          });
      },
        applyBestCode: (bestCode) => {
          document.querySelector('#coupon_code_fake, #discount-code-fake').value = bestCode;
          document.querySelector('#coupon_code_fake, #discount-code-fake').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
          document.querySelector('#coupon_code_fake, #discount-code-fake').dispatchEvent(new Event('change', {bubbles: true}));
          document.querySelector('#coupon_code_fake, #discount-code-fake').dispatchEvent(new Event('blur')); 
          document.querySelector('#coupon_code_fake, #discount-code-fake').dispatchEvent(new Event('focus'));    
          document.querySelector('#discount-coupon-form button.action.apply,#discount-form button.action.action-apply').click();    
        }
    },
  
    hilton: {
      id: 29321,
      preApplyCodes: (callback) => {
        callback();
      },
      applyCode: (code, callback) => {
        callback(code);
      },
      applyBestCode: (bestCode) => {
      }
    },

    hm: {
      id: 5709,
      preApplyCodes: function(callback) {
        const elTotal = $('[class*="OrderTotals--totals"] tr:last-child td:last-child, [class*="OrderTotal-module--"] tfoot td:last-child, #total_price_of_basket:not(:contains(" 0.00")), #orderSummary [colspan="2"]td:not(:contains(" 0.00")), [class*="CartSidebarTotals"] td:contains(Total) + td:not(:contains(" 0.00"))');
        const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace(/[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const url =  'https://www2.hm.com/'+window.location.pathname+'/redeemVoucher';
        $.ajax({
          url: url,
          type: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          data: '{"voucherCode":"' + code + '"}',
          success: (response) => {
            var totalPrice = Number.POSITIVE_INFINITY;
            const orderTotals = response.orderTotals;
            if (orderTotals !== null && orderTotals !== undefined) {
              const price = orderTotals.totalPrice;
              if (price !== null && price !== undefined) {
                totalPrice = price.replace( /[^0-9.,]/g, '').trim();
              }
            }
            $.ajax({
              url: 'https://www2.hm.com/en_us/v1/vouchers/'+code,
              type: 'DELETE',
              headers: {
                'Content-Type': 'application/json;charset=UTF-8'
              },
              data: '{}',
              success: (response) => { callback(totalPrice); },
              error: (response) => { callback(totalPrice); }
            });
          },
          error: function() {
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: function(bestCode) {
         const url =  'https://www2.hm.com/'+window.location.pathname+'/redeemVoucher';
        $.ajax({
          url: url,
          type: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          data: '{"voucherCode":"' + bestCode + '"}',
          success: (response) => { location.reload(); },
          error: (response) => { location.reload(); }
        });
      }
    },
  
    jcpenney: {
      id: 199,
      preApplyCodes: function(callback) {
        const localData = JSON.parse(localStorage.getItem('__yoda'));
        this.data = {
          accountId: localData.ACCOUNT_ID,
          accessToken: localData.Access_Token,
        };
        this._removeAllCodes(callback);
      },
      applyCode: function(code, callback) {
        this._applyCode(code, function() {
          this._status(function(result) {
            if (result.adjustments && result.adjustments.length > 0) {
              this._removeCode(result.adjustments[0].id, function() {
                callback(result.totals[0].amount);
              }) ;
            } else {
              callback(result.totals[0].amount);
            }
          }.bind(this));
        }.bind(this));
      },
      applyBestCode: function(bestCode) {
        document.querySelector('[data-automationid="manual-apply-coupon-input"]').value = bestCode;
        document.querySelector('[data-automationid="manual-apply-coupon-input"]').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('[data-automation-id="manual-apply-coupon-button"]').click();
      },
      _applyCode: function(code, callback) {
        var body = JSON.stringify({
          code: code,
          serialNumber: null,
        });
        this._xhrRequest('POST', '/adjustment/discounts', callback, body);
      },
      _removeAllCodes: function(callback) {
        this._status(function(result) {
          this._syncForEach(result.adjustments, function(adjustment, done) {
            if (adjustment.code === 'COUPON') {
              this._removeCode(adjustment.id, done);
            }
          }.bind(this), callback);
        }.bind(this));
      },
      _removeCode: function(code, callback) {
        this._xhrRequest('DELETE', `/adjustment/discounts/${code}`, callback);
      },
      _status: function(callback) {
        this._xhrRequest('GET', '?expand=status', function(result) {
          callback(JSON.parse(result));
        });
      },
      _xhrRequest: function(method, url, callback, body) {
        var request = {
          headers: {
            'Authorization': `Bearer ${this.data.accessToken}`,
            'Content-Type': 'application/json;'
          },
          method: method,
          url: `https://order-api.jcpenney.com/order-api/v1/accounts/${this.data.accountId}/draft-order${url}`,
          withCredentials: true,
        };
  
        if (body) {
          request.body = body;
        }
  
        sameOriginRequest(request, callback);
      },
      _syncForEach: function(collection, step, end, i) {
        if (i === undefined) {
            i = 0;
        }
    
        if (i >= collection.length) {
            const total = convertNumbers($($('div[data-automation-id="at-total-price"]')[0]).first().text().replace( /[^0-9.,]/g, '').trim());
            end(total);
        } else {
            step(collection[i], this._syncForEach.bind(null, collection, step, end, i+1));
        }
      }
    },
  
    lordandtaylor: {
      id: 1111, 
      preApplyCodes: function(callback) {
        const elTotal = $('#jsVal-grandTotal');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        this.preApplyCodes(() => {
          $.post(
            'https://www.lordandtaylor.com/checkout/checkout.jsp',
            {
              bmForm: 'applyPromoSaksBag',
              promoCode: code
            }, (response) => {
              if (response !== null && !response.errors) {
                  const value = response.cartSummary.grandTotalWithoutFormatting;
                  const price = value.replace( /[^0-9.,]/g, '').trim();
                callback(price);
                $.post(
                  'https://www.lordandtaylor.com/checkout/checkout.jsp',
                  {
                    bmForm: 'remove_promo_code_saks_bag_service',
                    promoCode: code
                  }, () => {
                    //callback(0);
                  }
                ); 
              } else {
                callback(Number.POSITIVE_INFINITY);
              }
            }
          );
        });
      },
      applyBestCode: function(bestCode) {
          document.querySelector('#promoCodeEntry').value = bestCode;
          document.querySelector('#promoCodeEntry').dispatchEvent(new Event('input', {bubbles: true}));
          document.querySelector('#promoApply').click();
      },
      _applyBestCodes: function(index) {
        if (index < this.codes.length) {
          const promoCode = this.codes[index];
          document.querySelector('#promoCodeEntry').value = promoCode;
          document.querySelector('#promoCodeEntry').dispatchEvent(new Event('input', {bubbles: true}));
          document.querySelector('#promoApply').click();
          this._applyBestCodes(index + 1);
        } else {
          this.codes = null;
        }
      }
    },

    macys: {
      id: 207, 
      preApplyCodes: function(callback) {
        const elTotal = $('#cx-at-SUM_SUB_TOTAL-value');
        const value = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        const elRemove = $('#promo-remove-button');
        if (elRemove.length > 0) {
          elRemove.click();
          callback(value);
        } else {
          callback(value);
        }
      },
      applyCode: function(code, callback) {
        const macysBagguid = decodeURI(document.cookie.split(';').filter(function(c) { return c.indexOf('macys_bagguid') !== -1 })[0]).trim().split('=')[1];
        this.preApplyCodes(() => {
          $.ajax({
            url: `https://www.macys.com/my-bag/${macysBagguid}/promo?currencyCode=USD&promoCode=${code}`,
            type: 'PUT',
            contentType: 'application/json',
            success: function(data) {
              let value = Number.POSITIVE_INFINITY;
              if (data.bag.sections) {
                const formattedValue = data.bag.sections.summary.price[0].values[0].formattedValue;
                value = convertNumbers(formattedValue.replace( /[^0-9.,]/g, '').trim());
              }
              callback(value);
            }
          });
        });
      },
      applyBestCode: function(bestCode) {
        document.querySelector('#promo-apply-input').value = bestCode;
        document.querySelector('#promo-apply-input').dispatchEvent(new Event('input', {bubbles: true}));
        $('.promo-apply-button.primaryBlack.expanded').click();
      }
    },
  
    michaels: {
      id: 6121, 
      preApplyCodes: function(callback) {
        const elTotal = $('li.order-total-value span.value');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        const url = $('#promo-form').attr('action');
        $.post(url, {
          dwfrm_cart_couponCode: '',
          dwfrm_cart_coupons_i0_deleteCoupon: 'Remove'
        }, (response) => {
          callback(prevValue);
        });
      },
      applyCode: function(code, callback) {
        this.preApplyCodes(() => {
          const url = $('#promo-form').attr('action');
          $.post(url, {
            dwfrm_cart_couponCode: code,
            dwfrm_cart_addCoupon: 'dwfrm_cart_addCoupon'
          }, (response) => {
            const elTotal = $(response).find('li.order-total-value span.value');
            const value = elTotal.length > 0 ? 
                          convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
            callback(value);
          });
        });
      },
      applyBestCode: function(bestCode) {
        document.querySelector('#dwfrm_cart_couponCode').value = bestCode;
        document.querySelector('#dwfrm_cart_couponCode').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('#add-coupon').click();
      }
    },
    
    nutrisystem: {
      id: 3976, 
      preApplyCodes: function(callback) {
        const elTotal = $('table.order-totals-table tr.totals td.price');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        console.log('Apply Code: ', code);
        const url = 'https://www.nutrisystem.com/checkout/billing.jsp?_DARGS=/jsps_hmr/shop/includes/apply_checkout_promo.jsp';
        const formData = getFormFieldsAsJson(document.querySelector('#checkoutPromo'));
        formData['promo-code'] = code;
        $.ajax({
          url: url,
          type: 'POST',
          data: formData,
          success: (response, status, xhr) => {
            $.get('https://www.nutrisystem.com'+window.location.pathname + window.location.search, (responseGet) => {
              if (responseGet !== null) {
                const elTotal = $(response).find('table.order-totals-table tr.totals td.price');
                const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
                callback(value);
              } else {
                callback(Number.POSITIVE_INFINITY);
              }
            });
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#promo-code-input').value = bestCode;
        document.querySelector('#promo-code-input').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('form#checkoutPromo').submit();  
      }
    },

    orientaltrading: {
      id: 3069, 
      preApplyCodes: function(callback) {
        const elTotal = $('span.amt-grand-total, .u_txtPrice.u_bold.u_uppercase');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.last().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
       if(window.location.href.indexOf("checkout") > -1){
          const ZipCode = $('[name="order.shippingAddress.zipCode"]:visible').val();
          const zip = ZipCode?ZipCode:'0';
          const addCouponUrl = 'https://secure.checkout.orientaltrading.com/checkout/rest/promoCode/'+code+'/zip/'+zip+'/method/ASDARD';
         $.ajax({
          url: addCouponUrl,
          type: 'GET',
          success: (response, status, xhr) => {
            var total = response.total;
            if (total === undefined || total === null) {
              total = Number.POSITIVE_INFINITY;
            }
            callback(total);
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
        });
       }else{         
        var date = new Date();
        var timestamp = date.getTime();
        const url = `https://`+window.location.hostname+`/rest/promocode/${code}/apply/shoppingcart?_=${timestamp}`;
          $.ajax({
          url: url,
          type: 'GET',
          success: (response, status, xhr) => {
            $.get(`https://`+window.location.hostname+`/web/shoppingcart/summary`, (responseGet) => {
            const total = $(responseGet).find('span.amt-grand-total, .u_txtPrice.u_bold.u_uppercase');
            const value = total.length > 0 ? 
                            convertNumbers(total.text().replace( /[^0-9.,]/g, '').trim()) : 
                            Number.POSITIVE_INFINITY;                              
            callback(value);
            });
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
        });
       }
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#promoCodeInput, #promo_code').value = bestCode;
        document.querySelector('#promoCodeInput, #promo_code').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('#applyPromoShoppingCart, .p_apply_promo').click();  
      }
    },

    papajohns: {
      id: 5657, 
      preApplyCodes: function(callback) {
        const elTotal = $('.estimated-total-amount');
        const value   = elTotal.length > 0 ? 
                              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
        const elRemove = $('.remove-product.remove-product-promo');
        if (elRemove.length > 0) {
          const urlRemove = 'https://www.papajohns.com'+elRemove.first().attr('data-freight-href');
          $.get(urlRemove, () => {
            callback(value);
          });
        } else {
          callback(value);
        }
      },
      applyCode: function(code, callback) {
        this.preApplyCodes(() => {
          $.get(`https://www.papajohns.com/order/validate-promo?promo-code=${code}`, () => {
            $.get(`https://www.papajohns.com/order/view-cart?promoNotification=true&promoCode=${code}`, (data) => {
              const elTotal = $(data).find('.estimated-total-amount.amount h3');
              const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.first().html().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
              const elRemove = $(data).find('.remove-product.remove-product-promo');
              if (elRemove.length > 0) {
                const urlRemove = 'https://www.papajohns.com'+elRemove.first().attr('data-freight-href');
                $.get(urlRemove, () => {
                  callback(value);
                });
              } else {
                callback(value);
              }
            });
          });
        });
      },
      applyBestCode: function(bestCode) {
        document.querySelector('#sticky-promo-code').value = bestCode;
        document.querySelector('#sticky-promo-code').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('#sticky-promo-submit').click();
      }
    },

  partycity: {
    id: 5689, 
      preApplyCodes: function(callback) {
        const elTotal = $('li.order-total').children().last();
        const prevValue = elTotal.text().replace( /[^0-9.,]/g, '').trim();
        if(window.location.href.indexOf("cart") > -1){
          const url = $('#cart-items-form').attr('action');
          const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
          formData['dwfrm_cart_coupons_i0_deleteCoupon'] = 'Remove';
          $.post(url, formData, 
            (response) => {
              callback(prevValue);
          });
        }else{
          const prevCode = $('[name="summary-couponCode"]').val();
          const windowVariables = retrieveWindowVariables(["window.Urls"]);
          const removeCouponUrl = windowVariables["window.Urls"].removeCoupon;
          if(prevCode){
            $.get('https://'+window.location.hostname+removeCouponUrl+'?couponCode='+prevCode+'&format=ajax', 
              () => {                                          
                callback(prevValue,prevCode);
            });
          }else{
             callback(prevValue);
          }
        }
      },
      applyCode: function(code, callback) {  
       if(window.location.href.indexOf("cart") > -1){
        this.preApplyCodes(() => {
          const url = $('#cart-items-form').attr('action');
          const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
          formData['dwfrm_cart_couponCode'] = code;
          formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
          $.post(url, formData, 
            (responsePost) => {
              $.get('https://www.partycity.com/cart', (response) => {
                const elTotal = $(response).find('li.order-total').children().last();
                const value = elTotal.text().replace( /[^0-9.,]/g, '').trim();
                callback(value);
              });
            });
        });
       }else{
        const checkoutStep = $('.checkoutstep').val();
        const windowVariables = retrieveWindowVariables(["window.Urls"]);
        const addCouponUrl = windowVariables["window.Urls"].addCoupon;
        const removeCouponUrl = windowVariables["window.Urls"].removeCoupon;
        const summaryRefreshURL = windowVariables["window.Urls"].summaryRefreshURL;      
        $.get(addCouponUrl+'?couponCode='+code+'&format=ajax', 
          () => {
            $.get('https://'+window.location.hostname+summaryRefreshURL+'?format=ajax&checkoutstep='+checkoutStep, 
              (response) => {
                const orderValueEl = $(response).find('li.order-total').children().last();
                const value = orderValueEl.text().replace( /[^0-9.,]/g, '').trim();
                  $.get('https://'+window.location.hostname+removeCouponUrl+'?couponCode='+code+'&format=ajax', 
                  () => {                                          
                    callback(value);
                });
              });
          });
       }
      },
      applyBestCode: (bestCode) => {
        if(window.location.href.indexOf("cart") > -1){
          const url = $('#cart-items-form').attr('action');
          const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
          formData['dwfrm_cart_couponCode'] = bestCode;
          formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
          $.post(url, formData, 
            (responsePost) => { location.reload(); })
        }else{
          const windowVariables = retrieveWindowVariables(["window.Urls"]);
          const addCouponUrl = windowVariables["window.Urls"].addCoupon;     
          $.get(addCouponUrl+'?couponCode='+bestCode+'&format=ajax', 
            () => { location.reload(); })
        }
      }
    },

    pharmaca: {
      id: 5795, 
      coupon_input_selector: '#coupon_code',
      total_price_selector: 'tr.grand.totals span.price',
      preApplyCodes: function(callback) {
        const elTotal = $('tr.grand.totals span.price');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        this.pharmacaPrevCode = code;
        $.ajax({
          url: 'https://www.pharmaca.com/checkout/cart/couponPost',
          type: 'POST',
          data: {
            remove: 0,
            coupon_code: code
          },
          success: () => {
            $.get('https://www.pharmaca.com'+window.location.pathname, (responseGet) => {
              const elTotal = $(responseGet).find('.cart-price-new .price');
              var value = 0;
              if( elTotal.length > 0 ){
                 $( elTotal ).each(function( index ) {
                  value += convertNumbers($( this ).text().replace( /[^0-9.,]/g, '').trim());                
                 });
              }else{
                  value = Number.POSITIVE_INFINITY;
              }
              
              callback(value);
            });
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#coupon_code').value = bestCode;
        document.querySelector('#coupon_code').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('button.apply').click();  
      }
    },
  
    puma: {
      id: 1403, 
      preApplyCodes: function(callback) {
        const elTotal = $('p.grand-total');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        const el = $('a.remove-coupon');
        var url = null;
        if (el !== null && el !== undefined && el.length > 0) {
          const code = el.attr('data-code');
          const uuid = el.attr('data-uuid');
          url = 'https://us.puma.com/on/demandware.store/Sites-NA-Site/en_US/Cart-RemoveCouponLineItem' +
                      '?code=' + code +
                      '&uuid=' + uuid;
        } else if (this.pumaPrevCode !== null && this.pumaPrevCode !== undefined) {
          url = 'https://us.puma.com/on/demandware.store/Sites-NA-Site/en_US/Cart-RemoveCouponLineItem' +
                      '?code=' + this.pumaPrevCode +
                      '&uuid=' + this.pumaPrevUuid;
        }
        if (url !== null) {
          $.ajax({
            url: url,
            type: 'GET',
            data: {},
            success: () => {
              callback(prevValue);
            },
            error: (xhr, status, error) => {
              console.log(error);
              callback(prevValue);
            }
          });
        } else {
          callback(prevValue);
        }
      },
      applyCode: function(code, callback) {
        this.preApplyCodes(() => {
          this.pumaPrevCode = code;
          console.log('Apply Code: ', code);
          const csrf_token = $('input[name*="csrf_token"]').first().val();
          const url = 'https://us.puma.com/on/demandware.store/Sites-NA-Site/en_US/Cart-AddCoupon' +
                      '?couponCode=' + code + 
                      '&csrf_token=' + csrf_token;
          $.ajax({
            url: url,
            type: 'GET',
            data: {},
            success: (response, status, xhr) => {
              if (response !== null) {
                const totals = response.totals;
                if (totals !== null && totals !== undefined) {
                  const value = totals.grandTotal !== null ? 
                            convertNumbers(totals.grandTotal.replace( /[^0-9.,]/g, '').trim()) : 
                            Number.POSITIVE_INFINITY;
                  $.get('https://us.puma.com'+window.location.pathname, (responseGet) => {
                    const el = $(responseGet).find('a.remove-coupon');
                    if (el !== null && el !== undefined && el.length > 0) {
                      this.pumaPrevUuid = el.attr('data-uuid');
                    }
                    callback(value);
                  });
                  return;
                }
              }
              callback(Number.POSITIVE_INFINITY);
            },
            error: (xhr, status, error) => {
              console.log(error);
            }
          });
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#couponCode').value = bestCode;
        document.querySelector('#couponCode').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('.promo-code-submit button').disabled = false;  
        document.querySelector('.promo-code-submit button').click();  
      }
    },

    rakuten: {
      id: 7, 
      preApplyCodes: (callback) => {
        const elTotal = $('.r-product__price-text.r-checkout-cart-summary__is-red span');
        const value   = elTotal.length > 0 ? 
                              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
        const csrf = $('meta[name="csrf-token"]').attr('content');  
        $.ajax({
          url: 'https://www.rakuten.com/buy/coupon_discount.json',
          type: 'POST',
          headers: {
            'x-csrf-token': csrf
          },
          data: {},
          success: () => {
            callback(value);
          }
        });
      },
      applyCode: (code, callback) => {
        const csrf = $('meta[name="csrf-token"]').attr('content');
        $.ajax({
          url: 'https://www.rakuten.com/buy/coupon_discount.json',
          type: 'POST',
          headers: {
            'x-csrf-token': csrf
          },
          data: { code_no: code},
          success: () => {
            $.ajax({
              url: 'https://www.rakuten.com/buy/amounts_calculate.json',
              type: 'POST',
              headers: {
                'x-csrf-token': csrf
              },
              data: { coupon_code_no: code },
              success: (data) => {
                const value = convertNumbers(data.cash_amount) || Number.POSITIVE_INFINITY;
                callback(value);
              }
            });
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('.r-payment-page__coupon-input').value = bestCode;
        document.querySelector('.r-payment-page__coupon-input').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('.apply-btn').click();
      }
    },
  
    sallybeauty: {
      id: 1455, 
      preApplyCodes: function(callback) {       
        const elTotal = $('p.grand-total');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        const el = $('button.remove-coupon');
        var url = null;
        if (el !== null && el !== undefined && el.length > 0) {
          const code = el.attr('data-code');
          const uuid = el.attr('data-uuid');
          url = 'https://www.sallybeauty.com/on/demandware.store/Sites-SA-Site/default/Cart-RemoveCouponLineItem' +
                      '?code=' + code +
                      '&uuid=' + uuid;
        } else if (this.sallybeautyPrevCode !== null && this.sallybeautyPrevCode !== undefined) {
          const uuid = $('div.save-for-later > a').attr('data-uuid');
          url = 'https://www.sallybeauty.com/on/demandware.store/Sites-SA-Site/default/Cart-RemoveCouponLineItem' +
                      '?code=' + this.sallybeautyPrevCode +
                      '&uuid=' + uuid;

        }
        if (url !== null) {
          $.ajax({
            url: url,
            type: 'GET',
            success: (data) => {
              callback(prevValue);
            },
            error: (xhr, status, error) => {
              callback(prevValue);
            }
          });
        } else {
          callback(prevValue);
        }
      },
      applyCode: function(code, callback) {
        this.preApplyCodes(() => {
          this.sallybeautyPrevCode = code;
          console.log('Apply Code: ', code);
          const loyaltyreward = $('input[name*="loyaltyreward"]').first().val();
          const csrf_token = $('input[name*="csrf_token"]').first().val();
          const url = 'https://www.sallybeauty.com/on/demandware.store/Sites-SA-Site/default/Cart-AddCoupon' +
                      '?couponCode=' + code + 
                      '&loyaltyreward=' + loyaltyreward +
                      '&csrf_token=' + csrf_token;
          $.ajax({
            url: url,
            type: 'GET',
            success: (response) => {
              if (response !== null) {
                const totals = response.totals;
                if (totals !== null && totals !== undefined) {
                  const value = totals.grandTotal !== null ? 
                            convertNumbers(totals.grandTotal.replace( /[^0-9.,]/g, '').trim()) : 
                            Number.POSITIVE_INFINITY;
                  callback(value);
                  this.sallybeautyUUID =  response.totals.discounts[0].UUID;
                  this._removeAppliedCode(() => { });
                  return;
                }
              }
              callback(Number.POSITIVE_INFINITY);
            },
            error: (xhr, status, error) => {
              callback(Number.POSITIVE_INFINITY);
            }
          });           
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#couponCode').value = bestCode;
        document.querySelector('#couponCode').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('.promo-code-submit button').click();  
      },
      _removeAppliedCode: function(callback) {
         const uuid = $('div.save-for-later > a').attr('data-uuid');
          url = 'https://www.sallybeauty.com/on/demandware.store/Sites-SA-Site/default/Cart-RemoveCouponLineItem' +
                      '?code=' + this.sallybeautyPrevCode +
                      '&uuid=' + this.sallybeautyUUID;
          $.ajax({
            url: url,
            type: 'GET',
            success: (data) => {              
            },
            error: (xhr, status, error) => {             
            }
          });        
      }
    },

    shein_desktop: {
      id: 7754, 
      preApplyCodes: function(callback) {
        const elTotal = $('div.total-item span.total');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const windowVariables = retrieveWindowVariables(["gbCoSsrData"]);
        const gbCoSsrData = windowVariables.gbCoSsrData;
        const address_id = gbCoSsrData.checkout.default_address.addressId;
        var use_insurance;
        var shipping_method_id;
        if($('.j-insurance-checkbox').prop("checked") == true){
            use_insurance = '1';
         }
         else {
            use_insurance = '0';
         }          
          const shipping_method = $('.shipping-selected').attr('type');
          const shipping_method_length = gbCoSsrData.checkout.results.shippingMethods.length;
          for(i=0;i<shipping_method_length;i++){
              if(gbCoSsrData.checkout.results.shippingMethods[i].type==shipping_method){
                   shipping_method_id =gbCoSsrData.checkout.results.shippingMethods[i].id;
              }
          }
         const points = gbCoSsrData.checkout.caculate_info.points;
         $.ajax({
              url: 'https://us.shein.com/checkout/cacu_total',
              type: 'POST',
              data: {
                address_id: address_id,
                coupon: code,
                shipping_method_id: shipping_method_id,
                points: points,
                use_insurance: use_insurance,
                use_wallet:0,
                is_shop_transit: 0,
                shop_transit_country_id: 226,
                payment_id: '',
                use_wallet_amount: '',
                comment: '',
                payment_code_unique: '',

              },
              success: (data) => {
                if(data.msg == 'ok'){
                    callback(data.info.grandTotalPrice.amount);
                }else{
                    callback(Number.POSITIVE_INFINITY);
                }
              },
              error: (xhr, status, error) => {
                console.log(error);
                callback(Number.POSITIVE_INFINITY);
              }
            });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('.check-coupon .c-input input[type=text]').value = bestCode;
        document.querySelector('.check-coupon .c-input input[type=text]').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('.check-coupon .apply-box a span').click();       
      }
    },

    shopdisney: {
      id: 173,
      preApplyCodes: function(callback) {
        const elTotal = $('div.grand-total');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const csrfToken = $('form#promoCodeForm input[name="csrf_token"]').first().val();
        const url = 'https://www.shopdisney.com/on/demandware.store/Sites-shopDisney-Site/default/Cart-AddCoupon' +
                    `?couponCode=${code}&csrf_token=${csrfToken}`;
        $.ajax({
          url: url,
          type: 'GET',
          success: (response) => {
            if (response.totals !== undefined && response.totals !== null) {
              const totals = response.totals;
              const value = totals.grandTotalValue.value;
              callback(value);
            } else {
              callback(Number.POSITIVE_INFINITY);
            }
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        location.reload();
      }
    },

    shutterfly: {
      id: 3699, 
      preApplyCodes: function(callback) {
        const elTotal = $('div#cartSummaryArea tr.table-summary td').last();
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.last().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
         const apigeeApiKey = 'uWrM911sdIvHivflYxyiHlGgmlgoaV0m';
         const bundleCreationPath =  JSON.parse(sessionStorage.getItem("BundleCreationPath"));
         const cartId = bundleCreationPath.projectModel.metadata.cartId;
         
          $.ajax({
            url: 'https://accounts.shutterfly.com/sso/v2/tokens',
            type: 'GET',
            success: (responseget) => {
              const accesstoken = responseget[6].value;
              $.ajax({
                  url: 'https://api2.shutterfly.com/v1/web-cart-orch/v1/codes/claim',
                  type: 'post',
                  data: JSON.stringify({code: code, cartId: cartId}),
                  contentType: 'application/json; charset=utf-8',         
                  headers: {
                    "Authorization": "Bearer " + accesstoken,
                    "SFLY-Apikey": apigeeApiKey
                  },
                  success: (responseget) => {
                    // Todo: Get total price after applying coupon

                    var value = responseget.cart.summary.prices.total.renderedPrice;
                    if(value){
                      var elTotal = value.replace(/[^0-9\.]+/g, "");
                      callback(elTotal);
                    }else{
                      callback(Number.POSITIVE_INFINITY);
                    }
                  },
                    error: (xhr, status, error) => {
                      console.log(error);
                      callback(Number.POSITIVE_INFINITY);
                    }
                });
            },
              error: (xhr, status, error) => {
                console.log(error);
                callback(Number.POSITIVE_INFINITY);
            }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('.omnibox-code').value = bestCode;
        document.querySelector('.omnibox-code').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('.omnibox-claim').click();
        
      }
    },


    snapfish: {
      id: 1527, 
      preApplyCodes: function(callback) {
        const elTotal = $('td#total_to_pay_now');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').replace(',','').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
          const csrf_token = document.querySelector("meta[name='csrf-token']").getAttribute("content");
          const orderId = $('#orders').val();
          const data = {
            promotionName: code,
            order_id: orderId,
            entered_coupons: code
          }
           $.ajax({
                  url: 'https://www.snapfish.com/cart/updatecart',
                  type: 'POST',
                  data: data,        
                  headers: {
                    "x-csrf-token": csrf_token
                  },
                  success: (response) => {
            const productTotal = response.productTotal ? response.productTotal : 0;
            const shippingTotal = response.shippingTotal ? response.shippingTotal : 0;
            const shippingTax = response.shippingTax ? response.shippingTax : 0;
            const productTax = response.productTax ? response.productTax : 0;
            var discount = 0;
            if (response.productDiscount) {
              discount = response.productDiscount.totalDiscount ? 
                         response.productDiscount.totalDiscount : 0;
            }
            const total = (productTotal + shippingTotal - discount) + shippingTax + productTax; 
            callback(total);
            const body = {
              promotionName: '',
              order_id: orderId,
              isCouponRemoved: true
            }
                   $.ajax({
                        url: 'https://www.snapfish.com/cart/updatecart',
                        type: 'POST',
                        data: body,        
                        headers: {
                          "x-csrf-token": csrf_token
                        },
                        success: (responseget) => {
                           // callback(prevValue);
                        }
                      });
          },error: (xhr, status, error) => {
                console.log(error);
                callback(Number.POSITIVE_INFINITY);
            }
          });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#coupon_id').value = bestCode;
        document.querySelector('#coupon_id').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('#apply_coupon_btn').click();
      }
    },

    sportsmansguide: {
      id: 3123,
      preApplyCodes: (callback) => {
        const Total = $('.grandTotal');
        const prevValue = Total.length > 0 ? 
                       convertNumbers(Total.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;        
        callback(prevValue);
      },
      applyCode: (code, callback) => { 
      $.ajax({
          url: 'https://www.sportsmansguide.com/Checkout/CouponSubmit',
          type: 'POST',
          data: {couponCode: code},
          success: (responseget) => {
              $.ajax({
                  url: 'https://www.sportsmansguide.com/Checkout/GetOrderSummary',
                  type: 'POST',
                  data: {hasFirearm: 'false', autoSetPackageProtection: 'true'},
                  success: (responseget) => {
                    // Todo: Get total price after applying coupon
                    var value = responseget.orderSummary.GrandTotal;                                   
                    callback(value);
                  }
                });
          },
              error: (xhr, status, error) => {
                console.log(error);
                callback(Number.POSITIVE_INFINITY);
            }
        });

      },
      applyBestCode: (bestCode) => {
        document.querySelector('input[name="sCoupon"]').value = bestCode;
        document.querySelector('input[name="sCoupon"]').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('#coupon-entry .black-btn.md-button.md-sg-material-theme').click();
      }
    },

    swansonvitamins: {
      id: 1587,
      removePrevCode: function(code, callback) {
        const csrf = $('meta[name="_csrf"]').attr('content');
        if(window.location.href.indexOf("cart") > -1){
          $.ajax({
            url: 'https://www.swansonvitamins.com/cart',
            type: 'POST',
            data: {action:'promocode', promoCode: 'INT999'},
            headers: { 'x-csrf-token': csrf },
            success: () => { callback(); },
            error: (xhr, status, error) => { callback(); }
          });
        }else{         
          const prevCodeSelector = $('.SourceCodeForm__x');
          if(prevCodeSelector){
            try{  $('.SourceCodeForm__x').click(); }catch(e){}
             setTimeout(function(){
              callback(); 
            }, 2000);   
           }else{
             callback();
          } 
        }
      },
      preApplyCodes: function(callback) {
        var elTotal;
         if(window.location.href.indexOf("cart") > -1){
          elTotal = $('.cart-total-price, div:contains("order total") +div, b:contains("order total") +b');
         }else{
          elTotal = $('b:contains("order total") +b');
         }
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
         this.removePrevCode('prevCode', () => callback(prevValue));
      },
      applyCode: function(code, callback) {
        this._applyCode(code, function(value) {
         this.removePrevCode(code, () => callback(value));
       }.bind(this));
      },
      applyBestCode: function(bestCode) {
         this._applyCode(bestCode, function(value) {
          location.reload();
        }); 
      },
     _applyCode: (code, callback) => {
       const csrf = $('meta[name="_csrf"]').attr('content');
        if(window.location.href.indexOf("cart") > -1){
          $.ajax({
              url: 'https://www.swansonvitamins.com/cart',
              type: 'POST',
              data: {action:'promocode', promoCode: code},
               headers: {
                        'x-csrf-token': csrf
                      },
              success: (response) => {
                const value = response.shoppingBag.totalRoundedCost;
                callback(value);
              },
              error: (xhr, status, error) => {
                callback(Number.POSITIVE_INFINITY);
              }
            });
        }else{
          document.querySelector('[name="sourceCode"]').value = code;
          document.querySelector('[name="sourceCode"]').dispatchEvent(new Event('input', {bubbles: true}));
          document.querySelector('[name="sourceCode"]').dispatchEvent(new Event('change'));
          $('button:contains("apply")').click();          
          setTimeout(function(){
             const elTotal = $('b:contains("order total") +b');
             const value = elTotal.length > 0 ? 
                        convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY; 
             callback(value);             
          }, 3000);
        }
     },
    },

    target: {
      id: 26, 
      preApplyCodes: (callback) => {
        const elTotal = $('[data-test="cart-summary-total"] > p:last-child');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;        
        callback(prevValue);
      },
      applyCode: (code, callback) => {
        document.querySelector('#promoCodeEntry').value = code;
        document.querySelector('#promoCodeEntry').dispatchEvent(new MouseEvent('input', {bubbles: true}));
         $('[data-test="apply-promo-code-button"]').click();
         setTimeout(function(){ 
             const elTotal_ac = $('[data-test="cart-summary-total"] > p:last-child');
             const value = elTotal_ac.length > 0 ? 
                      convertNumbers(elTotal_ac.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
              callback(value);

         }, 1500);
      },
      applyBestCode: (bestCode) => {
         document.querySelector('#promoCodeEntry').value = bestCode;
         document.querySelector('#promoCodeEntry').dispatchEvent(new MouseEvent('input', {bubbles: true}));
         $('[data-test="apply-promo-code-button"]').click();
      }
    },
  
    thriftbooks: {
      id: 24523, 
      preApplyCodes: (callback) => {
        const elTotal = $('div.OrderSummary-Total div.OrderSummary-ItemPad');
        const prevValue = elTotal.text().replace( /[^0-9.,]/g, '').trim();
        callback(prevValue);
      },
      applyCode: (code, callback) => {
        $.post('https://www.thriftbooks.com/api/coupon/post/', {
          CouponCode: code,
          IdCheckoutPage: 1
        }, (response) => {
          const value = response.OrderTotal !== null && response.OrderTotal !== undefined ? 
                            convertNumbers(response.OrderTotal) : 
                            Number.POSITIVE_INFINITY;
          callback(value);
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('input.CartCoupon-input').value = bestCode;
        document.querySelector('input.CartCoupon-input').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('div.CartCoupon-inputArea div button').click();
      }
    },

    ulta: {
      id: 1696, 
      preApplyCodes: function(callback) {
        const elTotal = $(".OrderSummaryRow__value .Text--bold");
        const value   = elTotal.length > 0 ? 
                              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
        callback(value);
      },
      applyCode: function(code, callback) {
        const sessiondata = JSON.parse(localStorage.getItem('sessionData'));
        $.ajax({
          url: 'https://www.ulta.com/services/v5/cart/coupon/add?couponCode=' + code,
          type: 'POST',
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',         
          headers: {
            "api-access-control": "dyn_session_conf=" + sessiondata.secureToken
          },
          success: function(data) {
            var response = data;
            var cartSummary = response.data.cartSummary;
            var value = cartSummary.estimatedTotal;
            callback(value);  
                  $.ajax({
                    url: 'https://www.ulta.com/services/v5/cart/coupon/remove',
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',         
                    headers: {
                      "api-access-control": "dyn_session_conf=" + sessiondata.secureToken
                    },
                    success: function(data) {
                        //
                    },
                    error: function() {
                       //
                    }
                  });  
           
          },
          error: function() {
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: function(bestCode) {
        document.querySelector('#couponID').value = bestCode;
        document.querySelector('#couponID').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('.Coupons button[type="submit"]').click();
      }
    },
  
    vistaprint: {
      preApplyCodes: (callback) => {
        const elTotal = $(".totals .discount-price:first-child");
        const value   = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        const elPromoInfo = $('.promo-info');
        if (elPromoInfo.length > 0) {
          $.ajax({
            url: 'https://'+window.location.hostname+'/services/api/v1/cart/setCouponCartJson/',
            type: 'POST',
            data: {couponCode: ''},
            success: () => {
              callback(value);
            }
          });
        } else {
          callback(value);
        }
      },
      applyCode: (code, callback) => {
        $.ajax({
          url: 'https://'+window.location.hostname+'/services/api/v1/cart/setCouponCartJson/',
          type: 'POST',
          data: {couponCode: code},
          success: (responseget) => {
            var value = responseget.cart.summary.prices.total.renderedPrice;
            var elTotal = value.replace(/[^0-9\.]+/g, "");                           
            callback(elTotal);
          }
        });
      },
      applyBestCode: (bestCode) => {
          $.ajax({
          url: 'https://'+window.location.hostname+'/services/api/v1/cart/setCouponCartJson/',
          type: 'POST',
          data: {couponCode: bestCode},
          success: () => {location.reload(); },
          error: () => {location.reload(); }
        });
      }
    },
  
    vitacost: {
      id: 5346, 
      preApplyCodes: function(callback) {
        const elTotal = document.querySelector("#orderSummary dd.total");
        const value   = elTotal ? 
                      convertNumbers(elTotal.textContent.replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        this.requestData = extractFormValues('#Form1');
        callback(value);
      },
      applyCode: function(code, callback) {
        this.requestData.set('IamMasterFrameYesIam$ctl02$txtPromotion', code);
        this.requestData.set('IamMasterFrameYesIam$ctl02$btnPromoUpdate', 'Apply');
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            var d = document.implementation.createHTMLDocument('');
            d.documentElement.innerHTML = DOMPurify.sanitize(xhr.response);
            const elTotal = d.querySelector('#orderSummary dd.total');
            const value   = elTotal ? 
                              convertNumbers(elTotal.textContent.replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
            callback(value);
          }
        };
        xhr.open('POST', this.requestData.action);
        xhr.withCredentials = true;
        xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(this.requestData);
      },
      applyBestCode: function(bestCode) {
        document.querySelector('[id*=Promo] input[name*=IamMasterFrame][type=text]').value = bestCode;
        document.querySelector('[id*=Promo] input[type=submit]').click();
      }
    },
  
    walgreens: {
      id: 1915, 
      preApplyCodes: function(callback) {        
           if(window.location.href.indexOf("view-ui") > -1){
            const elTotal = $(".wag-cart-order-summary-items .product__price");
            const value   = elTotal.length > 0 ? 
                            convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) / 100 : 
                            Number.POSITIVE_INFINITY;
             const elCouponCode = $('#wag-cart-code-0');
            if (elCouponCode.length > 0) {
              const csrf = $('meta[name="_csrf"]').attr('content');
              $.ajax({
                url: 'https://www.walgreens.com/cart/v1/promos',
                type: 'POST',
                headers: {
                  'X-XSRF-TOKEN': csrf
                },
                data: { action: 'delete', couponCode: elCouponCode.text().trim() },
                success: () => {
                  callback(value);
                }
              });
            } else {
              callback(value);
            }
        }else{
           const elTotal = $("#totalAmount");
           const value   = elTotal.length > 0 ? 
                              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
          callback(value);
        }
      },
      applyCode: function(code, callback) {
         if(window.location.href.indexOf("view-ui") > -1){
            const csrf = $('meta[name="_csrf"]').attr('content');
            const self = this;
            $.ajax({
              url: 'https://www.walgreens.com/cart/v1/promos',
              type: 'POST',
              headers: {
                'X-XSRF-TOKEN': csrf
              },
              data: { action: 'add', couponCode: code },
              success: function(data) {
                const value = data.orderPriceInfo ? data.orderPriceInfo.finalOrderPrice / 100 : Number.POSITIVE_INFINITY;
                self.lastAppliedCode = code;
                
                if (self.lastAppliedCode) {
                  self._removeAppliedCode(() => {
                    callback(value);
                  });
                } else {
                  callback(value);
                }
              }
            });
        }else{
            const csrf = $('meta[name="csrf-token"]').attr('content');
            const windowVariables = retrieveWindowVariables(["cartDataInfo"]);
            const order_id = windowVariables.cartDataInfo._id;
            $.ajax({
              url: 'https://photo.walgreens.com/cart/updatecart',
              type: 'POST',
              headers: {
                'x-csrf-token': csrf
              },
              data: { 'promotionName': code , source: 'cart', order_id: order_id },
              success: function(data) {
                const total = data.response[0].resource.productTotal;
                const totalDiscount = data.response[0].resource.productDiscount.totalDiscount;
                const value = total - totalDiscount;
                callback(value);                
              }
            });
        }
      },
      applyBestCode: function(bestCode) {
        document.querySelector('#wag-cart-enter-code, #couponField').value = bestCode;
        document.querySelector('#wag-cart-enter-code, #couponField').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('#wag-cart-apply-code, #applyCoupon').click();
      },
      _removeAppliedCode: function(callback) {
        const csrf = $('meta[name="_csrf"]').attr('content');
        $.ajax({
          url: 'https://www.walgreens.com/cart/v1/promos',
          type: 'POST',
          headers: {
            'X-XSRF-TOKEN': csrf
          },
          data: { action: 'delete', couponCode: this.lastAppliedCode },
          success: function() {
            callback();
          }
        });
      }
    },

    worldmarket: {
      id: 4308, 
      preApplyCodes: (callback) => {
        const elTotal = $('#EstTaxShipItemTable_estBasketTotal');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {
        $.ajax({
          url: 'https://www.worldmarket.com/basket.do?method=applySourceCode&r=0.6955568034725697',
          type: 'POST',
          data: { sourceCode: code },
          success: function() {
            $.ajax({
              url: 'https://www.worldmarket.com/basket.do',
              type: 'GET',
              success: function(data) {
                const elTotal = $(data).find('#EstTaxShipItemTable_estBasketTotal');
                const value = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
                $.ajax({
                  url: 'https://www.worldmarket.com/wmBasket.do?method=removeSourceCode&r=0.6576311557150023',
                  type: 'POST',
                  data: { sourceCode: code },
                  success: function() {
                    callback(value);
                  }
                });
              }
            });
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#sourceCode').value = bestCode;
        document.querySelector('#sourceCode').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('.form_but.sourceCodeApplyBtn.ml-secondary-button').click();
      }
    },

    bodenusa: {
      id: 463, 
      preApplyCodes: function(callback) {
        const elTotal = $('#shoppingBagTotalPrice');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.last().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        var ts = Math.round(new Date().getTime());
        $.ajax({
          url: 'https://checkout.bodenusa.com/en-US/Offer-Code?code='+code+'&emptyCodeInvalid=true&_='+ts,
          type: 'GET',
          success: () => {
            var ts2 = Math.round(new Date().getTime());
            $.ajax({
              url: `https://checkout.bodenusa.com/en-US/ShoppingBag/Index?_=`+ts2,
              type: 'GET',
              success: (response) => {
                const elTotal = $(response).find('#shoppingBagTotalPrice');
                const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.last().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
                callback(value);
              },
              error: (xhr, status, error) => {
                console.log(error);
                callback(Number.POSITIVE_INFINITY);
              }
            })
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#code').value = bestCode;
        document.querySelector('#code').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('#btnApplyCode').click();
      }
    },

    thompsoncigar: {
      id: 5068, 
      preApplyCodes: function(callback) {
        const elTotal = $('.cart-ordertotal .price-amount').data('value');
        callback(elTotal);
      },
      applyCode: function(code, callback) {
        const formData = getFormFieldsAsJson(document.querySelector('#cart-form'));
        formData['PromoCode'] = code;
        formData['PayPromoSubmit'] = '';        
         $.post('https://www.thompsoncigar.com/cart/', formData, 
          () => {
            const url = 'https://www.thompsoncigar.com/cart/';
            $.get(url, 
              (response) => {
                const value = $(response).find('.cart-ordertotal .price-amount').data('value');                
                callback(value);
                formData2 = formData;
                delete formData2['PayPromoSubmit'];
                formData2['PromoCode'] = '';
                formData2['PromoCode-Remove'] = code;
                   $.post('https://www.thompsoncigar.com/cart/', formData2, 
                    () => { });
              });
          });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#PayPromoCode').value = bestCode;
        document.querySelector('#PayPromoCode').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('#payment-promo-code').click();
      }
    },

  jomashop: {
    id: 1034,
    removePrevCode: function(code, callback) {
     const cartId = JSON.parse(localStorage.getItem('M2_VENIA_BROWSER_PERSISTENCE__cartId')).value.replace(/"/g,'');
     $.ajax({
        url: 'https://www.jomashop.com/graphql',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          operationName: 'removeSingleCouponFromCart',
          query: 'mutation removeSingleCouponFromCart($cartId: String!, $couponCode: String!) { applyCouponToCart(input: { cart_id: $cartId,  coupon_code: $couponCode }) { cart { prices { grand_total { value currency __typename } }  __typename } __typename } }',
          variables : {cartId : cartId, couponCode: code }
        }),
        success: (response) => {
          callback();
        },
        error: (xhr, status, error) => {
           callback();
        }
      });
    },
    preApplyCodes: function(callback) {
    console.log('jomashop'); 
      const elTotal = $('div:contains("Grand Total") +div:first, .cart-grand-total .cart-discount-value');
      const prevValue = elTotal.length > 0 ? 
                        convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      if(document.querySelector('.rmv-coupon')){
        const prevCode = $('.rmv-coupon').get(0).childNodes[0].nodeValue.replace(/"/g,'');
        this.removePrevCode(prevCode, () => callback(prevValue,prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.href= 'https://www.jomashop.com/checkout';
      });   
    },
    _applyCode: (code, callback) => {
      const cartId = JSON.parse(localStorage.getItem('M2_VENIA_BROWSER_PERSISTENCE__cartId')).value.replace(/"/g,'');
       $.ajax({
          url: 'https://www.jomashop.com/graphql',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            operationName: 'applyCouponToCart',
            query: 'mutation applyCouponToCart($cartId: String!, $couponCode: String!) { applyCouponToCart(input: { cart_id: $cartId,  coupon_code: $couponCode }) { cart { prices { grand_total { value currency __typename } }  __typename } __typename } }',
            variables : {cartId : cartId, couponCode: code }
          }),
          success: (response) => {
            if(response.data.applyCouponToCart){
              const value = response.data.applyCouponToCart.cart.prices.grand_total.value;
              callback(value);
            }else{
              callback(Number.POSITIVE_INFINITY);
            }
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
    },
  },

     opticsplanet: {
      id: 2758, 
      preApplyCodes: function(callback) {
         const elTotal = $('#order-summary-right-panel .e-order-summary .e-order-summary-heading__new, .e-total_grandtotal');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
         $.get('https://www.opticsplanet.com/checkout/apply-coupon?code='+code, 
          (response) => {
            if(response.totals){
                const value = response.totals.total_grandtotal;               
                $.get('https://www.opticsplanet.com/checkout/apply-coupon?code=', 
                  (response) => { });
                callback(value);
            }else{
              callback(Number.POSITIVE_INFINITY);
            }
          });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#op_order_couponCode').value = bestCode;
        document.querySelector('#op_order_couponCode').dispatchEvent(new MouseEvent('input', {bubbles: true}));
       setTimeout(function(){
        document.querySelector('#coupon-block-container .checkout-apply-button-container .checkout-apply-button').click();
      }, 1000);
      }
    },

    sears: {
      id: 20, 
      preApplyCodes: function(callback) {
        const elTotal = $('.est-total-bottom strong, .price-row.ng-scope [class*="orderSummary"] + span.ng-binding');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
         var type = 'ccil';
         var authorization = 'SEARSMWEB';
         var ts = Math.round(new Date().getTime());
         var ts2 = Math.round(new Date().getTime());
         var ts3 = Math.round(new Date().getTime());
         var time1 = time2 = time3 = "";
        if(window.location.hostname != 'm.sears.com'){
          type = 'crsp';
          time1 = '?ts='+ts;
          time2 = '?ts2='+ts;
          time3 = '?ts3='+ts;
          authorization = '';
        }
        var type = window.location.hostname == 'm.sears.com'?'ccil':'crsp';
        var ts = Math.round(new Date().getTime());
        const body = {
          couponRequest: {couponCode: code },
        };
        $.ajax({
          url: 'https://'+window.location.hostname+'/'+type+'/api/cart/v1/coupon/add'+time1,
          type: 'POST',
          data: JSON.stringify(body),
          headers:{
            authorization : authorization
          },
          contentType: 'application/json;charset=UTF-8',
          success: () => {
            var ts2 = Math.round(new Date().getTime());
            $.ajax({
              url: `https://`+window.location.hostname+`/`+type+`/api/cart/v1/view`+time2,
              type: 'GET',
              headers:{
                authorization : authorization
              },
              success: (data) => {
                const value = data.response.cartSummary.mrchSubTot;                
                var ts3 = Math.round(new Date().getTime());
                $.ajax({
                  url: 'https://'+window.location.hostname+'/'+type+'/api/cart/v1/coupon/remove'+time3,
                  type: 'POST',
                  headers:{
                    authorization : authorization
                  },
                  data: JSON.stringify(body),
                  contentType: 'application/json;charset=UTF-8',
                  success: () => { callback(value); },
                  error: () => { callback(value); }
                });
              },
              error: (xhr, status, error) => {
                callback(Number.POSITIVE_INFINITY);
              }
            })
          },
          error: (xhr, status, error) => {
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('[ng-model=couponCode], [ng-model="code"]').value = bestCode;
        document.querySelector('[ng-model=couponCode], [ng-model="code"]').value = bestCode;
        document.querySelector('[ng-model=couponCode], [ng-model="code"]').dispatchEvent(new MouseEvent('input', {bubbles: true}));
         setTimeout(function(){
          document.querySelector('.cc-add, .btn-promo-submit').click();
          location.reload();
        }, 1000);
      }
    },

    fromyouflowers: {
      id: 2287, 
      preApplyCodes: function(callback) {
        const windowVariables = retrieveWindowVariables(["dJSON"]);
        const prevValue = windowVariables["dJSON"].orderTotals.orderTotal;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        $.ajax({
          url: 'https://www.fromyouflowers.com/cart.htm?action=applyDiscountCode',
          type: 'POST',
          headers:{
            'content-type': 'application/json;charset=UTF-8'
          },
          data: JSON.stringify({discountCode: code}),
          success: (response) => {
            $.get('https://www.fromyouflowers.com/cart.htm', (responseGet) => {
              const dJSON = responseGet.indexOf("dJSON");
              const onAmazonLoginReady = responseGet.indexOf("window.onAmazonLoginReady");
              const finalIndex = onAmazonLoginReady-dJSON;
              const data = JSON.parse(responseGet.substr(responseGet.indexOf("dJSON")+8, finalIndex-12));
              const value = data.orderTotals.orderTotal;
              callback(value);
            });
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        $.ajax({
          url: 'https://www.fromyouflowers.com/cart.htm?action=applyDiscountCode',
          type: 'POST',
          headers:{
            'content-type': 'application/json;charset=UTF-8'
          },
          data: JSON.stringify({discountCode: bestCode}),
          success: () => { location.reload(); },
          error: () => { location.reload(); }
        });
      }
    },

  staples_us: {
      id: 4, 
      preApplyCodes: function(callback) {
        const elTotal = $('.cart__bottom_cartSummary_container .cart__total_price.cart__textAlignRight, .coupon-drawer__order_total span:last, .order-summary__order_total .order-summary__item_value_text:not(:contains("$0.00")):not(:empty)');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;        
        callback(prevValue);
      },
      applyCode: function(code, callback) {      
       const body = {  coupons: [code] };
        $.ajax({
          url: 'https://'+window.location.hostname+'/cc/api/checkout/default/coupon?responseType=WHOLE&mmx=true&dp=Coupon',
          type: 'POST',
          data: JSON.stringify(body),
          contentType: 'application/json;charset=UTF-8',
          success: (response) => {
           if(response.cartInfo.cartSummary){
              const orderValueEl = response.cartInfo.cartSummary.ordTotal;            
              callback(orderValueEl);
            }else{
              callback(Number.POSITIVE_INFINITY);
            }
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        location.reload();  
      }
    },

    gap: {
      id: 189, 
      preApplyCodes: function(callback) {
        console.log('gap');
        const elTotal = $('.total-price:last:not(:contains("$0.00"))');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;        
        callback(prevValue);
      },
      applyCode: function(code, callback) {      
          const windowVariables = retrieveWindowVariables(["window.__SHOPPING_BAG_STATE__"]);
          const shopperId = windowVariables["window.__SHOPPING_BAG_STATE__"].shopperId;
          const locale = windowVariables["window.__SHOPPING_BAG_STATE__"].locale;
          const market = windowVariables["window.__SHOPPING_BAG_STATE__"].market;
          const brand = windowVariables["window.__SHOPPING_BAG_STATE__"].brandAbbr;
          $.ajax({
              url: 'https://'+window.location.hostname+'/shopping-bag/xapi/apply-bag-promo-action/'+shopperId,
              type: 'POST',
              data: JSON.stringify({promoCode:code}),
              contentType: 'application/json;charset=UTF-8',
                headers: {
                'accept': 'application/json, text/plain, */*',
                'guest': 'true',
                'shoppingbagid': '',
                'locale': locale,
                'market': market.toUpperCase(),
                'bag-ui-leapfrog': false,
                'brand': brand,
                'channel': 'WEB'
              },
              success: (response) => {
                if(response.summaryOfCharges){
                  const value = response.summaryOfCharges.myTotal;           
                  callback(value);
                }else{
                  callback(Number.POSITIVE_INFINITY);
                }
              },
              error: (xhr, status, error) => {
                 callback(Number.POSITIVE_INFINITY);
              }
            });       
      },
      applyBestCode: (bestCode) => {
        location.reload();
      }
    },

    gapfactory: {
      id: 23967, 
      preApplyCodes: function(callback) {
        const elTotal = $('.total-price, .sds_tx_right.orderSummary__totalText');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;        
        callback(prevValue);
      },
      applyCode: function(code, callback) {      
        const windowVariables = retrieveWindowVariables(["window.__SHOPPING_BAG_STATE__"]);
        const shopperId = windowVariables["window.__SHOPPING_BAG_STATE__"].shopperId;
        const locale = windowVariables["window.__SHOPPING_BAG_STATE__"].locale;
        const market = windowVariables["window.__SHOPPING_BAG_STATE__"].market;
        const brand = windowVariables["window.__SHOPPING_BAG_STATE__"].brandAbbr;
        $.ajax({
            url: 'https://'+window.location.hostname+'/shopping-bag/xapi/apply-bag-promo-action/'+shopperId,
            type: 'POST',
            data: JSON.stringify({promoCode:code}),
            contentType: 'application/json;charset=UTF-8',
              headers: {
              'accept': 'application/json, text/plain, */*',
              'guest': 'true',
              'shoppingbagid': '',
              'locale': locale,
              'market': market.toUpperCase(),
              'bag-ui-leapfrog': false,
              'brand': brand,
              'channel': 'WEB'
            },
            success: (response) => {
              if(response.summaryOfCharges){
                const value = response.summaryOfCharges.myTotal;           
                callback(value);
              }else{
                callback(Number.POSITIVE_INFINITY);
              }
            },
            error: (xhr, status, error) => {
               callback(Number.POSITIVE_INFINITY);
            }
        });  
      },
      applyBestCode: (bestCode) => {
        location.reload();
      }
    },


    puritan: {
      id: 1406, 
      preApplyCodes: function(callback) {
        const elTotal = $('.total-amount.grand-total');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;        
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const formData = getFormFieldsAsJson(document.querySelector('#applyCouponForm'));        
        formData['CouponCode'] = code;
          $.ajax({
              url: 'https://www.puritan.com/shoppingcart/applyCoupon',
              type: 'POST',
              data: formData,
              contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
              success: (responseGet) => {
                  const elTotal = $(responseGet).find('.total-amount.grand-total');
                  var value = 0;
                  if( elTotal.length > 0 ){
                     $( elTotal ).each(function( index ) {
                      value += convertNumbers($( this ).text().replace( /[^0-9.,]/g, '').trim());                
                     });
                  }else{
                      value = Number.POSITIVE_INFINITY;
                  }
                   callback(value);
              },
              error: (xhr, status, error) => {
                 callback(Number.POSITIVE_INFINITY);
              }
            });
       
      },
      applyBestCode: (bestCode) => {
        document.querySelector('input[name="CouponCode"]').value = bestCode;
        document.querySelector('input[name="CouponCode"]').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('input[name="ApplyCoupon"]').click(); 
      }
    },

    parkseed: {
      id: 4683, 
      preApplyCodes: function(callback) {
        const elTotal = $('.cart-total');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        $.ajax({
          url: 'https://parkseed.com/cart.aspx',
          type: 'POST',
          data: {
            formName: 'dmiformCouponKeycodeHandler',
            pageURL: 'cart.aspx',
            keycode: code
          },
          success: () => {
            $.get('https://parkseed.com/cart.aspx', (responseGet) => {
              const elTotal = $(responseGet).find('.cart-total');
              var value = 0;
              if( elTotal.length > 0 ){
                 $( elTotal ).each(function( index ) {
                  value += convertNumbers($( this ).text().replace( /[^0-9.,]/g, '').trim());                
                 });
              }else{
                  value = Number.POSITIVE_INFINITY;
              }
              
              callback(value);
            });
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('input[name="keycode"]').value = bestCode;
        document.querySelector('input[name="keycode"]').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('.apply-promo-btn').click();  
      }
    },

  overstock: {
      id: 6,
      preApplyCodes: function(callback) {
        const elTotal = $('#checkoutForm .total-details-item.order-total dd:contains($), #orderTotalDisplayAmount, .total-type-GRAND_TOTAL .total-value, .your-total span:last-child');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;        
        callback(prevValue);
      },
      applyCode: function(code, callback) {      
        const formData = getFormFieldsAsJson(document.querySelector('#checkoutForm'));
        formData['UsePromoCode'] = 'on';
        formData['PromoCode'] = code;
        $.post('https://www.overstock.com/processorder?json=true&reqType=node-promoCode', formData, 
          (response) => {
           const value = response.checkoutWithMeta.totals.totalAmount.numericValue;
           callback(value);
        });
      },
      applyBestCode: (bestCode) => {
        try {document.querySelector('#promo-trigger').click()} catch (e) {document.querySelector('#promoCodeCheckbox').click()}
        document.querySelector('[name="PromoCode"]').value = bestCode;
        document.querySelector('[name="PromoCode"]').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('.promo-code-container [aria-label="promo code apply button"]').click();
      }
    },

    blinds: {
      id: 3783, 
      preApplyCodes: function(callback) {  
        const elTotal = $('[data-testid="gcc-cart-summary-totalsubtotal"]');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
       const windowVariables = retrieveWindowVariables(["window.NREUM"]);
       const xpid = windowVariables["window.NREUM"].loader_config.xpid;
       $.ajax({
          url: 'https://www.blinds.com/Ordering/Promo/Apply',
          type: 'POST',
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-newrelic-id': xpid
          },
          data: {
            promoCode: code,
          },
          success: (data) => {
           const elTotal = $(data).find('[data-testid="gcc-cart-summary-totalsubtotal"]');
           const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;                
            $.ajax({
              url: 'https://www.blinds.com/Ordering/Promo/Remove',
              type: 'POST',
              headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'x-newrelic-id': xpid
              },
              data: {
                promoCode: code,
              },
              success: (data) => { callback(value); },
              error: (data) => { callback(value); }
            });
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#apply-promo-input').value = bestCode;
        document.querySelector('#apply-promo-input').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('#apply-promo-button').click();       
      }
    },

    adameve: {
      id: 4994, 
      preApplyCodes: function(callback) {
        const elTotal = $('#cart-summary tr:nth-child(3) td:nth-child(2)');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const url = 'https://www.adameve.com/shoppingcart.aspx';
        const formData = getFormFieldsAsJson(document.querySelector('#source-code-form'));
         formData['sourceCode'] = code;
         $.post(url, formData, 
            (responsePost) => {
              $.get('https://www.adameve.com/shoppingcart.aspx', (response) => {
                const total = $(response).find('#cart-summary tr:nth-child(3) td:nth-child(2)'); 
                const value = total.length > 0 ? 
                      convertNumbers(total.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
                callback(value);                      
                  });
            });       
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#source-code-form input[name="sourceCode"]').value = bestCode;
        document.querySelector('#source-code-form input[name="sourceCode"]').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('#sourceCode-button').click();  
      }
    },


    'lenovo' : {
      id: 203,
      preApplyCodes: function(callback) {
        const elTotal = $('#orderSummaryPart .cart-summary-pricingTotal .price-calculator-cart-summary-totalPriceWithTax');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
         callback(prevValue);
      },
      applyCode: function(code, callback) {
        const form = document.querySelector('form#ecouponForm');
        const url = $('form#ecouponForm').attr('action');
        const formData = getFormFieldsAsJson(form);
        formData['couponCode'] = code;
        formData['voucherCode'] = code;
        $.ajax({
          url: 'https://www.lenovo.com'+url,
          type: 'POST',
          data: formData,
          success: (data, textStatus, request) => {
            const locationUrl = request.getResponseHeader('location');
             $.get(locationUrl, 
              (response) => {
                    const elTotal = $(response).find('#orderSummaryPart .cart-summary-pricingTotal .price-calculator-cart-summary-totalPriceWithTax');
                    const value = elTotal.length > 0 ? 
                          convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
                    callback(value);
              });
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: function(bestCode) {
        document.querySelector('#couponCode').value = bestCode;
        document.querySelector('#couponCode').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('#couponCode').dispatchEvent(new Event('keyup'));
        document.querySelector('#couponCode').dispatchEvent(new Event('blur')); 
        document.querySelector('#couponCode').dispatchEvent(new Event('focus'));        
        document.querySelector('#cart-summary-ecouponForm-button').click();
      }
    },


    'onepeloton' : {
      id: 39222,
      preApplyCodes: function(callback) {
        const elTotal = $('[data-test-id="orderTotal"]');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
         document.querySelector('[data-test-id="revealCouponCodeInput"]').click();
         callback(prevValue);
      },
      applyCode: function(code, callback) {
        $.ajax({
          url: 'https://api.onepeloton.com/ecomm/add_coupon/'+code,
          type: 'POST',
          headers: {
                 'Content-Type': 'application/json',
              },
          data: JSON.stringify({  coupons_v_2: 'true', renders_light_cart: 'true' }),
          success: (response) => {
            const value = (response.data.cart.total.totalInCents)/100;
            callback(value.toFixed(2));
                $.post('https://api.onepeloton.com/ecomm/remove_coupon/'+code,
                   (responsePost) => {
                   });
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: function(bestCode) {        
        document.querySelector('#promoCode').value = bestCode;
        document.querySelector('#promoCode').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('[data-test-id="applyCouponCode"]').click();
      }
    },


    applebees: {
      id: 7867, 
      preApplyCodes: function(callback) {
        const elTotal = $('.c-ordertotal__totalvalue, .c-cart-checkout-cost');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;        
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const basketId = $('#basketId').val();
        const reqToken = $('input[name="__RequestVerificationToken"]').val();
        const body =  {
              basketId: basketId,
              couponcode: code,
              __RequestVerificationToken: reqToken
            };
        $.ajax({
          url: 'https://www.applebees.com/api/dineequity/menu/basket/coupon',
          type: 'PUT',
          data: body,
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          success: (response) => {
            if(response.total && response.total != '0'){
              var value;
              if(document.location.pathname.indexOf("/order/cart") === 0){
                 value = response.total-response.salestax;
              }else{
                 value = response.total;
              }                                          
                
              $.ajax({
                url: 'https://www.applebees.com/api/dineequity/menu/basket/coupon',
                type: 'DELETE',
                data: body,
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                success: (response) => { callback(value); },
                error: (response) => { callback(value); }
              });
            }else{
              callback(Number.POSITIVE_INFINITY);
            }
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('input[name="txtPromoCode"]').value = bestCode;
        document.querySelector('input[name="txtPromoCode"]').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('#btnPromoApply').click(); 
      }
    },


    redbubble: {
      id: 7249, 
      preApplyCodes: function(callback) {
        const elTotal = $('[class*="Summary_boldRow"] span:last');
        const csrf = $('meta[name="csrf-token"]').attr('content'); 
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
         $.ajax({
          url: 'https://www.redbubble.com/cart/coupon.json',
          type: 'DELETE',
          headers: {
              'x-csrf-token': csrf
            },
          success: () => { callback(prevValue); },
          error: () => { callback(prevValue); }
        });
      },
      applyCode: function(code, callback) {
        const csrf = $('meta[name="csrf-token"]').attr('content');  
        const body =  {
              coupon_code: code
            };
        $.ajax({
          url: 'https://www.redbubble.com/cart/coupon.json',
          type: 'PUT',
          data: body,
           headers: {
            'x-csrf-token': csrf
          },
          success: (response) => {
           $.get('https://www.redbubble.com/cart.json', (responseGet) => {                         
              const value = responseGet.summary.total;              
               $.ajax({
                url: 'https://www.redbubble.com/cart/coupon.json',
                type: 'DELETE',
                headers: {
                    'x-csrf-token': csrf
                  },
                success: (response) => { callback(value); },
                error: (response) => { callback(value); }
              });
            });
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });       
      },
      applyBestCode: (bestCode) => {
        const csrf = $('meta[name="csrf-token"]').attr('content');
        $.ajax({
          url: 'https://www.redbubble.com/cart/coupon.json',
          type: 'PUT',
          data: {
                  coupon_code: bestCode
                },
           headers: {
            'x-csrf-token': csrf
          },
          success: (response) => { 
            location.reload();
          }
        });
      }
    },


    brownells: {
      id: 489, 
      preApplyCodes: function(callback) {
        const elTotal = $('#divTotalAmt');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const windowVariables = retrieveWindowVariables(["S_T","K_M" ]);
        const S_T = windowVariables['S_T'];
        const K_M = windowVariables['K_M'];
        const ts = Math.round(new Date().getTime());
         $.ajax({
          url: 'https://www.brownells.com/asmx/BrownellsWebService_Checkout.asmx/ApplyPromoCoupon?'+ts,
          type: 'POST',
          data: JSON.stringify({ promoCode: code}),
           headers: {
                    'content-type': 'application/json;charset=UTF-8',
                    'km' : K_M,
                    'securityticket' : S_T
                  },
          success: (response) => {
              const eltotal = JSON.parse(response.d);
              const value = eltotal.OrderTotal;
              const ts2 = Math.round(new Date().getTime());
                $.ajax({
                  url: 'https://www.brownells.com/asmx/BrownellsWebService_Checkout.asmx/RemovePromoCoupon?'+ts2,
                  type: 'POST',
                  data: JSON.stringify({ promoCode: code}),
                   headers: {
                            'content-type': 'application/json;charset=UTF-8',
                            'km' : K_M,
                            'securityticket' : S_T
                          },
                  success: (response) => { callback(value); },
                  error: (response) => { callback(value); }
                });
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#txtCouponPromo').value = bestCode;
        document.querySelector('#txtCouponPromo').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('#btnCouponPromo').click();       
      }
    },

  coldwatercreek: {
      id: 3587,
      preApplyCodes: function(callback) {
        const elTotal = $('#secondary .bag-summary .order-totals-row.order-total .order-totals-value');
        const prevValue = elTotal.length > 0 ? 
                        convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        $.get('https://www.coldwatercreek.com/on/demandware.store/Sites-coldwater_us-Site/default/Cart-AddCouponJson?couponCode='+code+'&format=ajax', 
          (response) => {
           const value = response.baskettotal;
           callback(value);                      
          });
      },
      applyBestCode: function(bestCode) {
        document.querySelector('input[name="dwfrm_cart_couponCode"]').value = bestCode;
        document.querySelector('input[name="dwfrm_cart_couponCode"]').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('#add-coupon').click();
      }
    },

    collectionsetc: {
      id: 583,
      preApplyCodes: function(callback) {
        const elTotal = $('div.row.order-summary-totals-total, div#cart-summary-order-total');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
         $.post('https://www.collectionsetc.com/api/Cart/ApplyPromoCode/'+code , (data) => {
         var ts = Math.round(new Date().getTime());
             $.get('https://www.collectionsetc.com/api/Cart/?_='+ts, (response) => {
              var elTotal;
              if(document.location.pathname.indexOf("/shopping/cart/") === 0){
                 elTotal = response.OrderSummary.CartOrderTotal;
              }else{
                 elTotal = response.OrderSummary.OrderTotal;
              }                
                callback(elTotal);
                 $.post('https://www.collectionsetc.com/api/Cart/ApplyPromoCode/undefined' , (data) => {
                          //
                    });
              });
          });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#promo-code, #coupon-code').value = bestCode;
        document.querySelector('#promo-code, #coupon-code').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('#btn-apply-promo-code, #promo-code-apply').click();
      }
    },

  luckyvitamin: {
      id: 6117,
      preApplyCodes: function(callback) {
        const elTotal = $('.cart__grand-total .cart__grand-total-value');
        const prevValue = elTotal.length > 0 ? 
                        convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
       const ts = Math.round(new Date().getTime());
       $.ajax({
          url: 'https://www.luckyvitamin.com/api/Cart/RemovePromoCodeValue?promoCode=remove&isVoucher=false&_='+ts,
          type: 'GET',
          success: () => {callback(prevValue);  },
          error: () => {  callback(prevValue); }
        });       
      },
      applyCode: function(code, callback) {
        this.preApplyCodes(() => {
         const ts = Math.round(new Date().getTime());
          $.ajax({
            url: 'https://www.luckyvitamin.com/api/Cart/AddPromoCodeValue?promoCode='+code+'&optimoveEmail=&_='+ts,
            type: 'GET',
            success: (response) => {
              const elTotal = response.grandTotal;
              const value = elTotal ? 
                    convertNumbers(elTotal.replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
              callback(value);
            },
            error: () => {
              callback(Number.POSITIVE_INFINITY);
            }
          });
        });
      },
      applyBestCode: function(bestCode) {
        const ts = Math.round(new Date().getTime());
        $.ajax({
          url: 'https://www.luckyvitamin.com/api/Cart/AddPromoCodeValue?promoCode='+bestCode+'&optimoveEmail=&_='+ts,
          type: 'GET',
          success: () => { location.reload(); },
          error: () => { location.reload(); }
        });  
      }
    },

   revolve: {
      id: 1432, 
      preApplyCodes: function(callback) {
        const elTotal = $('.cart-summary-total');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;        
        callback(prevValue);
      },
      applyCode: function(code, callback) {         
        $.ajax({
          url: 'https://www.revolve.com/r/ajax/ApplyPromoCode.jsp',
          type: 'POST',
          data: {promo: code, scope: ''},
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          success: (responsepost) => {
             $.ajax({
                url: 'https://www.revolve.com/r/ipadApp/checkout/CartItemSummary.jsp',
                type: 'POST',
                success: (response) => {
                  const value = response.totalAmount;                    
                  $.ajax({
                      url: 'https://www.revolve.com/r/ajax/ApplyPromoCode.jsp',
                      type: 'POST',
                       data: {promo: '', scope: ''},
                      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                      success: (responseGet) => { callback(value); },
                      error: (responseGet) => { callback(value); }
                    });
              }
            });
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });       
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#default-promocode-block').click()
        setTimeout(function(){
          document.querySelector('#coupon_code').value = bestCode;
          document.querySelector('#coupon_code').dispatchEvent(new Event('input', {bubbles: true}));
          document.querySelector('#coupon_code_button').click(); 
         }, 1500);  
      }
    },

    bouqs: {
      id: 8393,
      preApplyCodes: function(callback) {
        const elTotal = $('.table__total td');
        const prevValue = elTotal.length > 0 ? 
                        convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const formData = getFormFieldsAsJson(document.querySelector('form#promo_code_form'));       
        formData['promo_code'] = code;
        $.ajax({
          url: 'https://bouqs.com/cart/add_promo_code',
          type: 'POST',
          data: formData,
          success: (data, textStatus, request) => {
            const locationUrl = request.getResponseHeader('location');
            $.get(locationUrl, 
              (response) => {
                const elTotal = $(response).find('.table__total td');
                const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
                callback(value);
              });
            },
              error: (xhr, status, error) => {
                 callback(Number.POSITIVE_INFINITY);
              }
          });
      },
      applyBestCode: function(bestCode) {
        document.querySelector('#promo_code').value = bestCode;
        document.querySelector('#promo_code').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('button[value="add_promo_code"]').click()
      }
    },

    teleflora: {
      id: 1602,
      preApplyCodes: function(callback) {
        const elTotal = $('span.m-billing-review-grand-total');
        const prevValue = elTotal.length > 0 ? 
                        convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
        const prevCode = $('[class*="m-billing-promo-code-individual-entry"]').text();        
        if(prevCode){
          this._removeCode(prevCode, function() {
           callback(prevValue,prevCode);
          });
        }else{
          callback(prevValue);
        }
        
      },
      applyCode: function(code, callback) {
        const formData = getFormFieldsAsJson(document.querySelector('form[name="couponCodeForm"]'));
        formData['couponCode'] = code;
        formData['orgCouponCode'] = code;
        formData['couponCodeBtn'] = 'Submit';
        formData['_D:couponCodeBtn'] = '';
        $.ajax({
          url: 'https://www.teleflora.com/checkout/billing_review.jsp?_DARGS=/checkout/billing_review.jsp.couponCodeForm',
          type: 'POST',
          data: formData,
          contentType: 'application/x-www-form-urlencoded',
          success: (response) => {           
                const elTotal = $(response).find('span.m-billing-review-grand-total');
                const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
           this._removeCode(code, function() {
             callback(value);
            });           
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: function(bestCode) {
        document.querySelector('#promotionalCode').value = bestCode;
        document.querySelector('#promotionalCode').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('#coupnApply').click();
      },
    _removeCode: (code, callback) => {
      const formData2 = getFormFieldsAsJson(document.querySelector('form[name="couponCodeRemoveForm"]'));
      formData2['couponCode'] = code;
      formData2['orgCouponCode'] = code;
      formData2['couponCodeRemoveBtn'] = 'Submit';
      formData2['_D:couponCodeRemoveBtn'] = '';
      $.ajax({
        url: 'https://www.teleflora.com/checkout/billing_review.jsp?_DARGS=/checkout/billing_review.jsp.couponCodeRemoveForm',
        type: 'POST',
        data: formData2,
        contentType: 'application/x-www-form-urlencoded',
         success: () => { callback();  },
         error: () => { callback(); }
       }); 
    }
  },

    'dsw' : {
      id: 3836,
      preApplyCodes: function(callback) {
        const elTotal = $('div.checkout-order-summary__line-item__total div span:last-child');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
         callback(prevValue);
      },
      applyCode: function(code, callback) {       
        $.ajax({
          url: 'https://www.dsw.com/api/v1/coupons/claim?locale=en_US&pushSite=DSW',
          type: 'POST',
          data: JSON.stringify({couponClaimCode: code, cart: "shoppingcart" }),
          contentType: 'application/json;charset=UTF-8',
          success: (data, textStatus, request) => {
            const locationUrl = 'https://www.dsw.com/api/v1/cart/details?locale=en_US&pushSite=DSW';
             $.get(locationUrl, 
              (response) => {
                const value = response.order.priceInfo.total;
                  $.ajax({
                    url: 'https://www.dsw.com/api/v1/coupons/'+code+'?locale=en_US&pushSite=DSW',
                    type: 'DELETE',
                    success: (data, textStatus, request) => {
                       callback(value);
                    },
                    error: (xhr, status, error) => {
                       callback(value);                        
                    }
                  });
              });
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: function(bestCode) {
        document.querySelector('#promoCode').value = bestCode;
        document.querySelector('#promoCode').dispatchEvent(new Event('input', {bubbles: true}));      
        document.querySelector('form > button').click();
      }
    },

   logitech: {
      id: 1107,
      preApplyCodes: function(callback) {
        const elTotal = $('.dr_price.dr_totals, #qb-cart-summary .cs-subtotal .sub-value:last-child');        
        const prevValue = elTotal.length > 0 ? 
                        convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const formData = getFormFieldsAsJson(document.querySelector('form[name="ShoppingCartForm"]'));
        formData['couponCode'] = code;
        $.ajax({
          url: 'https://buy.logitech.com/store/',
          type: 'POST',
          data: formData,
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          success: (response) => {           
                const elTotal = $(response).find('.dr_price.dr_totals, #qb-cart-summary .cs-subtotal .sub-value:last-child');
                const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;   
                callback(value);             
                        
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: function(bestCode) {
        document.querySelector('#promoCode').value = bestCode;
        document.querySelector('#promoCode').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('.dr_couponCode .dr_button, #promoCode + input.dr_button').click();
      }
    },
    
    easeus: {
      id: 25519,
      preApplyCodes: function(callback) {
        const elTotal = $('.cbCartTotal .cbTtotal');        
        const prevValue = elTotal.length > 0 ? 
                        convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        $('.cbProductAdd').find('input:checkbox').val('0');
        const formData = getFormFieldsAsJson(document.querySelector('form[name="cleverForm"]'));
        const url = $('form[name="cleverForm"]').attr('action');
        formData['purchaseCouponCode'] = code;
        formData['buttonaddCoupon'] = 'Apply'; 
        $.ajax({
          url:  url,
          type: 'POST',
          data: formData,
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          success: (response) => {
                $('.cbProductAdd').find('input:checkbox').val('1');         
                const elTotal = $(response).find('.cbCartTotal .cbTtotal');
                const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;   
                callback(value);                        
          },
          error: (xhr, status, error) => {
            $('.cbProductAdd').find('input:checkbox').val('1');   
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: function(bestCode) {
        document.querySelector('input[name="purchaseCouponCode"]').value = bestCode;
        document.querySelector('input[name="purchaseCouponCode"]').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('input[name="buttonaddCoupon"]').click();
      }
    },

    jrcigars: {
      id: 16693,
      preApplyCodes: function(callback) {
        const elTotal = $('.products-subtotal .totals__value');        
        const prevValue = elTotal.length > 0 ? 
                        convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        $.ajax({
          url:  'https://www.jrcigars.com/on/demandware.store/Sites-JRCigars-Site/en_US/OnePageCheckout-AddCoupon',
          type: 'POST',
          data: JSON.stringify({couponCode: code}),
          contentType: 'application/json; charset=UTF-8',
          success: (response) => {           
                const value = response.totals.orderTotalValue;
                callback(value); 
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: function(bestCode) {
        document.querySelector('.coupon-redeem__code-input input[type="text"]').value = bestCode;
        document.querySelector('.coupon-redeem__code-input input[type="text"]').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('.coupon-redeem__cta').click();
      }
    },

    fossil: {
      id: 1956, 
      preApplyCodes: function(callback) {
         const elTotal = $('.grand-total-wrapper .grand-total');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
         const url = $('form[name="promo-code-form"]').attr('action');
        const csrf_token = $('.promo-code-form input[name="csrf_token"]').val();
         $.get('https://www.fossil.com'+url+'/?csrf_token='+csrf_token+'&couponCode='+code, 
          (response) => {
            if(response.totals){
                const value = response.totals.grandTotal;
                const totalValue = convertNumbers(value.replace( /[^0-9.,]/g, '').trim())
                const locale = response.locale;
                const uuid =  response.totals.discounts[0].UUID;
                $.get('https://www.fossil.com/on/demandware.store/Sites-fossil-na-Site/'+locale+'/Cart-RemoveCouponLineItem?code='+code+'&uuid='+uuid, 
                  (response) => {
              });
                callback(totalValue);
            }else{
              callback(Number.POSITIVE_INFINITY);
            }
          });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#couponCode').value = bestCode;
        document.querySelector('#couponCode').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('button.promo-code-btn').click();
      }
    },

    keh: {
      id: 24891, 
      preApplyCodes: function(callback) {
        const elTotal = $('#shopping-cart-totals-table tfoot tr:last-child td:last-child .price, #checkout-review-table tfoot tr.last td.last .price');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        $.ajax({
          url: 'https://www.keh.com/shop/checkout/cart/couponPost',
          type: 'POST',
          data: {
            remove: 0,
            coupon_code: code
          },
          success: (data, textStatus, request) => {
            const locationUrl = request.getResponseHeader('location');
            $.get(locationUrl , (responseGet) => {
              const elTotal = $(responseGet).find('#shopping-cart-totals-table tfoot tr:last-child td:last-child .price, #checkout-review-table tfoot tr.last td.last .price');
              var value = 0;
              if( elTotal.length > 0 ){
                 $( elTotal ).each(function( index ) {
                  value += convertNumbers($( this ).text().replace( /[^0-9.,]/g, '').trim());                
                 });
              }else{
                  value = Number.POSITIVE_INFINITY;
              }
              
              callback(value);
            });
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#coupon_code, #checkout-coupon').value = bestCode;
        document.querySelector('#coupon_code, #checkout-coupon').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('button[value="Apply"], input[value="Apply Coupon"]').click();  
      }
    },

    boscovs: {
      id: 24891, 
      preApplyCodes: function(callback) {
        const elTotal = $('#order_total');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        $.ajax({
          url: 'https://www.boscovs.com/shop/add-coupon.do?couponCode='+code,
          type: 'GET',
          success: (data, textStatus, request) => {
            const locationUrl = 'https://www.boscovs.com/shop/cart.do';
            $.get(locationUrl , (responseGet) => {
              const elTotal = $(responseGet).find('#order_total');
              const value = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;              
              callback(value);
            });
          },
          error: (xhr, status, error) => {
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#couponCode').value = bestCode;
        document.querySelector('#couponCode').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('#coupon-button').click();  
      }
    },

    finishline: {
      id: 805,
      preApplyCodes: function(callback) {
        const elTotal = $('#orderSummaryOrderTotal');
        const prevValue = elTotal.length > 0 ? 
                        convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const formData = getFormFieldsAsJson(document.querySelector('form#coupon_form'));       
        formData['/atg/commerce/promotion/CouponFormHandler.couponClaimCode'] = code;
        formData['/atg/commerce/promotion/CouponFormHandler.claimCoupon'] = 'claimCoupon';
        $.ajax({
          url: 'https://www.finishline.com/store/checkout/applyCouponJsonResponse.jsp?_DARGS=/store/cart/cartInner.jsp',
          type: 'GET',
          data: formData,
          success: (data, textStatus, request) => {
           if(document.location.pathname.indexOf("/store/cart/") === 0){
             const locationUrl = 'https://www.finishline.com/store/checkout/gadgets/checkoutOrderSummary.jsp?currentStage=cart&cartType=page';
              $.get(locationUrl, 
                (response) => {
                  const elTotal = $(response).find('#orderSummaryOrderTotal');
                  const value = elTotal.length > 0 ? 
                            convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                            Number.POSITIVE_INFINITY;
                  callback(value);
                });                     
            }else{
              const locationUrl = request.getResponseHeader('location');
              $.get(locationUrl, 
              (response) => {
                const elTotal = $(response).find('#orderSummaryOrderTotal');
                const value = elTotal.length > 0 ? 
                        convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
                callback(value);
              });
            }            
          }
        });
      },
      applyBestCode: function(bestCode) {
        document.querySelector('.couponCodeInput ').value = bestCode;
        document.querySelector('.couponCodeInput ').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('.applyCouponCode').click();
      }
    },

    campsaver: {
      id: 4249,
      preApplyCodes: function(callback) {
        const elTotal = $('#order-summary-right-panel .e-order-summary-heading__sum span:last-child, .e-total_grandtotal .e-total__value');
        var prevValue = elTotal.length > 0 ? 
                        convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY; 
         if(document.querySelector('#shipping_total_subtotal')){
            const shipping_total_subtotal_select = $('#shipping_total_subtotal');
            var prevValue_subtotal = shipping_total_subtotal_select.length > 0 ? 
                        convertNumbers(shipping_total_subtotal_select.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;               
           const shipping_total_shipping_select = $('#shipping_total_shipping');
           var prevValue_shipping = shipping_total_shipping_select.length > 0 ? 
                convertNumbers(shipping_total_shipping_select.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                0;
                prevValue = (prevValue_subtotal+prevValue_shipping).toFixed(2);
         }else if(!document.querySelector('.e-total_grandtotal .e-total__value')){
            var elsubTotal = $('.e-total_subtotal .e-total__value');
            prevValue = elsubTotal.length > 0 ? 
                        convertNumbers(elsubTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
         }
         $.get('https://www.campsaver.com/checkout/apply-coupon?code=', 
            (response) => {
             callback(prevValue);  
          });
      },
      applyCode: function(code, callback) {
        $.get('https://www.campsaver.com/checkout/apply-coupon?code='+code, 
          (response) => {
           const value = response.totals.total_grandtotal;
             $.get('https://www.campsaver.com/checkout/apply-coupon?code=', 
                (response) => { callback(value); });                    
          });
      },
      applyBestCode: function(bestCode) {
        if(document.querySelector('.remove-coupon-link span')){
          document.querySelector('.remove-coupon-link span').click();
        } 
        setTimeout(function(){
          $.get('https://www.campsaver.com/checkout/apply-coupon?code='+bestCode, 
          (response) => {
            location.reload();
             });
        }, 1000);
      }
    },

    inkjets: {
      id: 18514,
      preApplyCodes: function(callback) {
        var elTotal; var prevValue;
         if(document.location.pathname.indexOf("/checkout/cart/") === 0){
            elTotal = $('.tr-total span.price');
            prevValue = elTotal.length > 0 ? 
                          convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY; 
        }else{
            elTotal = $('.tr-total span.price');     
            prevValue = elTotal.length > 0 ? 
                            convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;               
       }
        callback(prevValue);
      },
      applyCode: function(code, callback) {
         if(document.location.pathname.indexOf("/checkout/cart/") === 0){
             $.ajax({
              url: 'https://www.inkjets.com/checkout/cart/couponPost/',
              type: 'POST',
              data: {
                remove: 0,
                coupon_code: code
              },
              success: (data, textStatus, request) => {
                const locationUrl = request.getResponseHeader('location');
                $.get(locationUrl , (responseGet) => {
                  const elTotal = $(responseGet).find('.tr-total span.price');
                  var value = 0;
                  if( elTotal.length > 0 ){
                     $( elTotal ).each(function( index ) {
                      value += convertNumbers($( this ).text().replace( /[^0-9.,]/g, '').trim());                
                     });
                  }else{
                      value = Number.POSITIVE_INFINITY;
                  }
                  callback(value);
                });
              },
              error: (xhr, status, error) => {
                 callback(Number.POSITIVE_INFINITY);
              }
            });
       }else{
          const formData = getFormFieldsAsJson(document.querySelector('#discount_form'));
          formData['coupon[code]'] = code;
          $.ajax({
            url:  'https://www.inkjets.com/firecheckout/index/saveCoupon/',
            type: 'POST',
            data: formData,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            success: (response) => {           
                  $.get('https://www.inkjets.com/firecheckout/', 
                  (response) => {
                    const total = $(response).find('.tr-total span.price');     
                    const value = total.length > 0 ? 
                            convertNumbers(total.text().replace( /[^0-9.,]/g, '').trim()) : 
                            Number.POSITIVE_INFINITY;
                    callback(value); 
              }); 
            },
            error: (xhr, status, error) => {
              callback(Number.POSITIVE_INFINITY);
            }
          });
        }
      },
      applyBestCode: function(bestCode) {
        document.querySelector('#coupon_code, #coupon-code').value = bestCode;
        document.querySelector('#coupon_code, #coupon-code').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('.discount-form button[value="Apply"], #coupon-apply').click();
      }
    },

    weightwatchers: {
      id: 246,
      preApplyCodes: (callback) => {
        const Total = $('#priceDetails_priceTotalContainerItem span:last-child');
        const prevValue = Total.length > 0 ? 
                       convertNumbers(Total.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;        
        callback(prevValue);
      },
      applyCode: (code, callback) => { 
        const cartId = $('.cartItem.cartItemCheckout').attr('data-cartid');
        const guestSession =decodeURI(document.cookie.split(';').filter(function(c) { return c.indexOf('guestSession') !== -1 })[0]).trim().split('=')[1];
          
      $.ajax({
          url: 'https://commerce.weightwatchers.com/us/en/api/order/v1/cart/'+cartId+'/offer/'+code+'?channel=E_COMMERCE',
          type: 'POST',
          data: JSON.stringify({market: 'en-US'}),
          headers: {
            'guest-session': guestSession,
            'content-type': 'application/json'
          },
          success: (response) => {
            const value = response.total;
               $.ajax({
                  url: 'https://commerce.weightwatchers.com/us/en/api/order/v1/cart/'+cartId+'/offer/'+code+'?channel=E_COMMERCE',
                  type: 'DELETE',
                  headers: {
                    'guest-session': guestSession,
                    'content-type': 'application/json'
                  },
                    success: () => { callback(value);
                    },
                    error: ()  => { callback(value);
                    }
                });
            },
            error: (xhr, status, error) => {
              console.log(error);
              callback(Number.POSITIVE_INFINITY);
            }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#couponCodeInputText').value = bestCode;
        document.querySelector('#couponCodeInputText').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('#couponButtonSubmit').click();
      }
    },

  yliving: {
      id: 16014,
      preApplyCodes: (callback) => {
        const orderValueEl = $('.checkoutordertotals .ordertotals .ordertotal span.value, .cartordertotals .ordertotals .ordertotal span.value');
        const prevValue = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {
         if(document.location.pathname.indexOf("/cart") === 0){
            const url = $('#dwfrm_cart').attr('action');
            const formData = getFormFieldsAsJson(document.querySelector('#dwfrm_cart'));
            formData['dwfrm_cart_couponCode'] = code;
            formData['dwfrm_cart_addCoupon'] = 'Apply';
            $.post(url, formData, 
              (response) => {
                const orderValueEl = $(response).find('.ordertotals .ordertotal .value');
                const value = orderValueEl.length > 0 ? 
                                  convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                                  Number.POSITIVE_INFINITY;
                callback(value);
              });
        }else{
              $.get('https://www.yliving.com/on/demandware.store/Sites-YLiving-Site/default/COBilling-ApplyCoupon?couponCode='+code, 
              (response) => {
                 $.get('https://www.yliving.com/on/demandware.store/Sites-YLiving-Site/default/COOnePage-UpdateSummary', 
                  (response) => {
                    const orderValueEl = $(response).find('.ordertotals .ordertotal .value');
                    const value = orderValueEl.length > 0 ? 
                                      convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                                      Number.POSITIVE_INFINITY;
                    callback(value);
                  });
              });
        }
      },
      applyBestCode: (bestCode) => {
          location.reload();      
      }
    },

    ylighting: {
      id: 1803,
      preApplyCodes: (callback) => {
        const orderValueEl = $('.checkoutordertotals .ordertotals .ordertotal span.value, .cartordertotals .ordertotals .ordertotal span.value');
        const prevValue = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {
         if(document.location.pathname.indexOf("/cart") === 0){
            const url = $('#dwfrm_cart').attr('action');
            const formData = getFormFieldsAsJson(document.querySelector('#dwfrm_cart'));
            formData['dwfrm_cart_couponCode'] = code;
            formData['dwfrm_cart_addCoupon'] = 'Apply';
            $.post(url, formData, 
              (response) => {
                const orderValueEl = $(response).find('.ordertotals .ordertotal .value');
                const value = orderValueEl.length > 0 ? 
                                  convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                                  Number.POSITIVE_INFINITY;
                callback(value);
              });
        }else{
              $.get('https://www.ylighting.com/on/demandware.store/Sites-YLighting-Site/default/COBilling-ApplyCoupon?couponCode='+code, 
              (response) => {
                 $.get('https://www.ylighting.com/on/demandware.store/Sites-YLighting-Site/default/COOnePage-UpdateSummary', 
                  (response) => {
                    const orderValueEl = $(response).find('.ordertotals .ordertotal .value');
                    const value = orderValueEl.length > 0 ? 
                                      convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                                      Number.POSITIVE_INFINITY;
                    callback(value);
                  });
              });
        }
      },
      applyBestCode: (bestCode) => {
          location.reload();      
      }
    },

    tommy: {
      id: 4901,
      preApplyCodes: (callback) => {
        const elTotal = $('.cart-total .total_figures.order_total_figures');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {      
        const url = 'https://'+window.location.hostname+'/AjaxRESTPromotionCodeApply';
        const formData = getFormFieldsAsJson(document.querySelector('form[name="PromotionCodeForm"]'));
          formData['promoCode'] = code; 
          formData['requesttype'] = 'ajax';
        $.ajax({
          url: url,
          type: 'POST',
          data: formData,
          success: (response) => {
            const catalogId = $('#PromotionCodeForm input[name="catalogId"]').val();
            var storeId = $('#PromotionCodeForm input[name="storeId"]').val();
            var langId = $('input[name="langId"]').val();
            var getUrl = 'https://'+window.location.hostname+'/ShopCartDisplayView?shipmentType=single&catalogId='+catalogId+'&langId='+langId+'&storeId='+storeId;
             $.ajax({
              url: getUrl,
              type: 'POST',
              data: {
                'objectId': '',
                'requesttype': 'ajax'
              },
              success: (response) => {                    
                const elTotal =  $(response).find('.cart-total .total_figures.order_total_figures');                   
                const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
              const formData2 = formData;
              formData2['taskType'] = 'R';                    
              var removeUrl = 'https://'+window.location.hostname+'/AjaxRESTPromotionCodeRemove';
               $.ajax({
                url: removeUrl,
                type: 'POST',
                data: formData2,
                success: () => { callback(value); },
                error: () => { callback(value); }
              });
              }
            });
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
         document.querySelector('#promoCode').value = bestCode;
         document.querySelector('#promoCode').dispatchEvent(new Event('input', {bubbles: true}));
         document.querySelector('#WC_PromotionCodeDisplay_links_1').click();
      }
    },

    partnerbrands: {
      id: 37273,
      preApplyCodes: (callback) => {
        const elTotal = $('.cart-total .total_figures.order_total_figures');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {        
        const url = 'https://'+window.location.hostname+'/AjaxRESTPromotionCodeApply';
        const formData = getFormFieldsAsJson(document.querySelector('form[name="PromotionCodeForm"]'));
          formData['promoCode'] = code; 
          formData['requesttype'] = 'ajax';              

        $.ajax({
          url: url,
          type: 'POST',
          data: formData,
          success: (response) => {
            const catalogId = $('#PromotionCodeForm input[name="catalogId"]').val();
            var storeId = $('#PromotionCodeForm input[name="storeId"]').val();
            var langId = $('input[name="langId"]').val();
            var getUrl = 'https://'+window.location.hostname+'/ShopCartDisplayView?shipmentType=single&catalogId='+catalogId+'&langId='+langId+'&storeId='+storeId;
             $.ajax({
                  url: getUrl,
                  type: 'POST',
                  data: {
                    'objectId': '',
                    'requesttype': 'ajax'
                  },
                  success: (response) => {                    
                    const elTotal =  $(response).find('.cart-total .total_figures.order_total_figures');                   
                    const value = elTotal.length > 0 ? 
                                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                  Number.POSITIVE_INFINITY;
                    const formData2 = formData;
                    formData2['taskType'] = 'R';                    
                    var removeUrl = 'https://'+window.location.hostname+'/AjaxRESTPromotionCodeRemove';
                     $.ajax({
                      url: removeUrl,
                      type: 'POST',
                      data: formData2,
                      success: (response) => { callback(value); },
                      error: (response) => { callback(value); }
                    });
                  }
            });
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
         document.querySelector('#promoCode').value = bestCode;
         document.querySelector('#promoCode').dispatchEvent(new Event('input', {bubbles: true}));
         document.querySelector('#WC_PromotionCodeDisplay_links_1').click();
      }
    },

   calvinklein: {
      id: 4248,
      preApplyCodes: (callback) => {
        const elTotal = $('.cart-total .total_figures.order_total_figures');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {       
        const url = 'https://'+window.location.hostname+'/AjaxRESTPromotionCodeApply';
        const formData = getFormFieldsAsJson(document.querySelector('form[name="PromotionCodeForm"]'));
          formData['promoCode'] = code; 
          formData['requesttype'] = 'ajax';
        $.ajax({
          url: url,
          type: 'POST',
          data: formData,
          success: (response) => {
            const catalogId = $('#PromotionCodeForm input[name="catalogId"]').val();
            var storeId = $('#PromotionCodeForm input[name="storeId"]').val();
            var langId = $('input[name="langId"]').val();
            var getUrl = 'https://'+window.location.hostname+'/ShopCartDisplayView?shipmentType=single&catalogId='+catalogId+'&langId='+langId+'&storeId='+storeId;
             $.ajax({
                  url: getUrl,
                  type: 'POST',
                  data: {
                    'objectId': '',
                    'requesttype': 'ajax'
                  },
                  success: (response) => {                    
                    const elTotal =  $(response).find('.cart-total .total_figures.order_total_figures');                   
                    const value = elTotal.length > 0 ? 
                                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                  Number.POSITIVE_INFINITY;
                    const formData2 = formData;
                    formData2['taskType'] = 'R';                    
                    var removeUrl = 'https://'+window.location.hostname+'/AjaxRESTPromotionCodeRemove';
                      $.ajax({
                        url: removeUrl,
                        type: 'POST',
                        data: formData2,
                        success: (response) => { callback(value); },
                        error: (response) => { callback(value); }
                      });
                  }
            });
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
         document.querySelector('#promoCode').value = bestCode;
         document.querySelector('#promoCode').dispatchEvent(new Event('input', {bubbles: true}));
         document.querySelector('#WC_PromotionCodeDisplay_links_1').click();
      }
    },

   kendrascott: {
      preApplyCodes: function(callback) {
        const elTotal = $('.bfx-total-grandtotal');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        if(window.location.href.indexOf("cart") > -1){
          if(document.querySelector('#cart-items-form')){
            const url = $('#cart-items-form').attr('action');
            const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
            formData['dwfrm_cart_coupons_i0_deleteCoupon'] = 'Remove';
            $.post(url, formData, 
              (response) => {
                callback(prevValue);
            });
          }else{
            callback(prevValue);
          }
        }else{
          if(document.querySelector('.remove-coupon')){
            $.get('https://'+window.location.hostname+'/on/demandware.store/Sites-KendraScott-Site/en_US/COBilling-AddCouponCodeJson?couponCode=empty&couponAction=0&format=ajax', 
              (response) => {
                callback(prevValue);
              });
          }else{
            callback(prevValue);
          }          
        }
      },
      applyCode: function(code, callback) {
        if(window.location.href.indexOf("cart") > -1){    
          this.preApplyCodes(() => {
            const url = $('#cart-coupon-form').attr('action');
            const formData = getFormFieldsAsJson(document.querySelector('#cart-coupon-form'));
            formData['dwfrm_cart_couponCode'] = code;
            formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
              $.post(url, formData, 
              (responsePost) => {
                $.get('https://'+window.location.hostname+'/cart', (response) => {
                    const orderValueEl = $(response).find('.bfx-total-grandtotal');
                    const value = orderValueEl.length > 0 ? 
                                    convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                                    Number.POSITIVE_INFINITY;  
                     callback(value);                 
                });
              }); 
          });
        }else{
          $.get('https://'+window.location.hostname+'/on/demandware.store/Sites-KendraScott-Site/en_US/COBilling-AddCouponCodeJson?couponCode='+code+'&couponAction=add&format=ajax', 
              (responseGet) => {
                const checkout_value = responseGet.baskettotal;
                  $.get('https://'+window.location.hostname+'/on/demandware.store/Sites-KendraScott-Site/en_US/COBilling-AddCouponCodeJson?couponCode=empty&couponAction=0&format=ajax', 
                    (response) => {
                     callback(checkout_value);
                  });
              });
        }
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#dwfrm_cart_couponCode').value = bestCode;
        document.querySelector('#dwfrm_cart_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('#add-coupon').click();
      }
    },

  autoanything: {
      preApplyCodes: function(callback) {
         const orderValueEl = $('.cartTotals li span.b');
         const prevValue = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
                          console.log(prevValue);
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        this._applyCode(code, function(value) {
             callback(value);
          }); 
      },
      applyBestCode: function(bestCode) {
        document.querySelector('#txtPromotionalCode').value = bestCode;
        document.querySelector('#txtPromotionalCode').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('#btnRedeem').click();
      },
      _applyCode: function(code, callback) {
        const windowVariables = retrieveWindowVariables(["window.CART_ID","window.VISIT_ID","window.VISITOR_ID" ]);
        const cartId = windowVariables['window.CART_ID'];
        const visitId = windowVariables['window.VISIT_ID'];
        const visitorId = windowVariables['window.VISITOR_ID'];       
      $.ajax({
          url: 'https://www.autoanything.com/services/CartService.svc/ApplyPromoCode',
          type: 'POST',
          data: JSON.stringify({cartId:cartId, promoCode: code, visitId:visitId, visitorId:visitorId}),
           headers: {
                    'content-type': 'application/json;charset=UTF-8'
                  },
          success: (response) => {
              const value = (response.d.Payload.GrandtotalAmount.Amount).toFixed(2);
              callback(value);
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
    },

    trueandco: {
      id: 27177,
      preApplyCodes: (callback) => {
        const elTotal = $('.summary_price-total p:last-child');       
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);         
      },
      applyCode: (code, callback) => {
        var ts = Math.round(new Date().getTime());
        const cart_token = decodeURI(document.cookie.split(';').filter(function(c) { return c.indexOf('cartToken') !== -1 })[0]).trim().split('=')[1];
        const url = 'https://trueandco.com/api/v1/carts/'+cart_token+'?timestamp='+ts;
        $.ajax({
          url: url,
          type: 'PATCH',
          data: JSON.stringify({cart: { promo_code: code }}),
           headers: {
                    'content-type': 'application/json;charset=UTF-8'
                  },
          success: (response) => {
              const total = response.data.attributes.purchase_total;
               const value = total ? 
                          convertNumbers(total.replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
                            callback(value);
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
         document.querySelector('.input_discount #input-with-label').removeAttribute('disabled');
         document.querySelector('.input_discount .button.button_secondary').removeAttribute('disabled');
         document.querySelector('.input_discount #input-with-label').value = bestCode;
         document.querySelector('#input-with-label').dispatchEvent(new Event('input', {bubbles: true})); 
         document.querySelector('#input-with-label').dispatchEvent(new Event('change', {bubbles: true}));
         document.querySelector('#input-with-label').dispatchEvent(new Event('blur')); 
         document.querySelector('#input-with-label').dispatchEvent(new Event('focus'));
         setTimeout(() => {
          document.querySelector('.input_discount .button.button_secondary').click();
        }, 250);
      }
    },

    crocs: {
      id: 27177,
      preApplyCodes: (callback) => {
        const elTotal = $('#estimatedTotal');       
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);         
      },
      applyCode: (code, callback) => {
       const url = 'https://www.crocs.com/on/demandware.store/Sites-crocs_us-Site/default/Cart-API';
        $.ajax({
          url: url,
          type: 'POST',
          data: {action:'addcoupon', updates: 'approaching|promos|shipping|delivery', coupon: code },
           headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                  },
          success: (response) => {
              const value = response.data.cartEstimatedTotal;
              callback(value);
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
         document.querySelector('#couponFld').value = bestCode;
         document.querySelector('#couponFld').dispatchEvent(new Event('input', {bubbles: true})); 
         document.querySelector('#addcoup').click();
      }
    },

    callawaygolfpreowned: {
      preApplyCodes: function(callback) {
        const elTotal = $('#basket-total .text-value');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        $.ajax({
          url: 'https://www.callawaygolfpreowned.com/on/demandware.store/Sites-CGPO5-Site/default/Cart-AddCouponToBasket',
          type: 'POST',
          data: {
            couponCode: code
          },
          success: () => {
            $.get('https://www.callawaygolfpreowned.com/cart', (responseGet) => {
              const elTotal = $(responseGet).find('#basket-total .text-value');
              const value = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
                      $.ajax({
                        url: 'https://www.callawaygolfpreowned.com/on/demandware.store/Sites-CGPO5-Site/default/Cart-DeleteCoupon',
                        type: 'POST',
                        data: {
                          couponCode: code
                        },
                        success: () => {  callback(value);  },
                        error: (xhr, status, error) => { callback(value); }
                      });
            });
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('input[name="couponCode"]').value = bestCode;
        document.querySelector('input[name="couponCode"]').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('.couponAddBtn span').click();  
      }
    },


   olympiasports: {
      id: 3429, 
      preApplyCodes: function(callback) {
        const elTotal = $('[data-totals-component="grandTotal"] dd strong');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const url = $('.promo-code-form ').attr('data-action-url');
        const csrf_token = $('.promo-code-form input[name="csrf_token"]').val();
        $.get('https://www.olympiasports.net'+url+'/?csrf_token='+csrf_token+'&couponCode='+code, 
          (response) => {
          if(response.totals){
            const value = response.totals.grandTotal;
            const totalValue = convertNumbers(value.replace( /[^0-9.,]/g, '').trim())
            const locale = response.locale;
            const uuid =  response.totals.discounts[0].UUID;
            $.ajax({
              url: 'https://www.olympiasports.net/on/demandware.store/Sites-OlympiaSports-Site/'+locale+'/Cart-RemoveCouponLineItem?code='+code+'&uuid='+uuid,
              type: 'GET',
              success: () => { callback(totalValue); },
              error: () => { callback(totalValue); }
            });                 
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#couponCode').value = bestCode;
        document.querySelector('#couponCode').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('button.promo-code-btn').click();
      }
    },

    edenbrothers: {
      id: 26537,
      preApplyCodes: (callback) => {
        const orderValueEl = $('.totals_all.cart-totals-value.cart-ordertotal-value');
        const prevValue = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {
        const url = $('form[name="order"]').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('form[name="order"]'));
        formData['coupon_code'] = code;
        formData['function'] = 'Apply Coupon';        
        $.post(url, formData, 
          (response) => {
            const orderValueEl = $(response).find('.totals_all.cart-totals-value.cart-ordertotal-value');
            const value = orderValueEl.length > 0 ? 
                              convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
                              callback(value);
          });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#coupon_code').value = bestCode;
        document.querySelector('#coupon_code').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('[data-id="Apply Coupon"]').click();
      }
    },


   webstaurantstore: {
      id: 2653, 
      preApplyCodes: function(callback) {
         const elTotal = $('.subtotal.cartpromo-subtotal');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {        
         $.post('https://www.webstaurantstore.com/shoppingcart:cart/applydiscountcode/', {discountCode: code }, 
          (response) => {
            if(response.cart){
                const value = response.cart.subtotal;                
                callback(value);
            }else{
              callback(Number.POSITIVE_INFINITY);
            }
          });
      },
      applyBestCode: (bestCode) => {
        location.reload();
      }
    },

  wondershare: {
      id: 6867, 
      preApplyCodes: function(callback) {
         const elTotal = $('.total .price, #total, #main .order_amount.success.font-muli, .span_total, .now-total');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {    
      const url = document.URL.split("/");
      const shopId = url[3];
      const order_id = getParam('order_id');
         $.post('https://'+window.location.hostname+'/'+shopId+'/sdk/Bootstrap/Sdk.php', {order_id: order_id, operation: 'apply_coupon_code' , coupon_code: code }, 
          (response) => {
            if(response.data){
                const value = response.data.orderInfo.order_amount;                
                callback(value);
            }else{
              callback(Number.POSITIVE_INFINITY);
            }
          });
      },
      applyBestCode: (bestCode) => {
        const url = document.URL.split("/");
        const shopId = url[3];
        const order_id = getParam('order_id');
        $.post('https://'+window.location.hostname+'/'+shopId+'/sdk/Bootstrap/Sdk.php', {order_id: order_id, operation: 'apply_coupon_code' , coupon_code: bestCode }, 
          (response) => { location.reload(); });
      }
    },

    lakeside: {
      id: 3921, 
      preApplyCodes: function(callback) {
         const elTotal = $('aside.order-sum__tab span');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        var ajaxurl = '';
         if(window.location.href.indexOf("shopping_cart") > -1){
           ajaxurl = $('#couponCodeForm').attr('action');           
         }else{
           ajaxurl = '/checkout/order_summary_container_acap.jsp';
         }
        const formData = getFormFieldsAsJson(document.querySelector('#couponCodeForm'));
        formData['/atg/commerce/promotion/CouponFormHandler.couponClaimCode'] = code;
        $.ajax({
          url: 'https://www.lakeside.com'+ajaxurl,
          type: 'POST',
          data: formData,
          success: (response) => { 
            const orderValueEl = $(response).find('aside.order-sum__tab span');
            const value = orderValueEl.length > 0 ? 
                              convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
                              callback(value);     
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        }); 
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#applyCouponInput').value = bestCode;
        document.querySelector('#applyCouponInput').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('#applyCouponCode, #applyButton').click();  
      }
    },

    mattressfirm: {
      id: 15959,
      preApplyCodes: function(callback) {
        const elTotal = $('tr.order-total td.order-value');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
         if(window.location.href.indexOf("shopping_cart") > -1){
          const url = $('form[name="dwfrm_cart"]').attr('action');
          const formData = getFormFieldsAsJson(document.querySelector('form[name="dwfrm_cart"]'));
          formData['dwfrm_cart_couponCode'] = code;
          formData['dwfrm_cart_addCoupon'] = 'true';
          $.ajax({
            url: url+'?format=ajax',
            type: 'POST',
            data: formData,
            success: (response, status, xhr) => {
              if (response !== null) {
                const elTotal = $(response).find('tr.order-total td.order-value');
                const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;                
                callback(value);
              } else {
                callback(Number.POSITIVE_INFINITY);
              }
            },
            error: (xhr, status, error) => {
              console.log(error);
              callback(Number.POSITIVE_INFINITY);
            }
          });
        }else{
           $.get('https://www.mattressfirm.com/on/demandware.store/Sites-Mattress-Firm-Site/default/Cart-AddCouponCheckoutJson?couponCode='+code+'&format=ajax', (response) => {             
              $.get(window.location.href, (responseGet) => {             
                const elTotal = $(responseGet).find('tr.order-total td.order-value');
                  const value = elTotal.length > 0 ? 
                                convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                Number.POSITIVE_INFINITY;
                  callback(value);
                  });
            });
        }
      },
      applyBestCode: (bestCode) => {
        location.reload();  
      }
    },


    kirklands: {
      id: 6474,
      preApplyCodes: function(callback) {
        const elTotal = $('#estimated-grand-total, #grandTotalData');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        var url, formMethod, formData;
         if(window.location.href.indexOf("basket") > -1){
          url = $('form[name="basket_body"]').attr('action');
          formData = getFormFieldsAsJson(document.querySelector('form[name="basket_body"]'));
          formData['checkoutAction'] = '4';
          formData['promoCode'] = code;
          formData['submitPromotionCode'] = 'Submit';
          formMethod = 'GET';
        }else{
          url = '/checkout/update_award_in_order.cmd';
          formData = getFormFieldsAsJson(document.querySelector('form[name="paymentForm"]'));
          formData['awardAction'] = '1';
          formData['awardCode'] = code;
          formData['promoCode'] = code;
          formMethod = 'POST';
        }
          $.ajax({
            url: 'https://www.kirklands.com'+url,
            type: formMethod,
            data: formData,
            success: (response, status, xhr) => {
                const elTotal = $(response).find('#estimated-grand-total, #grandTotalData');
                const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;                
                callback(value);
            },
            error: (xhr, status, error) => {
              console.log(error);
              callback(Number.POSITIVE_INFINITY);
            }
          });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#promoCode').value = bestCode;
        document.querySelector('#promoCode').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('input[name="submitPromotionCode"], #submitPromotionCode').click();  
      }
    },

    lens: {
      id: 1088,
      preApplyCodes: function(callback) {
        const elTotal = $('#orderTotal-cell');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
          const url = $('form[name="frm"]').attr('action');
          const formData = getFormFieldsAsJson(document.querySelector('form[name="frm"]'));
          formData['coupcode'] = code;
          $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            success: (response, status, xhr) => {
                const elTotal = $(response).find('#orderTotal-cell');
                const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;   
                const formData2 = formData;
                formData2['coupcode'] = '';
                formData2['typed_coupcode'] = code;
                formData2['dodelcoup'] = 'yes';
                  $.ajax({
                    url: url,
                    type: 'POST',
                    data: formData2,
                    success: (response, status, xhr) => { callback(value); },
                    error: (xhr, status, error) => { callback(value); }
                  });
            },
            error: (xhr, status, error) => {
              console.log(error);
              callback(Number.POSITIVE_INFINITY);
            }
          });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#coupcode').value = bestCode;
        document.querySelector('#coupcode').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('#coupapply').click(); 
      }
    },


    fragrancex: {
      id: 831,
      preApplyCodes: function(callback) {
        const elTotal = $('.total-section div:nth-child(2)');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        var url, formMethod, formData;
         if(window.location.href.indexOf("cart") > -1){
          const ts = Math.round(new Date().getTime());
          url = $('form#CardTableAsyncForm').attr('data-ajax-url');
          formData = getFormFieldsAsJson(document.querySelector('form#CardTableAsyncForm'));          
          formData['code'] = code;
          formData['X-Requested-With'] = 'XMLHttpRequest';
          formData['_'] = ts;
           $.ajax({
            url: 'https://www.fragrancex.com'+url,
            type: 'GET',
            data: formData,
            success: (response, status, xhr) => {
                const elTotal = $(response).find('.total-section div:nth-child(2)');
                const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;                
                callback(value);
            },
            error: (xhr, status, error) => {
              console.log(error);
              callback(Number.POSITIVE_INFINITY);
            }
          });
        }else{
          formData = getFormFieldsAsJson(document.querySelector('form#OrderInfoForm'));
          formData['CoupongGiftCertCode'] = code;
           $.ajax({
            url: 'https://www.fragrancex.com/Widgets/CheckoutCouponGiftCert/AjaxCheckoutCouponGiftCert',
            type: 'POST',
            data: formData,
            success: (response, status, xhr) => {
                 $.ajax({
                  url: 'https://www.fragrancex.com/Widgets/SideOrderSummary/AjaxSideOrderSummary',
                  type: 'POST',
                  data: formData,
                  success: (response, status, xhr) => {
                      const elTotal = $(response).find('.total-section div:nth-child(2)');
                      const value = elTotal.length > 0 ? 
                                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                    Number.POSITIVE_INFINITY;                
                      callback(value);
                  },
                  error: (xhr, status, error) => {
                    console.log(error);
                    callback(Number.POSITIVE_INFINITY);
                  }
                });
             },
            error: (xhr, status, error) => {
              console.log(error);
              callback(Number.POSITIVE_INFINITY);
            }
          });
        }         
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#CartTableAsyncSection #name, #CoupongGiftCertCode').value = bestCode;
        document.querySelector('#CartTableAsyncSection #name, #CoupongGiftCertCode').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('#CardTableAsyncForm .ga-submit-coupon, #SubmitCoupon').click();  
      }
    },


    katespade: {
      id: 4540,
      preApplyCodes: (callback) => {
        const orderValueEl = $('.cart-order-totals .order-total .order-value');
        const prevValue = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {
      if(window.location.href.indexOf("shopping-bag") > -1){ 
        const url = $('#cart-items-form').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
        formData['dwfrm_cart_couponCode'] = code;
        formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
        $.post(url, formData, 
          (response) => {
            const orderValueEl = $(response).find('.cart-order-totals .order-total .order-value');
            const value = orderValueEl.length > 0 ? 
                              convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
            callback(value);
          });
      }else{
         $.get('https://'+window.location.hostname+'/on/demandware.store/Sites-Shop-Site/en_US/Cart-AddCouponJson?couponCode='+code+'&format=ajax', 
              (responseGet) => {
                  $.get('https://'+window.location.hostname+'/on/demandware.store/Sites-Shop-Site/en_US/COBilling-UpdateSummary?format=ajax', 
                    (response) => {
                      const orderValueEl = $(response).find('.order-total .order-value');
                      const value = orderValueEl.length > 0 ? 
                                    convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                    Number.POSITIVE_INFINITY;
                          $.get('https://'+window.location.hostname+'/on/demandware.store/Sites-Shop-Site/en_US/Cart-DeleteCouponJson?couponCode='+code+'&format=ajax', 
                          (response) => {                                          
                            callback(value);
                        });
                  });
              });
          }
      },
      applyBestCode: (bestCode) => {
        try{ document.querySelector('#dwfrm_billing_usegiftorpromo').click(); } catch(e){ } 
        document.querySelector('#dwfrm_cart_couponCode, #dwfrm_billing_couponCode').value = bestCode;
        document.querySelector('#dwfrm_cart_couponCode, #dwfrm_billing_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('#add-coupon').click();
      }
    },


    'softsurroundings': {
      id: 1891,
      preApplyCodes: function(callback) {
        const elTotal = $('#totals .prices b');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;        
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        $.post('https://'+window.location.hostname+'/itemoptions/', {promoCode: code, action: '1', pageType: 'promoCode'}, 
          () => {
            const url = window.location.href;
            $.get(url, 
              (response) => {
                const elTotal = $(response).find('#totals .prices b');
                const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
                callback(value);
              });
          });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('.promoCodeGenInput').value = bestCode;
        document.querySelector('.promoCodeGenInput').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('#ajaxPromoCode').click();
      }
    },

    haband: {
      id: 905, 
      preApplyCodes: function(callback) {
        const elTotal = $('#checkoutOrderSummaryOrderTotal');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        var url;
        if(window.location.href.indexOf("guest") > -1){
          url = 'https://www.haband.com/guest/order/promoCode';          
        }else{
          url = 'https://www.haband.com/order/promoCode';
        }
        $.ajax({
          url: url,
          type: 'PUT',
          data: JSON.stringify({ promoCodes: [code] }),
          headers: { 'content-type': 'application/json' },
          success: (data, textStatus, request) => {
            const value = data.orderSummary.orderTotal;
            callback(value);
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#promoCodeViewPromoCodeField').value = bestCode;
        document.querySelector('#promoCodeViewPromoCodeField').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('#promoCodeViewPromoCodeApply').click();  
      }
    },

    venus: {
      id: 7719, 
      preApplyCodes: function(callback) {  
        const elTotal = $('#ctl00_Body1_lblTotal, #OrderTotal, #orderSummaryOrderTotalSpan');
        const windowVariables = retrieveWindowVariables(["window.NREUM"]);
        const xpid = windowVariables["window.NREUM"].loader_config.xpid;
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
      $.ajax({
          url: 'https://www.venus.com/api/Promotions',
          type: 'DELETE',
          headers: {
          'x-newrelic-id': xpid
          },
          success: () => { callback(prevValue); },
          error: () => { callback(prevValue); }
        });        
      },
      applyCode: function(code, callback) {
       this.preApplyCodes(() => {       
        this._applyCode(code, function(value) {
          callback(value);
        }); 
       });
      },
      applyBestCode: function(bestCode) {
        this._applyCode(bestCode, function() {
            location.reload();
        }) ;
      },
      _applyCode: (code, callback) => {
        const windowVariables = retrieveWindowVariables(["window.NREUM"]);
        const xpid = windowVariables["window.NREUM"].loader_config.xpid;
       $.ajax({
            url: 'https://www.venus.com/api/Promotions',
            type: 'POST',
            headers: {
            'x-newrelic-id': xpid
            },
            data: {
              PromotionCode: code,
            },
            success: (data) => {
              $.ajax({
                  url: 'https://www.venus.com/api/order',
                  type: 'GET',
                  headers: {
                  'x-newrelic-id': xpid
                  },
                  success: (response) => {                  
                     const value = response.Pricing.Total;
                     callback(value);  
                  },error: () => {
                    callback(Number.POSITIVE_INFINITY);
                  }
              });
            },
            error: () => {
              callback(Number.POSITIVE_INFINITY);
            }
        });
      }
    },

    personalizationmall: {
      id: 3991,
      preApplyCodes: (callback) => {
        const orderValueEl = $('.table__order-checkout tr:last-child td:nth-child(2), td[align="right"][class*="Bold"]');
        console.log(orderValueEl);
        const prevValue = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) :
                          Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {
        const url = 'https://www.personalizationmall.com/checkout.aspx';
        const formData = getFormFieldsAsJson(document.querySelector('#aspnetForm'));
        formData['ctl00$mainContent$txtCouponCode'] = code;
        formData['ctl00$mainContent$cmdReviseDiscout'] = 'Apply Coupon';
        $.post(url, formData, 
          (response) => {
            const orderValueEl = $(response).find('.table__order-checkout tr:last-child td:nth-child(2), td[align="right"][class*="Bold"]');
            const value = orderValueEl.length > 0 ? 
                              convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
            callback(value);
          });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('input[name="ctl00$mainContent$txtCouponCode"]').value = bestCode;
        document.querySelector('input[name="ctl00$mainContent$txtCouponCode"]').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('input[name="ctl00$mainContent$cmdReviseDiscout"]').click();
      }
    },

    bissell: {
      id: 26844, 
      preApplyCodes: function(callback) {
        const elTotal = $('p.grand-total');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        const el = $('button.remove-coupon');
        var url = null;
        if (el !== null && el !== undefined && el.length > 0) {
          const code = el.attr('data-code');
          const uuid = el.attr('data-uuid');
          url = 'https://www.bissell.com/on/demandware.store/Sites-bissell-Site/en_US/Cart-RemoveCouponLineItem' +
                      '?code=' + code +
                      '&uuid=' + uuid;
        } else if (this.pumaPrevCode !== null && this.pumaPrevCode !== undefined) {
          url = 'https://www.bissell.com/on/demandware.store/Sites-bissell-Site/en_US/Cart-RemoveCouponLineItem' +
                      '?code=' + this.pumaPrevCode +
                      '&uuid=' + this.pumaPrevUuid;
        }
        if (url !== null) {
          $.ajax({
            url: url,
            type: 'GET',
            data: {},
            success: () => {
              callback(prevValue);
            },
            error: (xhr, status, error) => {
              console.log(error);
              callback(prevValue);
            }
          });
        } else {
          callback(prevValue);
        }
      },
      applyCode: function(code, callback) {
        this.preApplyCodes(() => {
          this.pumaPrevCode = code;
          console.log('Apply Code: ', code);
          const csrf_token = $('input[name*="csrf_token"]').first().val();
          const url = 'https://www.bissell.com/on/demandware.store/Sites-bissell-Site/en_US/Cart-AddCoupon' +
                      '?couponCode=' + code + 
                      '&csrf_token=' + csrf_token;
          $.ajax({
            url: url,
            type: 'GET',
            data: {},
            success: (response, status, xhr) => {
              if (response !== null) {
                const totals = response.totals;
                if (totals !== null && totals !== undefined) {
                  const value = totals.grandTotal !== null ? 
                            convertNumbers(totals.grandTotal.replace( /[^0-9.,]/g, '').trim()) : 
                            Number.POSITIVE_INFINITY;
                  $.get('https://www.bissell.com'+window.location.pathname, (responseGet) => {
                    const el = $(responseGet).find('button.remove-coupon');
                    if (el !== null && el !== undefined && el.length > 0) {
                      this.pumaPrevUuid = el.attr('data-uuid');                      
                    }
                    callback(value);
                  });
                  return;
                }
              }
              callback(Number.POSITIVE_INFINITY);
            },
            error: (xhr, status, error) => {
              console.log(error);
            }
          });
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#couponCode').value = bestCode;
        document.querySelector('#couponCode').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('.promo-code-submit button').disabled = false;  
        document.querySelector('.promo-code-submit button').click();  
        setTimeout(function(){
          try {document.querySelector('#couponInterceptModal .btn-coupon-intercept-delete').click(); } catch (e) {}
        }, 1000);
      }
    },

    statelinetack: {
      id: 1557,
      preApplyCodes: (callback) => {
        const orderValueEl = $('.cart-checkout-subtotal-price');
        console.log(orderValueEl);
        const prevValue = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) :
                          Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {
        var url, formData;
      if(window.location.href.indexOf("cart") > -1){
        url = 'https://www.statelinetack.com/cart.aspx';
        formData = getFormFieldsAsJson(document.querySelector('#aspnetForm'));
        formData['ctl00$ctl00$CenterContentArea$MainContent$ctl00$txtPromoCode'] = code;
        formData['ctl00$ctl00$CenterContentArea$MainContent$ctl00$btnPromoCode'] = 'Apply';
      }else{
        url = 'https://www.statelinetack.com/BillingShipping.aspx';
        formData = getFormFieldsAsJson(document.querySelector('#aspnetForm'));
        formData['ctl00$MainContent$billingShipping$txtPromoCode'] = code;
        formData['ctl00$MainContent$billingShipping$btnPromoCode'] = 'Apply';
      }
        $.post(url, formData, 
          (response) => {
            const orderValueEl = $(response).find('.cart-checkout-subtotal-price');
            const value = orderValueEl.length > 0 ? 
                              convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
            callback(value);
          });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#ctl00_ctl00_CenterContentArea_MainContent_ctl00_txtPromoCode, #ctl00_MainContent_billingShipping_txtPromoCode').value = bestCode;
        document.querySelector('#ctl00_ctl00_CenterContentArea_MainContent_ctl00_txtPromoCode, #ctl00_MainContent_billingShipping_txtPromoCode').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('#ctl00_ctl00_CenterContentArea_MainContent_ctl00_btnPromoCode, #ctl00_MainContent_billingShipping_btnPromoCode').click();
      }
    },

    eyeconic: {
      id: 4540,
      preApplyCodes: (callback) => {
        const orderValueEl = $('#orderSummary-orderTotal, .order-total td:last-child');
        const prevValue = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {
         if(window.location.href.indexOf("shoppingbag") > -1){ 
         $.get('https://'+window.location.hostname+'/on/demandware.store/Sites-eyeconic-Site/default/Cart-AddCouponJson?format=ajax&couponCode='+code+'&source=cart', 
          (responseGet) => {
            $.get('https://'+window.location.hostname+'/on/demandware.store/Sites-eyeconic-Site/default/Cart-UpdateSummary', 
              (response) => {
              const orderValueEl = $(response).find('#orderSummary-orderTotal');
              const value = orderValueEl.length > 0 ? 
                            convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                            Number.POSITIVE_INFINITY;
                $.get('https://'+window.location.hostname+'/on/demandware.store/Sites-eyeconic-Site/default/Cart-RemoveCoupon?couponCode='+code, 
                (response) => {                                          
                  callback(value);
              }).fail(function() {
               callback(Number.POSITIVE_INFINITY);
              }); 
            }).fail(function() {
              callback(Number.POSITIVE_INFINITY);
            }); 
          }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
          }); 
       }else{
        $.get('https://'+window.location.hostname+'/on/demandware.store/Sites-eyeconic-Site/default/Cart-AddCouponJson?format=ajax&couponCode='+code, 
        (responseGet) => {
          const value = responseGet.baskettotal;
          $.get('https://'+window.location.hostname+'/on/demandware.store/Sites-eyeconic-Site/default/Cart-RemoveCoupon?couponCode='+code, 
            (response) => {                                          
              callback(value);
          }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
          }); 
        }).fail(function() {
         callback(Number.POSITIVE_INFINITY);
        }); 
       }
      },
      applyBestCode: (bestCode) => {
        try {document.querySelector('#dwfrm_billing_showGCAndPromoSection').click()} catch (e) {}
        document.querySelector('#promo-code-entry, #dwfrm_billing_couponCode').value = bestCode;
        document.querySelector('#promo-code-entry, #dwfrm_billing_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('#promo-apply-button, #add-coupon').click();
      }
    },

    russellstover: {
      id: 2982,
      preApplyCodes: (callback) => {
        const elTotal = $('#order_total tr:last-child td:last-child');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {        
        const url = 'https://www.russellstover.com/AjaxRESTPromotionCodeApply';
        const formData = getFormFieldsAsJson(document.querySelector('form[name="PromotionCodeFormorderSummary"]'));
        formData['promoCode'] = code;
        $.ajax({
          url: url,
          type: 'POST',
          data: formData,
          success: (response) => {
            var getUrl = '';
            const catalogId = $('#PromotionCodeFormorderSummary input[name="catalogId"]').val();
            var storeId = $('#PromotionCodeFormorderSummary input[name="storeId"]').val();
            var langId = $('input[name="langId"]').val();
            const orderId = $('#PromotionCodeFormorderSummary input[name="orderId"]').val();
            if(window.location.href.indexOf("AjaxOrderItemDisplayView") > -1){
              getUrl = 'https://www.russellstover.com/ShopCartDisplayView?shipmentType=single&catalogId='+catalogId+'&langId='+langId+'&storeId='+storeId;
            }else{
              getUrl = 'https://www.russellstover.com/CurrentOrderInformationView?catalogId='+catalogId+'&langId='+langId+'&storeId='+storeId+'&orderId='+orderId+'&fromPage=shippingBillingPage&shipmentTypeId=1&fromPage=shippingBillingPage';
            }
             $.ajax({
                  url: getUrl,
                  type: 'POST',
                  data: {
                    'objectId': '',
                    'requesttype': 'ajax'
                  },
                  success: (response) => {                    
                    const elTotal =  $(response).find('#order_total tr:last-child td:last-child');                   
                    const value = elTotal.length > 0 ? 
                                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                  Number.POSITIVE_INFINITY;              

                    const formData2 = formData;
                    formData2['taskType'] = 'R';                    
                    var removeUrl = 'https://www.russellstover.com/AjaxRESTPromotionCodeRemove';
                       $.ajax({
                            url: removeUrl,
                            type: 'POST',
                            data: formData2,
                            success: (response) => { callback(value); },
                            error: (xhr, status, error) => {callback(value); }
                          });
                  }
                });
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
         document.querySelector('#promoCodeorderSummary').value = bestCode;
         document.querySelector('#promoCodeorderSummary').dispatchEvent(new Event('input', {bubbles: true}));
         document.querySelector('#PromotionCodeFormorderSummary #WC_PromotionCodeDisplay_links_1').click();
      }
    },

    hp: {
      id: 198, 
      preApplyCodes: function(callback) {
        const elTotal = $('#cartSliderTotal, #rOrderTotal');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const windowVariables = retrieveWindowVariables(["absoluteURL"]);
        const url = windowVariables.absoluteURL;
        const orderID = $('#orderId').val();
        var refreshUrl;
        if(window.location.href.indexOf("AjaxOrderItemDisplayView") > -1){
          refreshUrl = 'RefreshCart';
        }else{
          refreshUrl = 'RefreshCheckoutCart';
        }
        $.ajax({
          url: url+'AjaxPromotionCodeManage',
          type: 'POST',
          data: {promoCode:code,taskType:'A',orderId:orderID },
          success: (response, status, xhr) => {
            $.ajax({
              url: url+'AjaxOrderChangeServiceItemUpdate',
              type: 'POST',
              data: {promoCode:code,taskType:'A',orderId:orderID },
              success: (response, status, xhr) => {
                const geturl = url+refreshUrl+'?ajax=true';
                $.ajax({
                  url: geturl,
                  type: 'GET',
                  success: (response, status, xhr) => {
                    const total = $(response).find('#cartSliderTotal, #rOrderTotal'); 
                    const value = total.length > 0 ? 
                      convertNumbers(total.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
                      $.ajax({
                        url: url+'AjaxPromotionCodeManage',
                        type: 'POST',
                        data: {promoCode:code,taskType:'R',orderId:orderID },
                        success: (response, status, xhr) => { callback(value); },
                        error: (xhr, status, error) => { callback(value); }
                      });                    
                  },
                  error: (xhr, status, error) => {
                    callback(Number.POSITIVE_INFINITY);
                  }
                });
              },
              error: (xhr, status, error) => {
                callback(Number.POSITIVE_INFINITY);
              }
            });
          },
          error: (xhr, status, error) => {
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        const windowVariables = retrieveWindowVariables(["absoluteURL"]);
        const url = windowVariables.absoluteURL;
        const orderID = $('#orderId').val();
         $.ajax({
          url: url+'AjaxPromotionCodeManage',
          type: 'POST',
          data: {promoCode:bestCode,taskType:'A',orderId:orderID },
          success: (response) => {
             $.ajax({
              url: url+'AjaxOrderChangeServiceItemUpdate',
              type: 'POST',
              data: {promoCode:bestCode,taskType:'A',orderId:orderID },
              success: (response) => {
                location.reload();
              }
            });
          }
        });
      }
    },

    petcarerx: {
      id: 1349, 
      preApplyCodes: function(callback) {
        const elTotal = $('#summary_ordersubtotal, div:contains("Estimated Total") + div > span:visible:contains(.):not(:contains($0.00))');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        $.ajax({
          url: 'https://www.petcarerx.com/ajax/cart_page.ashx',
          type: 'POST',
          data: {
            cmd: 'submit_new_coupon',
            coupon: code
          },
          success: (data, textStatus, request) => {
            const ts = Math.round(new Date().getTime());
            $.ajax({
              url: 'https://www.petcarerx.com/ajax/cart_page.ashx?cmd=getcartsummary&_='+ts,
              type: 'GET',
              success: (data, textStatus, request) => {
                const total = data.total;
                const value = total ? 
                      convertNumbers(total.replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
                callback(value);
              },
              error: () => { callback(Number.POSITIVE_INFINITY); }
            });
          },
          error: () => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        $.ajax({
          url: 'https://www.petcarerx.com/ajax/cart_page.ashx',
          type: 'POST',
          data: {
            cmd: 'submit_new_coupon',
            coupon: bestCode
          },
          success: () => { location.reload(); },
          error: () => { location.reload(); }
        });
      }
    },

    nolo: {
      id: 10218, 
      preApplyCodes: function(callback) {
        const elTotal = $('.tax-checkout-grandtotal .cart-totals-price');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        $.ajax({
          url: 'https://store.nolo.com/products/checkout/cart/couponPost/',
          type: 'POST',
          data: {
            remove: 0,
            coupon_code: code
          },
          success: () => {
            $.get('https://store.nolo.com'+window.location.pathname, (responseGet) => {
              const elTotal = $(responseGet).find('.tax-checkout-grandtotal .cart-totals-price');
              var value = 0;
              if( elTotal.length > 0 ){
                 $( elTotal ).each(function( index ) {
                  value += convertNumbers($( this ).text().replace( /[^0-9.,]/g, '').trim());                
                 });
              }else{
                  value = Number.POSITIVE_INFINITY;
              }              
              callback(value);
            });
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#coupon_code').value = bestCode;
        document.querySelector('#coupon_code').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('button.btn-apply-coupon').click();  
      }
    },

  planttherapy: {
      id: 28559,
      preApplyCodes: function(callback) {
        const elTotal = $('.cart-summary div :contains("Estimated Total:"), .basket-total-row .basket-total-amount');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const url = $('#js_coupon_form, #osel-coupon-form').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('#js_coupon_form, #osel-coupon-form'));
        formData['Coupon_Code'] = code;
        $.ajax({
          url: url,
          type: 'POST',
          data: formData,
          success: (responseGet) => {
              const elTotal = $(responseGet).find('.cart-summary div :contains("Estimated Total:"), .basket-total-row .basket-total-amount');
              const value = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;              
              callback(value);
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#l-coupon-code').value = bestCode;
        document.querySelector('#l-coupon-code').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('#l-coupon-code-button, #osel-coupon-form button').click();  
      }
    },

    zagg: {
      id: 1812,
      preApplyCodes: function(callback) {
        const elTotal = $('#cart-totals .amount[data-th="Total"] .price, .grand.totals .amount .price, strong .price');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const url = $('.discount-coupon-form').attr('action');
        $.ajax({
          url: url,
          type: 'POST',
          data: {
            remove: 0,
            coupon_code: code
          },
          success: () => {
            $.get('https://'+window.location.hostname+window.location.pathname, (responseGet) => {
              const checkoutconfigindex = responseGet.indexOf("window.checkoutConfig");
              const customerDataindex = responseGet.indexOf("window.customerData");
              const finalIndex = customerDataindex-checkoutconfigindex;
              const data = JSON.parse(responseGet.substr(responseGet.indexOf("window.checkoutConfig")+23, finalIndex-29));
              const value = data.totalsData.base_grand_total;
               $.post(url, { remove: 1 }, 
                (response) => {
                 callback(value);
                });              
            });
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        const url = $('.discount-coupon-form').attr('action');
        $.post(url, { remove: 0, coupon_code: bestCode }, 
          (response) => {
            location.reload();
          });
      }
    },

    pipingrock: {
      id: 11541,
      preApplyCodes: function(callback) {
        const elTotal = $('.cart-value-g_subtotal_after_discounts');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;        
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        $.ajax({
          url: 'https://'+window.location.hostname+'/cart',
          xhr: function() {
              var xhr = jQuery.ajaxSettings.xhr();
              var setRequestHeader = xhr.setRequestHeader;
              xhr.setRequestHeader = function(name, value) {
                  if (name == 'X-Requested-With') return;
                  setRequestHeader.call(this, name, value);
              }
              return xhr;
          },
          type: 'POST',
          data: {
            prcc: code
          },
          success: (response) => {
                const elTotal = $(response).find('.cart-value-g_subtotal_after_discounts');
                const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
                callback(value);
              }
          });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('[name="prcc"]').value = bestCode;
        document.querySelector('[name="prcc"]').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('.enter-code input[value="Apply"],.rewards-code input[value="Apply"]').click();
      }
    },

    tillys: {
      id: 1655,
      preApplyCodes: (callback) => {
        const orderValueEl = $('.order-total .order-value');
        const prevValue = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {
      if(window.location.href.indexOf("cart") > -1){ 
        $.get('https://'+window.location.hostname+'/on/demandware.store/Sites-tillys-Site/default/Cart-AddCouponJson?couponCode='+code+'&format=ajax&page=cart', 
              (responseGet) => {
                  $.get('https://'+window.location.hostname+'/cart', 
                    (response) => {
                      const orderValueEl = $(response).find('.order-total .order-value');
                      const value = orderValueEl.length > 0 ? 
                                    convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                    Number.POSITIVE_INFINITY;
                      callback(value);
                  });
              });
      }else{
         $.get('https://'+window.location.hostname+'/on/demandware.store/Sites-tillys-Site/default/Cart-AddCouponJson?couponCode='+code+'&format=ajax', 
              (responseGet) => {
                  $.get('https://'+window.location.hostname+'/on/demandware.store/Sites-tillys-Site/default/COBilling-UpdateSummary?checkoutStep=3', 
                    (response) => {
                      const orderValueEl = $(response).find('.order-total .order-value');
                      const value = orderValueEl.length > 0 ? 
                                    convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                    Number.POSITIVE_INFINITY;
                          $.get('https://'+window.location.hostname+'/on/demandware.store/Sites-tillys-Site/default/COBilling-RemoveCouponCode?couponCode='+code+'&format=ajax', 
                          (response) => {                                          
                            callback(value);
                        });
                  });
              });
          }
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#dwfrm_cart_couponCode').value = bestCode;
        document.querySelector('#dwfrm_cart_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('#add-coupon').click();
      }
    },


    jockey: {
      id: 1029,
      preApplyCodes: function(callback) {
        const elTotal = $('div.flex-row.sb.total span:contains("$")');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const url = 'https://www.jockey.com/api/basket/default/coupon/'+code+'?runTotals=true';
        $.ajax({
          url: url,
          type: 'PUT',
          success: (responseGet) => {
              const value = responseGet.Total;  
                    $.ajax({
                      url: url,
                      type: 'DELETE',
                      success: () => {  callback(value); },
                      error: () => {  callback(value); }
                });
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#couponCode').value = bestCode;
        document.querySelector('#couponCode').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('button[aria-label="Apply coupon"]').click();  
      }
    },

    charlottesweb: {
      id: 41356,
      preApplyCodes: function(callback) {
        const elTotal = $('#cart-totals .amount[data-th="Total"] .price, .grand.totals .amount .price, strong .price');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
         if(window.location.href.indexOf("cart") > -1){
            const url = $('#discount-coupon-form').attr('action');
            const form_key = $('input[name="form_key"]').val();
            $.post(url, { remove: 1,form_key: form_key }, 
            (response) => {
                 callback(prevValue);
            });
        }else{
           const windowVariables = retrieveWindowVariables(["window.checkoutConfig","window.NREUM"]);
           const quoteId = windowVariables["window.checkoutConfig"].quoteId;
           const xpid = windowVariables["window.NREUM"].loader_config.xpid;
           $.ajax({
            url: 'https://www.charlottesweb.com/rest/default/V1/guest-carts/'+quoteId+'/coupons',
            type: 'DELETE',
             headers: {
                'x-newrelic-id': xpid
                },
            success: () => { callback(prevValue); },
            error: () => { callback(prevValue); }
          });
        }
      },
      applyCode: function(code, callback) {
       this.preApplyCodes(() => {
        if(window.location.href.indexOf("cart") > -1){
          const url = $('#discount-coupon-form').attr('action');
          const form_key = $('input[name="form_key"]').val();
          $.ajax({
            url: url,
            type: 'POST',
            data: {
              remove: 0,
              form_key: form_key,
              coupon_code: code
            },
            success: () => {
              $.get('https://www.charlottesweb.com'+window.location.pathname, (responseGet) => {
                const checkoutconfigindex = responseGet.indexOf("window.checkoutConfig");
                const customerDataindex = responseGet.indexOf("window.customerData");
                const finalIndex = customerDataindex-checkoutconfigindex;
                const data = JSON.parse(responseGet.substr(responseGet.indexOf("window.checkoutConfig")+23, finalIndex-37));
                const value = data.totalsData.base_grand_total;
                callback(value);             
              });
            },error: (xhr, status, error) => {
               callback(Number.POSITIVE_INFINITY);
            }
          });
        }else{
          const windowVariables = retrieveWindowVariables(["window.checkoutConfig","window.NREUM"]);
           const quoteId = windowVariables["window.checkoutConfig"].quoteId;
           const xpid = windowVariables["window.NREUM"].loader_config.xpid;
           $.ajax({
                url: 'https://www.charlottesweb.com/rest/default/V1/guest-carts/'+quoteId+'/coupons/'+code,
                type: 'PUT',
                headers: {
                'x-newrelic-id': xpid
                },
                success: (data) => {
                  const ts = Math.round(new Date().getTime());
                      $.ajax({
                          url: 'https://www.charlottesweb.com/rest/default/V1/guest-carts/'+quoteId+'/payment-information?_='+ts,
                          type: 'GET',
                          headers: {
                          'x-newrelic-id': xpid
                          },
                          success: (response) => {                  
                             const value = response.totals.base_grand_total;
                             callback(value.toFixed(2));
                          }
                        });
                },error: (xhr, status, error) => {
                  console.log(error);
                  callback(Number.POSITIVE_INFINITY);
                }
              });
        }
       });
      },
      applyBestCode: (bestCode) => {
        if(window.location.href.indexOf("cart") > -1){
          const url = $('#discount-coupon-form').attr('action');
          const form_key = $('input[name="form_key"]').val();
          $.post(url, { remove: 0, coupon_code: bestCode,form_key: form_key }, 
            (response) => {
              location.reload();
            });
         }else{
           const windowVariables = retrieveWindowVariables(["window.checkoutConfig","window.NREUM"]);
           const quoteId = windowVariables["window.checkoutConfig"].quoteId;
           const xpid = windowVariables["window.NREUM"].loader_config.xpid;
           $.ajax({
                url: 'https://www.charlottesweb.com/rest/default/V1/guest-carts/'+quoteId+'/coupons/'+bestCode,
                type: 'PUT',
                headers: {
                'x-newrelic-id': xpid
                },
                success: () => {location.reload();}
              });
        }
      }
    },

    dollargeneral: {
      id: 5738,
      preApplyCodes: function(callback) {
        const elTotal = $('#cart-totals .amount[data-th="Order Total"] .price, .grand.totals .amount .price, strong .price');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        if(window.location.href.indexOf("cart") > -1){
          const url = $('#discount-coupon-form').attr('action');
          const formData = getFormFieldsAsJson(document.querySelector('#discount-coupon-form'));
          formData['coupon_code_fake'] = code;
          formData['coupon_code'] = code;
          formData['last_code'] = code;
          const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
          const quoteId = windowVariables["window.checkoutConfig"].quoteData.entity_id;
          const ts = Math.round(new Date().getTime());
          $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            success: () => {
             $.get('https://www.dollargeneral.com'+window.location.pathname, (responseGet) => {
                const checkoutconfigindex = responseGet.indexOf("window.checkoutConfig");
                const customerDataindex = responseGet.indexOf("window.customerData");
                const finalIndex = customerDataindex-checkoutconfigindex;
                const data = JSON.parse(responseGet.substr(responseGet.indexOf("window.checkoutConfig")+23, finalIndex-37));
                const value = data.totalsData.base_grand_total;
                const formData2 = getFormFieldsAsJson(document.querySelector('#discount-coupon-form'));
                formData2['last_code'] = code;
                formData2['remove_coupon'] = code;
                 $.post(url, formData2, 
                  (response) => {
                   callback(value);
                  });              
              });
            },error: () => {  callback(Number.POSITIVE_INFINITY);  }
          });
        }else{
         const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
         const quoteId = windowVariables["window.checkoutConfig"].quoteData.entity_id;
         $.ajax({
          url: 'https://www.dollargeneral.com/commerce/rest/default/V1/guest-carts/'+quoteId+'/coupons/'+code,
          type: 'PUT',
          success: (data) => {
            const ts = Math.round(new Date().getTime());
            $.ajax({
              url: 'https://www.dollargeneral.com/commerce/rest/default/V1/guest-carts/'+quoteId+'/payment-information?_='+ts,
              type: 'GET',
              success: (response) => {                  
               const value = response.totals.base_grand_total;
                $.ajax({
                  url: 'https://www.dollargeneral.com/commerce/rest/default/V1/guest-carts/'+quoteId+'/coupons',
                  type: 'DELETE',
                  success: (response) => {
                    callback(value.toFixed(2));
                  }
                });
              },
              error: () => { callback(Number.POSITIVE_INFINITY); }
            });
          },
          error: () => { callback(Number.POSITIVE_INFINITY); }
        });
        }
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#coupon_code_fake, #discount-code-fake').value = bestCode;
        document.querySelector('#coupon_code_fake, #discount-code-fake').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('#coupon_code_fake, #discount-code-fake').dispatchEvent(new Event('change', {bubbles: true}));
        document.querySelector('#coupon_code_fake, #discount-code-fake').dispatchEvent(new Event('blur')); 
        document.querySelector('#coupon_code_fake, #discount-code-fake').dispatchEvent(new Event('focus'));    
        document.querySelector('#discount-coupon-form .actions-toolbar button, .primary .action.action-apply').click();    
      }
    },

    freshdirect: {
      id: 6174,
      preApplyCodes: function(callback) {
        const elTotal = $('.st_val_ssOrderTotal');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const url = 'https://www.freshdirect.com/api/expresscheckout/promotion';
        $.ajax({
          url: url,
          type: 'POST',
          data: {data:JSON.stringify({"fdform":"promotion","formdata":{"promotionCode":code,"action":"applyPromotion"}})},
          success: (responseGet) => {
            if(responseGet.submitForm.result.cartData){
              const elTotal = responseGet.submitForm.result.cartData.estimatedTotal;  
              const value = elTotal ? 
                            convertNumbers(elTotal.replace( /[^0-9.,]/g, '').trim()) : 
                            Number.POSITIVE_INFINITY;
                $.ajax({
                  url: url,
                  type: 'POST',
                  data: {data:JSON.stringify({"fdform":"promotion","formdata":{"action":"removePromotion"}})},
                  success: () => {  callback(value); },
                  error: () => {  callback(value); }
                }); 
            }else{
              callback(Number.POSITIVE_INFINITY);
            }              
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#promotional-code').value = bestCode;
        document.querySelector('#promotional-code').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('#promotional-code-applybtn').click();  
      }
    },

    batteriesplus: {
      id: 397, 
      preApplyCodes: function(callback) {
        const elTotal = $('.order-summary strong.pull-right');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        $.ajax({
          url: 'https://www.batteriesplus.com/ShoppingCart/AddDiscount',
          type: 'POST',
          data: {
            couponCode: code
          },
          success: () => {
            $.get('https://www.batteriesplus.com'+window.location.pathname, (responseGet) => {
              const elTotal = $(responseGet).find('.order-summary strong.pull-right');
              const value = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
                $.ajax({
                  url: 'https://www.batteriesplus.com/ShoppingCart/RemoveDiscount',
                  type: 'POST',
                  data: {
                    couponCode: code
                  },
                  success: () => { callback(value); },
                  errror: () => { callback(value); },
                })
            });
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('input[name="couponCode"]').value = bestCode;
        document.querySelector('input[name="couponCode"]').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('.add-discount').click();  
      }
    },

  itcosmetics: {
    removePrevCode: function(code, callback) {
      var formData = {};
      formData['coupon_remove_'+code] = code
      const url = $('.c-form.m-reset.c-cart-coupon__form').attr('action');
      $.ajax({
        url: url+'?ajax=true',
        type: 'POST',
        data: formData,
        success: () => { callback(); },
        error: () => { callback(); }
      });   
    },
    preApplyCodes: function(callback) { 
      const elTotal = document.querySelector('.c-cart-summary-table .m-total .m-value').innerText;
      const prevValue = convertNumbers(elTotal.replace(/[^0-9.,]/g, '').trim());
      const prevCodeSelector = document.querySelector('.c-cart-coupon__list-remove');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.value;
        const prevCodeName = prevCodeSelector.getAttribute('name');
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
      this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => { 
      const url = $('.c-form.m-reset.c-cart-coupon__form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('.c-form.m-reset.c-cart-coupon__form'));
      formData['couponcode'] = code;
      $.post(url+'?ajax=true', formData, 
      (responsePost) => {
        const orderValueEl = $(responsePost).find('.c-cart-summary-table .m-total .m-value');
        const value = orderValueEl.length > 0 ? 
                    convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY; 
        callback(value);
      }).fail(function() { callback(Number.POSITIVE_INFINITY); });
    },
  },

    musicnotes: {
      id: 1225, 
      preApplyCodes: function(callback) {
        const elTotal = $('.total, h4.total-price');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
       const windowVariables = retrieveWindowVariables(["window.NREUM"]);
           const xpid = windowVariables["window.NREUM"].loader_config.xpid;
           $.ajax({
                url: 'https://www.musicnotes.com/checkout/ApplyVoucherCode',
                type: 'POST',
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'x-newrelic-id': xpid
                },
                data: {
                  voucherCode: code,
                },
                success: (data) => {
                  const ts = Math.round(new Date().getTime());              
                  $.ajax({
                      url: 'https://www.musicnotes.com/checkout/OrderSummarySection?_='+ts,
                      type: 'GET',
                      headers: {
                        'x-newrelic-id': xpid
                      },
                    success: (responseGet) => { 
                        const elTotal = $(responseGet).find('.total, h4.total-price');
                        const value = elTotal.length > 0 ? 
                          convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY; 
                          callback(value);
                    },errror: () => { callback(Number.POSITIVE_INFINITY); },
                  })
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#DiscountID, #voucherCodeInput').value = bestCode;
        document.querySelector('#DiscountID, #voucherCodeInput').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('#applyDisc, #applyVoucherCodeButton').click();  
      }
    },

    readers: {
      id: 6174,
      preApplyCodes: function(callback) {
        const elTotal = $('.cart-total span, tr.total span');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const url = 'https://www.readers.com/cart.php';
        var formData,getUrl,method,getformData,ts;
        ts = Math.round(new Date().getTime());
        if(window.location.href.indexOf("checkout") > -1){
          formData = {coupon:code, mode:'add_coupon'};
          getUrl = 'https://www.readers.com/get_block.php?block=opc_totals';
          getformData = {t:ts};
          method = 'GET';
        }else{
          formData = getFormFieldsAsJson(document.querySelector('#js_coupon_form, #osel-coupon-form'));
          formData['coupon'] = code;
          formData['mode'] = 'add_coupon';
          getUrl = 'https://www.readers.com/cart.php';
          method = 'POSt';
        }
        $.ajax({
          url: url,
          type: 'POST',
          data: formData,
          success: () => {
             $.ajax({
                url: getUrl,
                type: method,
                data: getformData,
                success: (responseGet) => {
                  const elTotal = $(responseGet).find('.cart-total span, tr.total span');
                  const value = elTotal.length > 0 ? 
                                convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                Number.POSITIVE_INFINITY;
                  $.ajax({
                    url: 'https://www.readers.com/cart.php?mode=unset_coupons',
                    type: 'GET',
                    success: () => {  callback(value); },
                    error: () => {  callback(value); }
                  });
                }
              });
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#coupon').value = bestCode;
        document.querySelector('#coupon').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('#coupon').dispatchEvent(new Event('change', {bubbles: true}));
        document.querySelector('#coupon').dispatchEvent(new Event('blur')); 
        document.querySelector('#coupon').dispatchEvent(new Event('focus'));
        setTimeout(function(){
           document.querySelector('[aria-label="apply coupon"], #apply_coupon').click();   
        }, 1000);        
      }
    },

    paulaschoice: {
      id: 10036, 
      preApplyCodes: function(callback) {
        const elTotal = $('body:not(:has(.loader)) [class*="BagOrderTotals__Total"] > [class*="BagOrderTotals__Value"]');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const csrfToken = getCookie('sid');
        $.ajax({
          url: 'https://www.paulaschoice.com/on/demandware.store/Sites-paulaschoice_us-Site/en_US/Bag-AddCoupon',
          type: 'POST',
          data: JSON.stringify({couponCode:code, csrfToken:csrfToken+'='}),
          headers: {
                'content-type': 'application/json;charset=UTF-8'
          },
          success: (response) => {
            const value = response.data.amountDue.value;
            $.ajax({
              url: 'https://www.paulaschoice.com/on/demandware.store/Sites-paulaschoice_us-Site/en_US/Bag-RemoveCoupon',
              type: 'POST',
              data: JSON.stringify({couponCode:code, csrfToken:csrfToken+'='}),
              headers: {
                'content-type': 'application/json;charset=UTF-8'
              },
              success: () => { callback(value); },
              errror: () => { callback(value); },
            })
          },
          error: (xhr, status, error) => {
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        const promo_box = document.querySelector('input[name="couponCode"]');
        promo_box.value = bestCode;
        promo_box.dispatchEvent(new Event('input', {bubbles: true}));
        promo_box.dispatchEvent(new Event('change', {bubbles: true}));
        promo_box.dispatchEvent(new Event('blur'));
        promo_box.dispatchEvent(new Event('focus'));
        document.querySelector('input[value="Apply"]').click();
      }
    },

    arttoframe: {
      id: 25484, 
      preApplyCodes: function(callback) {
        const elTotal = $('#cart_total_div tbody tr td:contains(Total) + td');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
       $.ajax({
          url: 'https://www.arttoframe.com/cartmanager.php',
          type: 'POST',
          data: {coupon_code:code},
          xhr: function() {
              var xhr = jQuery.ajaxSettings.xhr();
              var setRequestHeader = xhr.setRequestHeader;
              xhr.setRequestHeader = function(name, value) {
                  if (name == 'X-Requested-With') return;
                  setRequestHeader.call(this, name, value);
              }
              return xhr;
          },
          success:  (data, textStatus, request) => {
                $.get('https://www.arttoframe.com'+window.location.pathname, 
                    (responseget) => {
                      const elTotal = $(responseget).find('#cart_total_div tbody tr td:contains(Total) + td');
                      const value = elTotal.length > 0 ? 
                                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                    Number.POSITIVE_INFINITY; 
                      callback(value);
                 });
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#coupon_code').value = bestCode;
        document.querySelector('#coupon_code').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('.clsApplyNew').click();  
      }
    },

    shopbop: {
      id: 1492, 
      preApplyCodes: function(callback) {
        const elTotal = $('[data-at="subtotal"]');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
       const locale = $('body').attr("data-locale");
       const currency = $('body').attr("data-currency");
       const siteId = $('#site-id').attr("data-site-id");
       const csrfToken = $('#csrfToken').attr("data-csrf-token");
       const cartId = $('[data-at="ShoppingCart"]').attr('data-cart-id');
       const url = 'https://api.shopbop.com/carts/'+cartId+'?siteId='+siteId+'&lang='+locale+'&currency='+currency;
      $.ajax({
          url: url,
          type: 'POST',
          data: JSON.stringify({promotionCode:code}),
          headers: {
                'content-type': 'application/json;charset=UTF-8',
                'csrf-token': csrfToken
          },
          success: (response) => {
              const elTotal = response.total;
              const value = elTotal ? 
                            convertNumbers(elTotal.replace( /[^0-9.,]/g, '').trim()) : 
                            Number.POSITIVE_INFINITY;
                $.ajax({
                  url: url,
                  type: 'POST',
                  data: JSON.stringify({promotionCode:''}),
                  headers: {
                        'content-type': 'application/json;charset=UTF-8',
                        'csrf-token': csrfToken
                  },
                  success: () => { callback(value); },
                  errror: () => { callback(value); },
                })
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('[data-at="PromotionInput"]').value = bestCode;
        document.querySelector('[data-at="PromotionInput"]').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('[data-at="DesktopPromotionApplyButton"]').click();  
      }
    },

    bluenile: {
      id: 23657, 
      preApplyCodes: function(callback) {
        const elTotal = $('.total .right');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        const userstate  = $('body').attr('data-userstate');
        const userData = JSON.parse(userstate);
        const url = 'https://secure.bluenile.com/api/secure/basket/source-code?country='+userData.countryCode+'&language='+userData.languageCode+'&productSet='+userData.productSet+'&currency='+userData.currencyCode;
        $.ajax({
              url: url,
              type: 'DELETE',
              success: () => { callback(prevValue); },
              errror: () => { callback(prevValue); },
            })
      },
      applyCode: function(code, callback) {
         this.preApplyCodes(() => {
          this._applyCode(code, function(value) {
            callback(value);
          }); 
        });       
      },
      applyBestCode: function(bestCode) {
         this._applyCode(bestCode, function() {
            location.reload();
          }) ; 
      },
       _applyCode: (code, callback) => {
        const formData = getFormFieldsAsJson(document.querySelector('#pf-form'));
        const userstate  = $('body').attr('data-userstate');
        const userData = JSON.parse(userstate);
        const url = 'https://secure.bluenile.com/api/secure/basket/source-code?country='+userData.countryCode+'&language='+userData.languageCode+'&productSet='+userData.productSet+'&currency='+userData.currencyCode;
        formData['sourceCode'] = code;
        $.ajax({
          url: url,
          type: 'POST',
          data: formData,
          success: (response) => {
            const value = response.orderTotalNum;
            callback(value);
          },
          error: (xhr, status, error) => {
            callback(Number.POSITIVE_INFINITY);
          }
        });
       }
    },

    insomniacookies: {
      id: 30060, 
      preApplyCodes: function(callback) {
        const elTotal = $('.cart-total-item:last-child .pull-right b');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        var ts1 = Math.round(new Date().getTime());
         $.get('https://insomniacookies.com/shop/addCoupon/'+code+'/website?_='+ts1, 
              (response) => {
                if(response.success == true){
                  var ts2 = Math.round(new Date().getTime());
                  $.get('https://insomniacookies.com/shop/getCart?_='+ts2, 
                  (responseget) => {
                      var ts3 = Math.round(new Date().getTime());
                      const value=responseget.totals.total;
                       $.get('https://insomniacookies.com/shop/deleteCoupon?_='+ts3, 
                        () => {
                            callback(value);                            
                        });
                  });
                }else{
                  callback(Number.POSITIVE_INFINITY);
                }
              });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#cart-side-panel-component.active input[aria-label="Enter Coupon Code"], .cart-open [aria-label="Enter Coupon Code"]').value = bestCode;
        document.querySelector('#cart-side-panel-component.active input[aria-label="Enter Coupon Code"], .cart-open [aria-label="Enter Coupon Code"]').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('#cart-side-panel-component .input-group button.btn.btn-outline-primary.ae-button[data-ae-blurbtype="button"][data-ae-form-field="true"]').click();
      }
    },


    quill: {
      id: 1412, 
      preApplyCodes: function(callback) {
        const elTotal = $('#TotalLabel, #TotalLabelFR');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const formData = getFormFieldsAsJson(document.querySelector('#CheckoutCartForm'));
        const url = $('#CheckoutCartForm').attr('action');
        formData['CouponViewModel.CouponCode'] = code;
        formData['CouponViewModel.CouponAction'] = '1';
        formData['CouponApply'] = 'True';
        formData['isClickedApplyBtn'] = 'True';
        $.ajax({
          url: 'https://www.quill.com'+url,
          type: 'POST',
          data: formData,
          success: (response) => {
              const elTotal = $(response).find('#ItemPriceLabel');
              const value = elTotal.length > 0 ? 
                            convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                            Number.POSITIVE_INFINITY; 
              callback(value);
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('.couponStackbleInputDiv .scInput, #CouponInput').value = bestCode;
        document.querySelector('.couponStackbleInputDiv .scInput, #CouponInput').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('#couponSection [name="CouponApplyButton"]').click();  
      }
    },

    converse: {
      id: 3587,
      preApplyCodes: function(callback) {
        const elTotal = $('div.order-total span.price, .total');
        const prevValue = elTotal.length > 0 ? 
                        convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const windowVariables = retrieveWindowVariables(["window.Urls"]);
        const addCouponUrl = windowVariables["window.Urls"].addCoupon;
        const removeCouponUrl = windowVariables["window.Urls"].removeCoupon;
        $.get(addCouponUrl+'?format=ajax&couponCode='+code+'&reload=false', 
          (response) => {
           const elTotal = response.couponData.totals.total;
           const value = elTotal ? 
                        convertNumbers(elTotal.replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
            $.get(removeCouponUrl+'?format=ajax&couponCode='+code+'&reload=false', 
              () => {
               callback(value);  
            });                    
        });
      },
      applyBestCode: function(bestCode) {
        document.querySelector('input[name="dwfrm_cart_couponCode"]').value = bestCode;
        document.querySelector('input[name="dwfrm_cart_couponCode"]').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('#add-coupon').click();
      }
    },


    'famous-smoke': {
      id: 6316, 
      preApplyCodes: function(callback) {
        const elTotal = $('.pricebox span:last, #ordersummary_grandtotal');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) { 
       if(window.location.href.indexOf("cart") > -1){
        const url = 'https://www.famous-smoke.com/cigars/include/ajax_responder.cfm';
        $.post(url,{task:'activateCoupon', coupon_code:code}, 
            () => {
             var ts1 = Math.round(new Date().getTime());
                $.get('https://'+window.location.hostname+window.location.pathname+'?keyword='+code+'&_='+ts1, 
                  (response) => {
                    const elTotal = $(response).find('.pricebox span:last');
                    const value = elTotal.length > 0 ? 
                                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                  Number.POSITIVE_INFINITY; 
                    $.post(url,{task:'activateCoupon', coupon_code:''}, 
                      () => {
                       callback(value);  
                    });                    
                });
          });
        }else{
          $.post('https://www.famous-smoke.com/checkout/coupon',{coupon_code:code}, 
            () => {
                var ts1 = Math.round(new Date().getTime());
                $.get('https://www.famous-smoke.com/checkout/ordersummary?_='+ts1, 
                  (response) => {
                    const elTotal = $(response).find('#ordersummary_grandtotal');
                    const value = elTotal.length > 0 ? 
                                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                  Number.POSITIVE_INFINITY; 
                    $.post('https://www.famous-smoke.com/checkout/coupon',{ coupon_code:''}, 
                      () => {
                       callback(value);  
                    });                    
                });
            });  
        } 
      },
      applyBestCode: (bestCode) => {
        document.querySelector('[name="coupon_code"], #couponcode').value = bestCode;
        document.querySelector('[name="coupon_code"], #couponcode').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        setTimeout(function(){ document.querySelector('a.btn_center, [name="coupon_code"] + button, .btn-promo').click(); }, 1000); 
      }
    },

  'ross-simons': {
      id: 1446, 
      preApplyCodes: function(callback) {
        const elTotal = $('.order-total .order-value');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
          const url = $('#cart-items-form').attr('action');
          const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
          formData['dwfrm_cart_couponCode'] = code;
          formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
          $.post(url, formData, 
            (responsePost) => {
              $.get('https://'+window.location.hostname+'/cart', (response) => {
                const elTotal = $(response).find('.order-total .order-value');
                const value = elTotal.length > 0 ? 
                                convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                Number.POSITIVE_INFINITY; 
                callback(value);
              });
            });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#dwfrm_cart_couponCode').value = bestCode;
        document.querySelector('#dwfrm_cart_couponCode').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('#add-coupon').click();
      }
    },

    cleanitsupply: {
      id: 29542, 
      preApplyCodes: function(callback) {
        const elTotal = $('#total-cart-amount');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
          const url = window.location.href;
          $.post(url, {action:'applyCoupon', couponCode:code}, 
            (responsePost) => {
              $.get(url, (response) => {
                const elTotal = $(response).find('#total-cart-amount');
                const value = elTotal.length > 0 ? 
                                convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                Number.POSITIVE_INFINITY; 
                $.get('https://cleanitsupply.com/smartcheckout3.aspx?action=removeCoupon&couponCode='+code, () => {
                  callback(value);
                });                
              });
            });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#coupon-code').value = bestCode;
        document.querySelector('#coupon-code').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('.applyCouponLink').click();
      }
    },

  koleimports: {
      id: 15657,
      preApplyCodes: function(callback) {
        var elTotal; var prevValue;
         if(document.location.pathname.indexOf("/checkout/cart/") === 0){
            elTotal = $('#shopping-cart-totals-table tfoot tr:last-child td:last-child .price');
            prevValue = elTotal.length > 0 ? 
                          convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY; 
        }else{
            elTotal = $('.onestepcheckout-totals tr.grand-total span.price');     
            prevValue = elTotal.length > 0 ? 
                        convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;               
       }
        callback(prevValue);
      },
      applyCode: function(code, callback) {
         if(document.location.pathname.indexOf("/checkout/cart/") === 0){
             $.ajax({
              url: 'https://www.koleimports.com/checkout/cart/couponPost/',
              type: 'POST',
              data: {
                remove: 0,
                coupon_code: code
              },
              success: (data, textStatus, request) => {
                const locationUrl = request.getResponseHeader('location');
                $.get(locationUrl , (responseGet) => {
                  const elTotal = $(responseGet).find('#shopping-cart-totals-table tfoot tr:last-child td:last-child .price');
                  var value = 0;
                  if( elTotal.length > 0 ){
                     $( elTotal ).each(function( index ) {
                      value += convertNumbers($( this ).text().replace( /[^0-9.,]/g, '').trim());                
                     });
                  }else{
                      value = Number.POSITIVE_INFINITY;
                  }
                  
                  callback(value);
                });
              },
              error: (xhr, status, error) => {
                 callback(Number.POSITIVE_INFINITY);
              }
            });
       }else{
          $.ajax({
            url:  'https://www.koleimports.com/onestepcheckout/ajax/add_coupon/',
            type: 'POST',
            data: {code: code},
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            success: (response) => {           
                  $.get('https://www.koleimports.com/onestepcheckout/', 
                  (response) => {
                          const total = $(response).find('.onestepcheckout-totals tr.grand-total span.price');     
                          const value = total.length > 0 ? 
                                          convertNumbers(total.text().replace( /[^0-9.,]/g, '').trim()) : 
                                          Number.POSITIVE_INFINITY;
                          callback(value); 
                    }); 
            },
            error: (xhr, status, error) => {
              console.log(error);
              callback(Number.POSITIVE_INFINITY);
            }
          });
        }
      },
      applyBestCode: function(bestCode) {
        document.querySelector('#coupon_code, #id_couponcode').value = bestCode;
        document.querySelector('#coupon_code, #id_couponcode').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('#discount-coupon-form button[value="Apply Coupon"], #onestepcheckout-coupon-add').click();
      }
    },

    surlatable: {
      id: 1583,
      preApplyCodes: (callback) => {
        const orderValueEl = $('.order-total .order-value');
        const prevValue = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {
      if(window.location.href.indexOf("cart") > -1){ 
        const url = $('#cart-items-form').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
        formData['dwfrm_cart_couponCode'] = code;
        formData['dwfrm_cart_updateCart'] = 'dwfrm_cart_updateCart';
        $.post(url, formData, 
          (response) => {
            const orderValueEl = $(response).find('.order-total .order-value');
            const value = orderValueEl.length > 0 ? 
                              convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
            callback(value);
          });
      }else{
        $.get('https://www.surlatable.com/on/demandware.store/Sites-SLT-Site/default/Cart-AddCouponJson?couponCode='+code+'&format=ajax', 
          (response) => {
           const value = response.baskettotal;
           callback(value);
          }); 
        }
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#dwfrm_cart_couponCode, #dwfrm_billing_couponCode').value = bestCode;
        document.querySelector('#dwfrm_cart_couponCode, #dwfrm_billing_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('#add-coupon').click();
      }
    },

   bbqguys: {
      id: 7998,
      preApplyCodes: (callback) => {
        const orderValueEl = $('#totals-total');
        const prevValue = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {
        const url = 'https://www.bbqguys.com/coupon-code-ajax';
        $.post(url, {for:'cartCheckout',couponCode:code}, 
          (response) => {
            const value = response.total;
            callback(value);
          });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#payment-coupon-input').value = bestCode;
        document.querySelector('#payment-coupon-input').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('#payment-coupon-input + button').click();
      }
    },

   clarksusa: {
      id: 10105,
      preApplyCodes: (callback) => {
        const orderValueEl = $('.total-incl-vat-amount');
        const prevValue = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {
        const csrftoken = $('[name="CSRFToken"]').val();
        const url = 'https://www.clarksusa.com/cart/apply-voucher-ajax';
        $.post(url, {CSRFToken:csrftoken,voucherCode:code}, 
          (response) => {
            const value = response.data.remainingTotalPrice;
              $.post('https://www.clarksusa.com/cart/release-voucher-ajax', {CSRFToken:csrftoken,voucherCode:code}, 
                () => {
                  callback(value);
                })
          });
      },
      applyBestCode: (bestCode) => {
          document.querySelector('#vouhcerCode').value = bestCode;
          document.querySelector('#vouhcerCode').dispatchEvent(new Event('input', { bubbles: true } ));
          document.querySelector('.js-apply-promo-code').click(); 
      }
    },

  'magazines': {
      id: 281,
      preApplyCodes: (callback) => {
        const orderValueEl = $('#storeCheckoutForm[style="display: block;"] #subTotalCont #subTotal__amount--price');
        const prevValue = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {
          document.querySelector('#storeCheckoutForm input#couponCode').value = code;
          document.querySelector('#storeCheckoutForm input#couponCode').dispatchEvent(new MouseEvent('input', {bubbles: true}));
          document.querySelector('#storeCheckoutForm button.coupon-apply').click();
          setTimeout(function(){              
               const elTotal = $('#storeCheckoutForm[style="display: block;"] #subTotalCont #subTotal__amount--adjusted');
               const value = elTotal.length > 0 ? 
                              elTotal.first().text() : 
                              Number.POSITIVE_INFINITY;
                const fvalue = value ? 
                               convertNumbers(value.replace( /[^0-9.,]/g, '').trim()) : 
                               Number.POSITIVE_INFINITY;
               callback(fvalue);
           }, 3000);
      },
      applyBestCode: (bestCode) => {
          document.querySelector('#storeCheckoutForm input#couponCode').value = bestCode;
          document.querySelector('#storeCheckoutForm input#couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
          document.querySelector('#storeCheckoutForm button.coupon-apply').click(); 
      }
    },

  myprotein: {
      id: 13721, 
      preApplyCodes: function(callback) {
        const elTotal = $('.athenaBasket_totalValue');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
         $.post('https://'+window.location.hostname+'/my.basket', {
            discountCode: code
          }, (response) => {
            const elTotal = $(response).find('.athenaBasket_totalValue');
            const value = elTotal.length > 0 ? 
                          convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
            callback(value);
          });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#discountcode').value = bestCode;
        document.querySelector('#discountcode').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('#add-discount-code').click();
      }
    },

    ganderoutdoors: {
      id: 33333, 
      preApplyCodes: function(callback) {
        const elTotal = $('.estimated-price');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
         callback(prevValue);
      },
      applyCode: function(code, callback) {
        if(window.location.href.indexOf("cart") > -1){ 
          const url = $('form[name="dwfrm_cart"]').attr('action');
          const formData = getFormFieldsAsJson(document.querySelector('form[name="dwfrm_cart"]'));
          formData['dwfrm_cart_couponCode'] = code;
          formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
          $.post(url, formData, 
            (response) => {
               const orderValueEl = $(response).find('.estimated-price');
               const value = orderValueEl.length > 0 ? 
                                  convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                                  Number.POSITIVE_INFINITY;               
               callback(value);
          });
        }else{
          $.get('https://www.ganderoutdoors.com/on/demandware.store/Sites-GanderOutdoors-Site/default/Cart-AddCouponJson?couponCode='+code+'&format=ajax&fromCheckout=true', 
          (response) => {
             $.get('https://www.ganderoutdoors.com'+window.location.pathname, 
                (responseget) => {
                   const orderValueEl = $(responseget).find('.estimated-price');
                   const value = orderValueEl.length > 0 ? 
                                      convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                                      Number.POSITIVE_INFINITY;               
                   callback(value); 
              });                  
          });
        }
      },
      applyBestCode: (bestCode) => {
        location.reload();
      }
    },

    carid: {
      id: 5779,
      preApplyCodes: function(callback) {
        const elTotal = $('.cart-order-list li:last span.price');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const url = 'https://www.carid.com/cart.php';
        var formData,getUrl,method,getformData,ts;
          formData = {coupon:code, mode:'add_coupon'};
          formData['mode'] = 'add_coupon';
          getUrl = 'https://www.carid.com/cart.php';
          method = 'GET';
        $.ajax({
          url: url,
          type: 'POST',
          data: formData,
          success: () => {
             $.ajax({
                url: getUrl,
                type: method,
                data: getformData,
                success: (responseGet) => {
                  const elTotal = $(responseGet).find('.cart-order-list li:last span.price');
                  const value = elTotal.length > 0 ? 
                                convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                Number.POSITIVE_INFINITY;
                  $.ajax({
                    url: 'https://www.carid.com/cart.php?mode=unset_coupons',
                    type: 'GET',
                    success: () => {  callback(value); },
                    error: () => {  callback(value); }
                  });
                }
              });
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
         const formData = {coupon:bestCode, mode:'add_coupon'};
        $.ajax({
          url: 'https://www.carid.com/cart.php',
          type: 'POST',
          data: formData,
          success: () => {location.reload(); },
          error: () => {location.reload(); }
        });
      }
    },


   'mileskimball': {
      id: 1176,
      preApplyCodes: (callback) => {
        const orderValueEl = $('[data-calc-co1="total"]');
        const prevValue = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {
        const url = 'https://www.mileskimball.com/api/v1/CartPromotionCodes?sourcecode='+code;
        var formData,getUrl;
        formData = {sourcecode:code};
        getUrl = 'https://www.mileskimball.com/api/v1/ShoppingCart?forceValidateCart=false';
        $.ajax({
          url: url,
          type: 'POST',
          data: JSON.stringify(formData),
          contentType: 'application/json;charset=UTF-8',
          success: () => {
               $.get(getUrl, 
                (responseget) => {
                   const value = responseget.Totals.Total._amount; 
                    $.ajax({
                      url: url,
                      type: 'DELETE',
                      success: () => { callback(value); },
                      error: () => { callback(value); }
                    });
              }); 
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
          document.querySelector('#sourceCode').value = bestCode;
          document.querySelector('#sourceCode').dispatchEvent(new Event('input', { bubbles: true } ));
          document.querySelector('#SourceCodeButton1').click(); 
      }
    },

    scholastic: {
      id: 1466,
      preApplyCodes: function(callback) {
        const elTotal = $('#order_total, .list-cart-total li:first span, .order_total, #lblGrandTotal');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) { 
        const windowVariables = retrieveWindowVariables(["window.Urls"]);
        const addCouponUrl = windowVariables["window.Urls"].addCoupon;      
            $.get(addCouponUrl+'?couponCode='+code+'&format=ajax', 
              (response) => {
               const value = response.baskettotal;
               callback(value);
              });         
      },
      applyBestCode: (bestCode) => {
        location.reload();
      }
    },

   'theclassyhome': {
      id: 7033,
      preApplyCodes: (callback) => {
        const orderValueEl = $('#grandtotal');
        const prevValue = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {
        const url = 'https://www.theclassyhome.com/cartProcessor.php';
        const formData = {discountCode:code, command:'applyDiscountCode'};
        $.ajax({
          url: url,
          type: 'POST',
          data: formData,
          success: () => {
               $.post(url, {command:'getCartData'},
                (response) => {
                  const elTotal = $(response).find('#grandtotal');
                  const value = elTotal.length > 0 ? 
                                convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                Number.POSITIVE_INFINITY;
                  callback(value);  
              }); 
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
          document.querySelector('#discount-code').value = bestCode;
          document.querySelector('#discount-code').dispatchEvent(new Event('input', { bubbles: true } ));
          document.querySelector('#applyDiscountCode').click(); 
      }
    },

  amerimark: {
      id: 2825, 
      preApplyCodes: function(callback) {
        const elTotal = $('.orderSummaryCartTotalValue');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
         $.get('https://www.amerimark.com/ajax/setCouponCode.html?couponCode='+code, () => {
           $.get('https://www.amerimark.com/'+window.location.pathname, (response) => {
            const elTotal = $(response).find('.orderSummaryCartTotalValue');
            const value = elTotal.length > 0 ? 
                          convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
            callback(value);
             });
          });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#promo_code').value = bestCode;
        document.querySelector('#promo_code').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('#coupon_code_button').click();
      }
    },

  contactsdirect: {
      id: 24477,
      preApplyCodes: function(callback) {
        const elTotal = $('.cart_amount.price-align.insurance_amount.total');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const csrfToken = $('[name="csrfToken"]').val();
       $.ajax({
          url: 'https://www.contactsdirect.com/cart/promo',
          type: 'POST',
          data: {promoCode:code, csrfToken:csrfToken },
          success: (response) => {
                const elTotal = $(response).find('.cart_amount.price-align.insurance_amount.total');
                const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
                const removeUrl = $(response).find('.remove_promo').attr('href');
                if(removeUrl){
                  $.get('https://www.contactsdirect.com'+removeUrl, () => {
                   callback(value);
                 });
                }else{
                   callback(value);
                }                                 
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });         
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#promoCode').value = bestCode;
        document.querySelector('#promoCode').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        document.querySelector('#addPromo').click();  
      }
    },

    keenfootwear: {
      id: 15959,
      preApplyCodes: function(callback) {
        const elTotal = $('.price.total');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
         if(window.location.href.indexOf("cart") > -1){
          const url = $('form[name="dwfrm_cart"]').attr('action');
          const formData = getFormFieldsAsJson(document.querySelector('form[name="dwfrm_cart"]'));
          formData['dwfrm_cart_couponCode'] = code;
          formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
          $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            success: (response, status, xhr) => {
                const elTotal = $(response).find('.price.total');
                const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;                
                callback(value);
            },
            error: (xhr, status, error) => {
              callback(Number.POSITIVE_INFINITY);
            }
          });
        }else{
           $.get('https://www.keenfootwear.com/on/demandware.store/Sites-keen_us-Site/en_US/Cart-AddCouponJson?couponCode='+code+'&format=ajax', (responseGet) => {             
              const value = responseGet.baskettotal;
              callback(value);                  
            });
        }
      },
      applyBestCode: (bestCode) => {
        location.reload();  
      }
    },

  honest: {
      id: 14224,
      preApplyCodes: function(callback) {
        const elTotal = $('.grand-total');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {   
        const url = $('.promo-code-form').attr('action'); 
        const csrf_token = $('[name="csrf_token"]').val();   
          $.ajax({
            url: 'https://'+window.location.hostname+url+'?couponCode='+code+'&csrf_token='+csrf_token,
            type: 'GET',
            success: (response, status, xhr) => {
              if(response.totals){
                const elTotal = response.totals.grandTotal;
                const value = elTotal ? 
                        convertNumbers(elTotal.replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
               callback(value);
              }else{
                callback(Number.POSITIVE_INFINITY);
              }              
            },error: (xhr, status, error) => {
              callback(Number.POSITIVE_INFINITY);
            }
          });       
      },
      applyBestCode: (bestCode) => {
        location.reload();
      }
    },

  overtons: {
    id: 1309, 
    preApplyCodes: function(callback) {
      const elTotal = $('.estimated-price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
       callback(prevValue);
    },
    applyCode: function(code, callback) {
      if(window.location.href.indexOf("cart") > -1){ 
        const url = $('form[name="dwfrm_cart"]').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('form[name="dwfrm_cart"]'));
        formData['dwfrm_cart_couponCode'] = code;
        formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
        $.post(url, formData, 
          (response) => {
             const orderValueEl = $(response).find('.estimated-price');
             const value = orderValueEl.length > 0 ? 
                                convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                                Number.POSITIVE_INFINITY;               
             callback(value);
        });
      }else{
       const windowVariables = retrieveWindowVariables(["window.Urls"]);
       const addCouponUrl = windowVariables["window.Urls"].addCoupon;
        $.get(addCouponUrl+'?couponCode='+code+'&format=ajax&fromCheckout=true', 
        (response) => {
           $.get('https://'+window.location.hostname+window.location.pathname, 
              (responseget) => {
                 const orderValueEl = $(responseget).find('.estimated-price');
                 const value = orderValueEl.length > 0 ? 
                                    convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                                    Number.POSITIVE_INFINITY;               
                 callback(value); 
            });                  
        });
      }
    },
    applyBestCode: (bestCode) => {
      location.reload();
    }
  },

  allheart: {
      id: 15603, 
      preApplyCodes: function(callback) {
        const elTotal = $('#cart_value_total');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        var ts1 = Math.round(new Date().getTime());
        const Email = $('#Email').val();
         $.get('https://www.allheart.com/AppApplyCoupon.aspx?couponCode='+code+'&email='+encodeURIComponent(Email)+'&extra='+ts1+'&d=1', () => {
           setTimeout(function(){
            var ts2 = Math.round(new Date().getTime());        
             $.get('https://www.allheart.com/AppCartView.aspx?extra='+ts2, (responseGet) => {
                const data = JSON.parse(responseGet);
                const elTotal = data.subTotal;
                const value = elTotal ? 
                            convertNumbers(elTotal.replace( /[^0-9.,]/g, '').trim()) : 
                            Number.POSITIVE_INFINITY;
                callback(value);
               }); 
            }, 1000);
          });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#coupon_code').value = bestCode;
        document.querySelector('#coupon_code').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('.apply_code.coupon').click();
      }
    },

    saatchiart: {
      id: 14427, 
      preApplyCodes: function(callback) {
        const elTotal = $('.cart__total .cart__total__inner .cart__total__row div span');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
       $.ajax({
            url: 'https://www.saatchiart.com/cart-api/coupon',
            type: 'PUT',
            data: {
              code: code,
            },
            success: (response) => {
              $.get('https://www.saatchiart.com/cart-api/cart', (responseGet) => {
                const value = responseGet.total_order_price_to_pay/100;
                callback(value);
               }); 
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
         $.ajax({
            url: 'https://www.saatchiart.com/cart-api/coupon',
            type: 'PUT',
            data: {
              code: bestCode,
            },
            success: (response) => { location.reload(); }
          });
      }
    },

  newchic: {
      id: 26165, 
      preApplyCodes: function(callback) {
        const elTotal = $('.summary-subtotal-container-js div:last-child div');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
         $.post('https://www.newchic.com/api/shopcart/useCoupon/', {coupon_code: code}, (response) => {
          if(response.result.cartSumary){
            const elTotal = response.result.cartSumary.formatFinalTotal.amount;
            const value =  elTotal ? 
                          convertNumbers(elTotal.replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
            callback(value);
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        document.querySelector('.coupon-select-input-js').value = bestCode;
        document.querySelector('.coupon-select-input-js').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('.coupon-discount-apply-btn-js').click();
      }
    },

    sonos: {
      id: 4840,
      preApplyCodes: function(callback) {
        const windowVariables = retrieveWindowVariables(["cartData"]);
        const prevValue = windowVariables["cartData"].revenue;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const windowVariables = retrieveWindowVariables(["window.Urls"]);
        const addCouponUrl = windowVariables["window.Urls"].addCartCoupon;      
        $.get(addCouponUrl+'?couponCode='+code+'&format=ajax', 
          (response) => {
           const value = response.baskettotal;
           callback(value);
          });         
      },
      applyBestCode: (bestCode) => {
        location.reload();
      }
    },

    swarovski: {
      id: 3712, 
      preApplyCodes: (callback) => {
        const elTotal = $('.swa-text--summary-total-value:last');
        const prevValue = convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim());
        callback(prevValue);
      },
      applyCode: (code, callback) => {
        const CSRFTokenInfo =JSON.parse(sessionStorage.getItem("CSRFTokenInfo"));
        const csrf = CSRFTokenInfo.token;
        const url = 'https://www.swarovski.com/'+window.location.pathname;
         $.ajax({
              url: url+'voucher/apply/',
              type: 'POST',
              data: {voucherCode: code, CSRFToken:csrf},
              success: (response) => {
                $.get(url, (responseGet) => {
                  const orderValueEl = $(responseGet).find('.swa-text--summary-total-value:last');
                  const value = orderValueEl.length > 0 ? 
                                    convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                    Number.POSITIVE_INFINITY;
                   $.post(url+'voucher/remove/', {voucherCode: code, CSRFToken:csrf},
                    () => {
                      callback(value);
                    }).fail(function() {
                     callback(Number.POSITIVE_INFINITY);
                    }); 
                 }).fail(function() {
                 callback(Number.POSITIVE_INFINITY);
                });  
              },
              error: (xhr, status, error) => {
                 callback(Number.POSITIVE_INFINITY);
              }
            });
      },
      applyBestCode: (bestCode) => {
       const CSRFTokenInfo =JSON.parse(sessionStorage.getItem("CSRFTokenInfo"));
        const csrf = CSRFTokenInfo.token;
        const url = 'https://www.swarovski.com/en-US/cart/';
         $.ajax({
          url: url+'voucher/apply/',
          type: 'POST',
          data: {voucherCode: bestCode, CSRFToken:csrf},
          success: (response) => { location.reload(); },
          error: (response) => { location.reload(); },
        })
      }
    },

   dwr: {
      id: 3827,
      preApplyCodes: function(callback) {
        const elTotal = $('.order-total td:last-child');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
         if(window.location.href.indexOf("cart") > -1){
          const url = $('form[name="dwfrm_cart"]').attr('action');
          const formData = getFormFieldsAsJson(document.querySelector('form[name="dwfrm_cart"]'));
          formData['dwfrm_cart_couponCode'] = code;
          formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
          $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            success: (response, status, xhr) => {
                const elTotal = $(response).find('.order-total td:last-child');
                const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY; 
                callback(value);
            },
            error: (xhr, status, error) => {
              console.log(error);
              callback(Number.POSITIVE_INFINITY);
            }
          });
        }else{
           const windowVariables = retrieveWindowVariables(["window.Urls"]);
           const addCouponUrl = windowVariables["window.Urls"].addCoupon;
           $.get(addCouponUrl+'?couponCode='+code+'&format=ajax', (response) => {             
                const value = response.baskettotal;
                callback(value);
            });
        }
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#dwfrm_cart_couponCode, #dwfrm_billing_couponCode').value = bestCode;
        document.querySelector('#dwfrm_cart_couponCode, #dwfrm_billing_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('#add-coupon, #apply-coupon').click();
      }
    },

  bodybuilding: {
    id: 160,
    preApplyCodes: function(callback) {
      const elTotal = $('#ShoppingCartTopBanner .order-total.order-total--highlight .order-total__price');
      const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      const url = $('form#cartForm').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('form#cartForm'));       
      formData['promoCode'] = code;
      $.ajax({
        url: 'https://www.bodybuilding.com'+url,
        type: 'POST',
        data: formData,
        success: (data, textStatus, request) => {
            const locationUrl = request.getResponseHeader('location');
            $.get(locationUrl, 
              (response) => {
                const elTotal = $(response).find('#ShoppingCartTopBanner .order-total.order-total--highlight .order-total__price');
                const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
                callback(value);
              });            
          },
          error: (xhr, status, error) => {
            callback(Number.POSITIVE_INFINITY);
          }
        });
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#promoCode').value = bestCode;
      document.querySelector('#promoCode').dispatchEvent(new MouseEvent('input', {bubbles: true}));
      document.querySelector('.claim-coupon-btn').click();
    }
  },

  airportparkingreservations: {
    id: 4137,
    preApplyCodes: function(callback) {
      const elTotal = $('div:contains("Total")+div');
      const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
     const windowVariables = retrieveWindowVariables(["apr.add_coupon_link","window.Laravel"]);
     const url = windowVariables["apr.add_coupon_link"];
     const csrfToken = windowVariables["window.Laravel"].csrfToken;
      $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify({code:code,coupon:code}),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'x-csrf-token': csrfToken
            },
        success: (response) => {
           if(window.location.href.indexOf("psf_checkout") > -1){
            if(response.data){
              const value = (response.data.pricing.total).toFixed(2);
              callback(value);  
            }else{
              callback(Number.POSITIVE_INFINITY);
            }              
           }else{
             const value = (response.pricing.total).toFixed(2);
             callback(value);
           }                        
          },
          error: (xhr, status, error) => {
            callback(Number.POSITIVE_INFINITY);
          }
        });
    },
    applyBestCode: function(bestCode) {
       const windowVariables = retrieveWindowVariables(["apr.add_coupon_link","window.Laravel"]);
       const url = windowVariables["apr.add_coupon_link"];
       const csrfToken = windowVariables["window.Laravel"].csrfToken;
        $.ajax({
          url:  url,
          type: 'POST',
          data: JSON.stringify({code:bestCode,coupon:bestCode}),
          headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              'x-csrf-token': csrfToken
              },
          success: () => { location.reload(); },
          error: () => { location.reload(); }
        });
     }
  },

  modcloth: {
    id: 1182,
    preApplyCodes: function(callback) {
      const elTotal = $('.order-value, tfoot .orderCost');
      const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      const addCouponUrl = 'https://www.modcloth.com/on/demandware.store/Sites-modcloth-Site/default/CheckoutCart-AddCoupon';
      const removeCouponUrl = 'https://www.modcloth.com/on/demandware.store/Sites-modcloth-Site/default/CheckoutCart-RemoveCoupon';
      $.ajax({
        url: addCouponUrl,
        type: 'POST',
        data: JSON.stringify({CouponCode:code}),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        success: (response) => {
            const data = JSON.parse(response);
            const value = data.adjustedMerchandizeCost;
            if(data.status == 'APPLIED'){
                $.ajax({
                url: removeCouponUrl,
                type: 'POST',
                data: JSON.stringify({CouponCode:code}),
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    },
                 success: () => { callback(value); },
                 error: () => { callback(value); }
              });
            }else{
              callback(Number.POSITIVE_INFINITY);
            }                     
          },
          error: (xhr, status, error) => {
            callback(Number.POSITIVE_INFINITY);
          }
      });
    },
    applyBestCode: function(bestCode) {
      const addCouponUrl = 'https://www.modcloth.com/on/demandware.store/Sites-modcloth-Site/default/CheckoutCart-AddCoupon';
      $.ajax({
        url: addCouponUrl,
        type: 'POST',
        data: JSON.stringify({CouponCode:bestCode}),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        success: () => { location.reload(); },
        error: () => { location.reload(); }
      });
    }
  },

  pensketruckrental: {
      id: 17758,
      preApplyCodes: (callback) => {
        const elTotal = $(".price.total");
        const value   = elTotal.length > 0 ? 
                         convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) :
                         Number.POSITIVE_INFINITY;
        callback(value);
      },
      applyCode: (code, callback) => {
        var ts1 = Math.round(new Date().getTime());
        const window_name =  sessionStorage.getItem("window_name");
        const business = sessionStorage.getItem("Personal");
        var businessType,rentalType;
        if(business && business == 'TRUE'){
          businessType = 'personal';
        }else{
          businessType = 'commercial';
        }
        const rental = document.querySelector('truck').getAttribute('ng-reflect-is-round-trip');
        if(rental == 'true'){
          rentalType = 'local';
        }else{
          rentalType = 'oneway';
        }
        $.ajax({
          url: 'https://www.pensketruckrental.com/erental2/api/shoppingcart/add-promo?cache='+ts1+'&window_name='+window_name,
          type: 'POST',
          data: JSON.stringify({promoCode: code, businessType:businessType, country:"US", rentalType:rentalType}),
          headers: {
            'Content-Type': 'application/json',
          },
          success: (response) => {
            if(response.data.cartTotal){
              const value = response.data.cartTotal;
              var ts2 = Math.round(new Date().getTime());
             $.ajax({
                url: 'https://www.pensketruckrental.com/erental2/api/shoppingcart/remove-promo?cache='+ts2+'&window_name='+window_name,
                type: 'POST',
                data: JSON.stringify({promoCode: code, businessType:businessType, country:"US", rentalType:rentalType}),
                headers: {
                  'Content-Type': 'application/json',
                },
                success: () => { callback(value); },
                error: () => { callback(value);  }
              })
            }else{
              callback(Number.POSITIVE_INFINITY);
            }            
          },
          error: (xhr, status, error) => {
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
        var ts1 = Math.round(new Date().getTime());
        const window_name =  sessionStorage.getItem("window_name");
        const business = sessionStorage.getItem("Personal");
        var businessType,rentalType;
        if(business && business == 'TRUE'){
          businessType = 'personal';
        }else{
          businessType = 'commercial';
        }
        const rental = document.querySelector('truck').getAttribute('ng-reflect-is-round-trip');
        if(rental == 'true'){
          rentalType = 'local';
        }else{
          rentalType = 'oneway';
        }
        $.ajax({
          url: 'https://www.pensketruckrental.com/erental2/api/shoppingcart/add-promo?cache='+ts1+'&window_name='+window_name,
          type: 'POST',
          data: JSON.stringify({promoCode: bestCode, businessType:businessType, country:"US", rentalType:rentalType}),
          headers: {
            'Content-Type': 'application/json',
          },
          success: (response) => { location.reload(); },
          error: (xhr, status, error) => {location.reload(); }
        });
      }
    },

  madewell: {
      id: 7579,
      preApplyCodes: (callback) => {
        const orderValueEl = $('.order-total .order-value');
        const prevValue = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {
      if(window.location.href.indexOf("cart") > -1){ 
        const url = $('#cart-items-form').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
        formData['dwfrm_cart_couponCode'] = code;
        formData['dwfrm_cart_updateCart'] = 'dwfrm_cart_updateCart';
        formData['dwfrm_cart_addCoupon'] = 'true';
        $.post(url, formData, 
          (response) => {
            $.get('https://'+window.location.hostname+window.location.pathname, 
              (responseGet) => {
                const orderValueEl = $(responseGet).find('.order-total .order-value');
                const value = orderValueEl.length > 0 ? 
                                  convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                  Number.POSITIVE_INFINITY;
                callback(value);
              });            
          });
      }else{
        const windowVariables = retrieveWindowVariables(["window.Urls"]);
        const addCouponUrl = windowVariables["window.Urls"].addCoupon;
          $.get(addCouponUrl+'?couponCode='+code+'&format=ajax', 
              (response) => { 
                $.get('https://'+window.location.hostname+window.location.pathname, 
                  (responseGet) => {
                    const orderValueEl = $(responseGet).find('.order-total .order-value');
                    const value = orderValueEl.length > 0 ? 
                                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                      Number.POSITIVE_INFINITY;
                    callback(value);
                  });        
              }); 
          }
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#dwfrm_cart_couponCode, #dwfrm_billing_couponCode').value = bestCode;
        document.querySelector('#dwfrm_cart_couponCode, #dwfrm_billing_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('#add-coupon').click();
      }
    },

  nautica: {
     id: 3970,
      preApplyCodes: function(callback) {
        const elTotal = $('.bfx-total-grandtotal');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;     
        const url = $('form[name="dwfrm_cart"]').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('form[name="dwfrm_cart"]'));
        formData['dwfrm_cart_coupons_i0_deleteCoupon'] = 'Remove';
        $.post(url, formData, 
          (response) => {
             callback(prevValue);
        });
      },
      applyCode: function(code, callback) {  
        this.preApplyCodes(() => {
          const url = $('form[name="dwfrm_cart"]').attr('action');
          const formData = getFormFieldsAsJson(document.querySelector('form[name="dwfrm_cart"]'));
          formData['dwfrm_cart_couponCode'] = code;
          formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
            $.post(url, formData, 
            (responsePost) => {               
              const orderValueEl = $(responsePost).find('.bfx-total-grandtotal');
              const value = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;  
              callback(value); 
            }); 
        });        
      },
      applyBestCode: (bestCode) => {
        document.querySelector('[name="dwfrm_cart_couponCode"]').value = bestCode;
        document.querySelector('[name="dwfrm_cart_couponCode"]').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('#add-coupon').click();
      }
    },

    jackrabbit: {
      id: 26640, 
      preApplyCodes: function(callback) {
         const elTotal = $('div[data-totals-component="grandTotal"] dd');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {        
        const csrf_token = $('input[name="csrf_token"]').val();
        const windowVariables = retrieveWindowVariables(["window.SFRA.Urls"]);
        const digitalbasketurl = windowVariables["window.SFRA.Urls"].dotdigitalBasket;
        const url = $('.promo-code-form ').attr('data-action-url');
         $.get('https://www.jackrabbit.com'+url+'?csrf_token='+csrf_token+'&couponCode='+code, 
          (response) => {
            if(response.dotdigitalCartData){
              const value = response.dotdigitalCartData.grandTotal;
              callback(value);
            }else{
              callback(Number.POSITIVE_INFINITY);
            }
          });
      },
      applyBestCode: (bestCode) => {
        location.reload();
      }
    },


  kiehls: {
    removePrevCode: function(code, callback) {
      var formData = {};
      formData['coupon_remove_'+code] = code
      const url = $('.c-form.m-reset.c-cart-coupon__form').attr('action');
      $.ajax({
        url: url+'?ajax=true',
        type: 'POST',
        data: formData,
        success: () => { callback(); },
        error: () => { callback(); }
      });   
    },
    preApplyCodes: function(callback) { 
      const elTotal = document.querySelector('.c-cart-summary-table .m-total .m-value').innerText;
      const prevValue = convertNumbers(elTotal.replace(/[^0-9.,]/g, '').trim());
      const prevCodeSelector = document.querySelector('.c-cart-coupon__list-remove');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.value;
        const prevCodeName = prevCodeSelector.getAttribute('name');
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
      this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => { 
      const url = $('.c-form.m-reset.c-cart-coupon__form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('.c-form.m-reset.c-cart-coupon__form'));
      formData['couponcode'] = code;
      $.ajax({
        url: url+'?ajax=true',
        type: 'POST',
        data: formData,
        success: (responsePost) => { 
          const orderValueEl = $(responsePost).find('.c-cart-summary-table .m-total .m-value');
          const value = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY; 
          callback(value);
        },error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

    lovelyskin: {
      id: 1114, 
      preApplyCodes: function(callback) {
        const elTotal = $('.row.margin-bottom :last-child strong, #order-summary tbody tr:last-child td:last-child');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        const prevCode = $("a.modalTrigger .underline, #promo-code-form a.lsu-c-promo.lsu-td-u[data-toggle='modal'][data-log-id='SpecialOfferDetails:PromoCode:Summary']").text();
        callback(prevValue,prevCode);
      },
      applyCode: function(code, callback) {
         var url,formData,getUrl,ts,data;
         if(window.location.href.indexOf("cart") > -1){ 
            url = 'https://www.lovelyskin.com/cart/applypromocode';
            getUrl = 'https://www.lovelyskin.com/cart';
            formData = getFormFieldsAsJson(document.querySelector('form#form0'));
            formData['Value'] = code;
         }else{
            ts = Math.round(new Date().getTime());
            url = 'https://www.lovelyskin.com/securecheckout/promocode/add';
            getUrl = 'https://www.lovelyskin.com/securecheckout/payment/layout?_='+ts;
            formData = getFormFieldsAsJson(document.querySelector('#promo-code-form form'));
            formData['PromoCode'] = code;
            formData['promoCodeToggle'] = 'true'; 
         }
         $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            success: (response) => {
             $.get(getUrl, 
               (responseGet) => { 
                  if(window.location.href.indexOf("cart") > -1){ 
                    data = responseGet;
                  }else{
                    data = responseGet.layout.html;
                  }
                  const elTotal = $(data).find('.row.margin-bottom :last-child strong, #order-summary tbody tr:last-child td:last-child');
                  const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
                  callback(value);    
               });
            },
            error: (xhr, status, error) => {
               callback(Number.POSITIVE_INFINITY);
            }
          }); 
      },
      applyBestCode: (bestCode) => {
        var url,formData;
         if(window.location.href.indexOf("cart") > -1){ 
            url = 'https://www.lovelyskin.com/cart/applypromocode';
            formData = getFormFieldsAsJson(document.querySelector('form#form0'));
            formData['Value'] = bestCode;
         }else{
            url = 'https://www.lovelyskin.com/securecheckout/promocode/add';
            formData = getFormFieldsAsJson(document.querySelector('#promo-code-form form'));
            formData['PromoCode'] = bestCode;
            formData['promoCodeToggle'] = 'true';  
         } 
            $.ajax({
              url: url,
              type: 'POST',
              data: formData,
              success: () => { location.reload(); },
              error: () => { location.reload(); }
            });
      }
    },

  tjx: {
      id: 9798,
      preApplyCodes: function(callback) {
        const elTotal = $('span.order-total-price, #totalPrice');
        const prevValue = elTotal.length > 0 ? 
                        convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const formData = getFormFieldsAsJson(document.querySelector('form[name="promoForm"]'));       
        formData['/atg/commerce/promotion/CouponFormHandler.couponClaimCode'] = code;
        formData['/atg/commerce/promotion/CouponFormHandler.claimCoupon'] = 'APPLY';
        $.ajax({
          url: 'https://tjmaxx.tjx.com/store/checkout/cart.jsp?_DARGS=/store/checkout/views/cart.jsp.promo',
          type: 'POST',
          data: formData,
          success: (data, textStatus, request) => {
             const locationUrl = request.getResponseHeader('Location');
              $.ajax({
                  url: locationUrl,
                  type: 'GET',
                  success: (response) => {
                          const elTotal = $(response).find('span.order-total-price, #totalPrice');
                          const value = elTotal.length > 0 ? 
                                        convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                                        Number.POSITIVE_INFINITY;
                          callback(value);
                  }, error: (xhr, status, error) => {
                  callback(Number.POSITIVE_INFINITY);
                 }
                })           
            },
           error: (xhr, status, error) => {
            callback(Number.POSITIVE_INFINITY);
           }
          });
      },
      applyBestCode: function(bestCode) {
        document.querySelector('#promo-code').value = bestCode;
        document.querySelector('#promo-code').dispatchEvent(new MouseEvent('input', {bubbles: true}));
        document.querySelector('#accept-promotion').click();
      }
    },

    paulfredrick: {
      id: 3072,
      preApplyCodes: (callback) => {
        const orderValueEl = $('.order-total span:last-child, .column-inner .order-summary div .span-total');
        console.log(orderValueEl);
        const prevValue = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) :
                          Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {
        const url = 'https://www.paulfredrick.com/checkout/cart.aspx?mn=expandablebag';
        const formData = getFormFieldsAsJson(document.querySelector('#form1'));
        formData['ctl00$MainContent$PromoCodes$PromoCodeTextBox'] = code;
        formData['ctl00$MainContent$PromoCodes$ApplyPromoButton.x'] = '0';
        formData['ctl00$MainContent$PromoCodes$ApplyPromoButton.y'] = '0';
        formData['ctl00$MainContent$PromoCodes$PromoCodeTextBox_edit'] = code;
        formData['ctl00$MainContent$PromoCodes$CouponReset.x'] = '0';
        formData['ctl00$MainContent$PromoCodes$CouponReset.y'] = '0';
         $.ajax({
          url: url,
          type: 'POST',
          data: formData,
          success: (data, textStatus, request) => {
            const locationUrl = request.getResponseHeader('location');
            $.get(locationUrl, 
            (response) => {
              const orderValueEl = $(response).find('.order-total span:last-child, .column-inner .order-summary div .span-total');
              const value = orderValueEl.length > 0 ? 
                                convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                Number.POSITIVE_INFINITY;
              callback(value);
            }) 
          },
           error: (xhr, status, error) => {
            callback(Number.POSITIVE_INFINITY);
           }
        })
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#ctl00_MainContent_PromoCodes_PromoCodeTextBox, #PromoCodeTextBox_edit, #txtPromoCode').value = bestCode;
        document.querySelector('#ctl00_MainContent_PromoCodes_PromoCodeTextBox, #PromoCodeTextBox_edit, #txtPromoCode').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('#ApplyPromoButton, .btn-promo-apply, #btnApplyPromo').click();
      }
    },

    casper: {
      id: 22995, 
      preApplyCodes: function(callback) {
        const elTotal = $('#order-summary [data-summary-item="total"] span:last-child');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
         var ts = Math.round(new Date().getTime());
         $.get('https://casper.com/japi/order?include=&ts='+ts, 
          (response) => {
            const orderId = response.data.attributes.number;
            const removeurl = 'https://casper.com/japi/order/remove_promos?include=&order='+orderId;
             $.post(removeurl, 
              () => {               
                   callback(prevValue); 
              }); 
          });        
      },
      applyCode: function(code, callback) {
        var ts = Math.round(new Date().getTime());
         $.get('https://casper.com/japi/order?include=&ts='+ts, 
          (response) => {
            const orderId = response.data.attributes.number;
            const applyurl = 'https://casper.com/japi/order/apply_promo?include=&order='+orderId+'&coupon_code='+code;
            const removeurl = 'https://casper.com/japi/order/remove_promos?include=&order='+orderId;
             $.post(applyurl, 
              (responsePost) => {               
                    const value = responsePost.included['1'].attributes.order;
                    $.post(removeurl, () => {  callback(value);  }); 
              }); 
          });
      },
      applyBestCode: (bestCode) => {
         var ts = Math.round(new Date().getTime());
         $.get('https://casper.com/japi/order?include=&ts='+ts, 
          (response) => {
            const orderId = response.data.attributes.number;
            const applyurl = 'https://casper.com/japi/order/apply_promo?include=&order='+orderId+'&coupon_code='+bestCode;
              $.post(applyurl, 
              () => {               
                    location.reload(); 
              }); 
          });
      }
    },

    mintmobile: {
      id: 34839,
      preApplyCodes: function(callback) {
        var prevValue;
        const elTotal = $('.total + .total-value .currency, #opc_totals .total-value.nowrap .currency');
        prevValue = elTotal.length > 0 ? 
                convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                Number.POSITIVE_INFINITY;
        if(window.location.href.indexOf("checkout") > -1 && window.location.href.indexOf("phones") > -1){
          callback(prevValue);
        }else if(window.location.href.indexOf("cart.php") > -1 && window.location.href.indexOf("phones") > -1){
          callback(prevValue);
        }else{
          prevValue = $('[name="wc_braintree_paypal_amount"]').val();
          callback(prevValue);
        }
      },
      applyCode: function(code, callback) {
        var url,formData,getUrl,method,getformData,ts,mainMethod,priceSelector,cal_type,elTotal,value;
        ts = Math.round(new Date().getTime());
        if(window.location.href.indexOf("checkout") > -1 && window.location.href.indexOf("phones") > -1){
          url = 'https://phones.mintmobile.com/cart.php';
          formData = {coupon:code, mode:'add_coupon'};
          getUrl = 'https://phones.mintmobile.com/get_block.php?block=opc_totals';
          priceSelector = '.total + .total-value .currency, .total-value.nowrap .currency'
          getformData = {t:ts};
          mainMethod = 'POST';
          method = 'GET';
          cal_type = '1';
        }else if(window.location.href.indexOf("cart.php") > -1 && window.location.href.indexOf("phones") > -1){
          url = 'https://phones.mintmobile.com/cart.php';
          formData = getFormFieldsAsJson(document.querySelector('[name="couponform"]'));
          formData['coupon'] = code;
          formData['mode'] = 'add_coupon';
          getUrl = 'https://phones.mintmobile.com/cart.php';
          priceSelector = '.total + .total-value .currency, #opc_totals .total-value.nowrap .currency'
          method = 'GET';
          mainMethod = 'GET';
          cal_type = '1';
        }else{
          url = 'https://www.mintmobile.com/cart/';
          formData = getFormFieldsAsJson(document.querySelector('form.Order-form'));
          formData['coupon_code'] = code;
          formData['apply_coupon'] = 'Apply coupon';
          getUrl = 'https://www.mintmobile.com/cart/';
          priceSelector = '[name="wc_braintree_paypal_amount"]';
          method = 'GET';
          mainMethod = 'POST';
          cal_type = '2';
        }
        $.ajax({
          url: url,
          type: mainMethod,
          data: formData,
          success: () => {
             $.ajax({
                url: getUrl,
                type: method,
                data: getformData,
                success: (responseGet) => {
                  if(cal_type == '2'){
                    value = $(responseGet).find(priceSelector).val();
                    callback(value);
                  }else{
                    elTotal = $(responseGet).find(priceSelector);
                    value = elTotal.length > 0 ? 
                            convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                            Number.POSITIVE_INFINITY;
                    callback(value);
                  }
                }
              });
          },
          error: () => { callback(Number.POSITIVE_INFINITY); }
        });
      },
      applyBestCode: (bestCode) => {
       location.reload();
      }
    },

  rockler: {
    id: 2550, 
    preApplyCodes: function(callback) {  
      const elTotal = $('tr.grand.totals span.price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;        

      if(window.location.href.indexOf("cart") > -1){
        const url = $('#discount-coupon-form').attr('action');
        $.post(url, {  remove: 1  }, 
          (response) => {
           callback(prevValue);
          });
       }else{
         const windowVariables = retrieveWindowVariables(["window.checkoutConfig","window.NREUM"]);
         const quoteId = windowVariables["window.checkoutConfig"].quoteId;
         const xpid = windowVariables["window.NREUM"].loader_config.xpid;
         $.ajax({
            url: 'https://www.rockler.com/rest/default/V1/guest-carts/'+quoteId+'/coupons',
            type: 'DELETE',
            headers: {
            'x-newrelic-id': xpid
            },
            success: () => { callback(prevValue); },
            error: () => { callback(prevValue); }
        });
      }
    },
    applyCode: function(code, callback) {
     this.preApplyCodes(() => {
      if(window.location.href.indexOf("cart") > -1){
        const url = $('#discount-coupon-form').attr('action');
        $.ajax({
          url: url,
          type: 'POST',
          data: {
            remove: 0,
            coupon_code: code
          },
          success:  (data, textStatus, request1) => {                
           const locationUrl = request1.getResponseHeader('location');
            $.get(locationUrl, (responseGet) => {
              const checkoutconfigindex = responseGet.indexOf("window.checkoutConfig");
              const customerDataindex = responseGet.indexOf("window.customerData");
              const finalIndex = customerDataindex-checkoutconfigindex;
              const data = JSON.parse(responseGet.substr(responseGet.indexOf("window.checkoutConfig")+23, finalIndex-37));
              const value = data.totalsData.base_grand_total;
              callback(value);             
            });
          },error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
        });
      }else{
       const windowVariables = retrieveWindowVariables(["window.checkoutConfig","window.NREUM"]);
       const quoteId = windowVariables["window.checkoutConfig"].quoteId;
       const xpid = windowVariables["window.NREUM"].loader_config.xpid;
       $.ajax({
        url: 'https://www.rockler.com/rest/default/V1/guest-carts/'+quoteId+'/coupons/'+code,
        type: 'PUT',
        headers: {
        'x-newrelic-id': xpid
        },
        success: (data) => {
          const ts = Math.round(new Date().getTime());
              $.ajax({
                url: 'https://www.rockler.com/rest/default/V1/guest-carts/'+quoteId+'/payment-information?_='+ts,
                type: 'GET',
                headers: {
                'x-newrelic-id': xpid
                },
                success: (response) => {
                  const value = response.totals.base_grand_total;
                  callback(value.toFixed(2));
                }
              });
            },
            error: (xhr, status, error) => {
              console.log(error);
              callback(Number.POSITIVE_INFINITY);
            }
          })
       }
     });
    },
    applyBestCode: (bestCode) => {
     if(window.location.href.indexOf("cart") > -1){
       const url = $('#discount-coupon-form').attr('action');
       $.post(url, { remove: 0, coupon_code: bestCode }, 
        (response) => {
          location.reload();
        });
     }else{
       const windowVariables = retrieveWindowVariables(["window.checkoutConfig","window.NREUM"]);
       const quoteId = windowVariables["window.checkoutConfig"].quoteId;
       const xpid = windowVariables["window.NREUM"].loader_config.xpid;
       $.ajax({
            url: 'https://www.rockler.com/rest/default/V1/guest-carts/'+quoteId+'/coupons/'+bestCode,
            type: 'PUT',
            headers: {
            'x-newrelic-id': xpid
            },
            success: (data) => {location.reload();}
        });     
      }  
    }
  },

    riteaid: {
      id: 7355, 
      preApplyCodes: function(callback) {  
        const elTotal = $('tr.grand.totals span.price');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY; 
        if(window.location.href.indexOf("cart") > -1){
          const url = $('#discount-coupon-form').attr('action');
          const form_key = $('input[name="form_key"]').val();
          $.post(url, {  remove: 1,form_key:form_key  }, 
            (response) => {
             callback(prevValue);
            });
         }else{
           const windowVariables = retrieveWindowVariables(["window.checkoutConfig","window.NREUM"]);
           const quoteId = windowVariables["window.checkoutConfig"].quoteId;
           const xpid = windowVariables["window.NREUM"].loader_config.xpid;
           $.ajax({
              url: 'https://www.riteaid.com/shop/rest/default/V1/guest-carts/'+quoteId+'/coupons',
              type: 'DELETE',
              headers: {
              'x-newrelic-id': xpid
              },
              success: () => { callback(prevValue); },
              error: () => { callback(prevValue); }
          });
        }
      },
      applyCode: function(code, callback) {
       this.preApplyCodes(() => {
        if(window.location.href.indexOf("cart") > -1){
          const url = $('#discount-coupon-form').attr('action');
          const form_key = $('input[name="form_key"]').val();
          $.ajax({
            url: url,
            type: 'POST',
            data: {
              remove: 0,
              coupon_code: code,
              form_key:form_key
            },
            success:  (data, textStatus, request1) => {                
             const locationUrl = request1.getResponseHeader('location');
              $.get(locationUrl, (responseGet) => {
                const checkoutconfigindex = responseGet.indexOf("window.checkoutConfig");
                const customerDataindex = responseGet.indexOf("window.customerData");
                const finalIndex = customerDataindex-checkoutconfigindex;
                const data = JSON.parse(responseGet.substr(responseGet.indexOf("window.checkoutConfig")+23, finalIndex-37));
                const value = data.totalsData.base_grand_total;
                 callback(value);             
              });
            },error: (xhr, status, error) => {
               callback(Number.POSITIVE_INFINITY);
            }
          });
        }else{
         const windowVariables = retrieveWindowVariables(["window.checkoutConfig","window.NREUM"]);
         const quoteId = windowVariables["window.checkoutConfig"].quoteId;
         const xpid = windowVariables["window.NREUM"].loader_config.xpid;
         $.ajax({
          url: 'https://www.riteaid.com/shop/rest/default/V1/guest-carts/'+quoteId+'/coupons/'+code,
          type: 'PUT',
          headers: {
          'x-newrelic-id': xpid
          },
          success: (data) => {
            const ts = Math.round(new Date().getTime());
                $.ajax({
                  url: 'https://www.riteaid.com/shop/rest/default/V1/guest-carts/'+quoteId+'/payment-information?_='+ts,
                  type: 'GET',
                  headers: {
                  'x-newrelic-id': xpid
                  },
                  success: (response) => {
                    const value = response.totals.base_grand_total;
                    callback(value.toFixed(2));
                  }
                });
              },
              error: (xhr, status, error) => {
                callback(Number.POSITIVE_INFINITY);
              }
            })
         }
       });
      },
      applyBestCode: (bestCode) => {
       if(window.location.href.indexOf("cart") > -1){
         const url = $('#discount-coupon-form').attr('action');
         const form_key = $('input[name="form_key"]').val();
         $.post(url, { remove: 0, coupon_code: bestCode,form_key:form_key }, 
          (response) => {
            location.reload();
          });
       }else{
         const windowVariables = retrieveWindowVariables(["window.checkoutConfig","window.NREUM"]);
         const quoteId = windowVariables["window.checkoutConfig"].quoteId;
         const xpid = windowVariables["window.NREUM"].loader_config.xpid;
         $.ajax({
              url: 'https://www.riteaid.com/shop/rest/default/V1/guest-carts/'+quoteId+'/coupons/'+bestCode,
              type: 'PUT',
              headers: {
              'x-newrelic-id': xpid
              },
              success: (data) => {location.reload();}
          });     
        }  
      }
    },

  dealgenius: {
      id: 6394,
      preApplyCodes: function(callback) {
        const elTotal = $('#cart-totals .amount[data-th="Total"] .price, .grand.totals .amount .price, strong .price');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        if(window.location.href.indexOf("cart") > -1){
            const url = $('#discount-coupon-form').attr('action');
            const form_key = $('input[name="form_key"]').val();
            $.post(url, { remove: 1,form_key: form_key }, 
            (response) => {
                 callback(prevValue);
            });
        }else{
           const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
           const quoteId = windowVariables["window.checkoutConfig"].quoteId;
           $.ajax({
            url: 'https://www.dealgenius.com/rest/default/V1/guest-carts/'+quoteId+'/coupons',
            type: 'DELETE',
            success: () => { callback(prevValue); },
            error: () => { callback(prevValue); }
          });
        }
      },
      applyCode: function(code, callback) {
        this.preApplyCodes(() => {
        if(window.location.href.indexOf("cart") > -1){
          const url = $('#discount-coupon-form').attr('action');
          const form_key = $('input[name="form_key"]').val();
          $.ajax({
            url: url,
            type: 'POST',
            data: {
              remove: 0,
              form_key: form_key,
              coupon_code: code
            },
            success: () => {
              $.get('https://www.dealgenius.com'+window.location.pathname, (responseGet) => {
                const checkoutconfigindex = responseGet.indexOf("window.checkoutConfig");
                const customerDataindex = responseGet.indexOf("window.customerData");
                const finalIndex = customerDataindex-checkoutconfigindex;
                const data = JSON.parse(responseGet.substr(responseGet.indexOf("window.checkoutConfig")+23, finalIndex-37));
                const value = data.totalsData.base_grand_total;
                callback(value);
              });
            },error: (xhr, status, error) => {
               callback(Number.POSITIVE_INFINITY);
            }
          });
        }else{
          const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
           const quoteId = windowVariables["window.checkoutConfig"].quoteId;
           $.ajax({
                url: 'https://www.dealgenius.com/rest/default/V1/guest-carts/'+quoteId+'/coupons/'+code,
                type: 'PUT',
                success: (data) => {
                  const ts = Math.round(new Date().getTime());
                      $.ajax({
                          url: 'https://www.dealgenius.com/rest/default/V1/guest-carts/'+quoteId+'/payment-information?_='+ts,
                          type: 'GET',
                          success: (response) => {                  
                             const value = response.totals.base_grand_total;
                             callback(value.toFixed(2));                             
                          }
                        });
                },error: (xhr, status, error) => {
                  console.log(error);
                  callback(Number.POSITIVE_INFINITY);
                }
              });
        }
       });
      },
      applyBestCode: (bestCode) => {
        if(window.location.href.indexOf("cart") > -1){
          const url = $('#discount-coupon-form').attr('action');
          const form_key = $('input[name="form_key"]').val();
          $.post(url, { remove: 0, coupon_code: bestCode,form_key: form_key }, 
            (response) => {
              location.reload();
            });
         }else{
           const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
           const quoteId = windowVariables["window.checkoutConfig"].quoteId;
           $.ajax({
                url: 'https://www.dealgenius.com/rest/default/V1/guest-carts/'+quoteId+'/coupons/'+bestCode,
                type: 'PUT',
                success: () => {location.reload();}
              });
        }
      }
    },

    tracfone: {
      id: 242, 
      preApplyCodes: function(callback) {
        const elTotal = $('.subtotal_desktop > li:last-child > div:last-child');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const form = document.querySelector('#PromotionCodeForm_desktop');
        const formData = getFormFieldsAsJson(form);
        formData['promoCode'] = code;
        formData['requesttype'] = 'ajax';
        $.ajax({
          url: 'https://shop.tracfone.com/webapp/wcs/stores/servlet/AjaxPromotionCodeManage',
          type: 'POST',
          data: formData,
          success: (response, status, xhr) => {
            $.ajax({
              url: 'https://shop.tracfone.com/webapp/wcs/stores/servlet/AjaxOrderChangeServiceItemUpdate',
              type: 'POST',
              data: {
                orderId: '.',
                calculationUsage: '-1,-3,-4',
                requesttype: 'ajax'
              },
              success: (response, status, xhr) => {
                const url = `https://shop.tracfone.com/shop/ShopCartDisplayView?` + 
                  `catalogId=${formData['catalogId']}&langId=${formData['langId']}&storeId=${formData['storeId']}`
                $.ajax({
                  url: url,
                  type: 'POST',
                  data: {
                    objectId: '',
                    requesttype: 'ajax',
                    from_section: 'promocode'
                  },
                  success: (response, status, xhr) => {
                    const elTotal = $(response).find('.js-totalplanprice');
                    const value = elTotal.length > 0 ? 
                                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                  Number.POSITIVE_INFINITY;
                    const formData2 = formData;
                    formData2['taskType'] = 'R';
                      $.ajax({
                        url: 'https://shop.tracfone.com/webapp/wcs/stores/servlet/AjaxPromotionCodeManage',
                        type: 'POST',
                        data: formData2,
                        success: () => { callback(value.toFixed(2)); },
                        error: () => { callback(value.toFixed(2)); }
                      });                    
                  },
                  error: (xhr, status, error) => {
                    callback(Number.POSITIVE_INFINITY);
                  }
                });
              },
              error: (xhr, status, error) => {
                callback(Number.POSITIVE_INFINITY);
              }
            });
          },
          error: (xhr, status, error) => {
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
       document.querySelector('#cartOrderTotals_Div #expandPromoCode').click();
        setTimeout(function(){
          const coupon = document.querySelector('#PromotionCodeForm_desktop [name="promoCode"]');
          coupon.value = bestCode;
          coupon.dispatchEvent(new Event('input', { bubbles: true } ));          
          coupon.dispatchEvent(new Event('keyup'));
          coupon.dispatchEvent(new Event('blur'));
          coupon.dispatchEvent(new Event('focus'));
          document.querySelector('#WC_PromotionCodeDisplay_div_3_desktop').click();
        }, 500);
        
      }
    },

   joesnewbalanceoutlet: {
      id: 1030, 
      preApplyCodes: function(callback) {
        const elTotal = $('#OrderTotal');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
       $.ajax({
          url: 'https://www.joesnewbalanceoutlet.com/cart/removeDiscountCode',
          type: 'POST',
           success: () => { callback(prevValue); },
            error: () => { callback(prevValue); }
         })        
      },
      applyCode: function(code, callback) { 
       this.preApplyCodes(() => { 
        const orderId = $('[name="OrderNumber"]').val();
        const verificationToken = $('[name="__RequestVerificationToken"]').val();
         $.ajax({
            url: 'https://www.joesnewbalanceoutlet.com/cart/applyDiscountCode',
            type: 'POST',
            data: JSON.stringify({CustomerDiscountCode: code, OrderNumber: orderId}),
             headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    '__RequestVerificationToken' : verificationToken
                    },
            success: (response) => {
              $.get('https://www.joesnewbalanceoutlet.com/'+window.location.pathname, 
               (responseGet) => {
                  const elTotal = $(responseGet).find('#OrderTotal');
                  const value = elTotal.length > 0 ? 
                                convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                Number.POSITIVE_INFINITY;
                  callback(value);
              });              
            },
            error: (xhr, status, error) => {
              callback(Number.POSITIVE_INFINITY);
            }
          })
        })
      },
      applyBestCode: (bestCode) => {
        const orderId = $('[name="OrderNumber"]').val();
        const verificationToken = $('[name="__RequestVerificationToken"]').val();
         $.ajax({
          url: 'https://www.joesnewbalanceoutlet.com/cart/applyDiscountCode',
          type: 'POST',
          data: JSON.stringify({CustomerDiscountCode: bestCode, OrderNumber: orderId}),
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            '__RequestVerificationToken' : verificationToken
          },
          success: () => { location.reload(); },
          error: () => { location.reload(); }
        })
      }
    },

   cheaptickets: {
      id: 3803, 
      preApplyCodes: function(callback) {
        const elTotal = $('.summary-total.amount-value, .prod-total, .trip-total [data-price-update="total"], #creditcard-expanded-payment-cart-container .cart-total.order-grand-total-value, #cart-breakdown .cart-total.order-grand-total-value.cart-highlight[data-total-name="cart-price-total-value"] span');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);    
      },
      applyCode: function(code, callback) { 
        const tripid = $('body').attr('data-tripid');
        const productType = $('body').attr('data-producttype');
         $.ajax({
            url: 'https://www.cheaptickets.com/Checkout/applyCoupon',
            type: 'POST',
            data: {couponCode: code, tripid: tripid, tlCouponAttach:'1',tlCouponCode:code,productType:productType,binPrefix:''},
            success: (response) => {
                var newdata =response.updatedPriceModel;
                var price;
                Object.values(newdata).forEach(val => {
                 if(val.description == 'affirmTotalInCent'){
                  price = val.value/100;
                 }
                });  
              $.ajax({
                url: 'https://www.cheaptickets.com/Checkout/removeCoupon',
                type: 'POST',
                data: {tripid: tripid, tlCouponRemove:'1',tlCouponCode:code,productType:productType,binPrefix:''},
                success: () => { callback(price); },
                error: () => { callback(price); }
              })        
            },
            error: (xhr, status, error) => {
              callback(Number.POSITIVE_INFINITY);
            }
          })
      },
      applyBestCode: (bestCode) => {
       if(window.location.href.indexOf("MultiItemCheckout") > -1){ 
         document.querySelector('#couponId, #PromoCode').value = bestCode;
         document.querySelector('#couponId, #PromoCode').dispatchEvent(new Event('input', {bubbles: true}));
         document.querySelector('#couponId, #PromoCode').dispatchEvent(new Event('change'));
         document.querySelector('#apply_coupon_button, #add-promo-code-button').click();
       }else{
        const tripid = $('body').attr('data-tripid');
        const productType = $('body').attr('data-producttype');
         $.ajax({
            url: 'https://www.cheaptickets.com/Checkout/applyCoupon',
            type: 'POST',
            data: {couponCode: bestCode, tripid: tripid, tlCouponAttach:'1',tlCouponCode:bestCode,productType:productType,binPrefix:''},
            success: () => { location.reload(); },
            error: () => { location.reload(); }
          })
       }
      }
    },

  designbyhumans: {
      id: 6961,
      preApplyCodes: function(callback) {
        const elTotal = $('#totals-totalPrice .currency-amount');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {   
        const url = 'https://www.designbyhumans.com/a/CartTotals'; 
         var ts = Math.round(new Date().getTime());   
          $.ajax({
            url: url+'?discount_code='+code+'&outputType=AJAX&_'+ts,
            type: 'GET',
            success: (response, status, xhr) => {
              const value = response.totals.totalPrice;
              callback(value);
            },error: (xhr, status, error) => {
              callback(Number.POSITIVE_INFINITY);
            }
          });       
      },
      applyBestCode: (bestCode) => {
        document.querySelector('#promotion_promo_code').value = bestCode;
        document.querySelector('#promotion_promo_code').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('#promotion_promo_code_btn').click();
      }
    },

   zappos: {
      id: 2046, 
      preApplyCodes: function(callback) {
        const elTotal = $('tbody tr:nth-child(5) td:last, div:nth-child(3) div div:contains("Order Total:") + div');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);           
      },
      applyCode: function(code, callback) { 
       this._applyCode(code, function(value) {
          callback(value); 
        }); 
      },
      applyBestCode: function(bestCode) {
        this._applyCode(bestCode, function() {
         location.reload();
        });
      },
      _applyCode: (code, callback) => {
        const purchaseId  = getParam('pid',location.href);
        const ubidMain = getCookie('ubid-main');
        const sessionToken = getCookie('session-token').replace(/"/g, '');
        const sessionId = getCookie('session-id');
        const xMmain = getCookie('x-main').replace(/"/g, '');
          $.ajax({
            url: 'https://amazon.zappos.com/mobileapi/v1/checkout/configure?includeAddresses=false&includeAssociated=true&includePayments=false&includeShipmentOptions=false&src=melody',
            type: 'POST',
            data: JSON.stringify({coupon: code, purchaseId:purchaseId, useDiscount:true, useGCBalance:true}),
            xhrFields: {
                withCredentials: true
            },
            headers: {
              'X-Mafia-Auth-Requested': true,
              'X-Mafia-Client': 'MARTY-DESKTOP-ZAPPOS',
              'X-Mafia-Recognized-Token': xMmain,
              'X-Mafia-Session-Id': sessionId,
              'X-Mafia-Session-Requested': true,
              'X-Mafia-Session-Token': sessionToken,
              'X-Mafia-Ubid-Main': ubidMain,
              'content-type': 'application/json'
            },
            success: (response) => {
               const value = response.purchaseStatus.chargeSummary.total;
               callback(value);
            },
            error: () => {  callback(Number.POSITIVE_INFINITY); }
        });
      }
    },

    hydroflask: {
      id: 29432,
      preApplyCodes: function(callback) {
        const elTotal = $('.grandtotal-price .price, .grand.totals span.price');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
         if(window.location.href.indexOf("cart") > -1){
            const url = $('#discount-coupon-form').attr('action');
            const form_key = $('input[name="form_key"]').val();
            $.post(url, { remove: 1,form_key: form_key }, 
            (response) => {
                 callback(prevValue);
            });
        }else{
           const windowVariables = retrieveWindowVariables(["window.checkoutConfig","window.NREUM"]);
           const quoteId = windowVariables["window.checkoutConfig"].quoteId;
           const xpid = windowVariables["window.NREUM"].loader_config.xpid;
           $.ajax({
            url: 'https://www.hydroflask.com/rest/default/V1/guest-carts/'+quoteId+'/coupons',
            type: 'DELETE',
             headers: {
                'x-newrelic-id': xpid
                },
            success: () => { callback(prevValue); },
            error: () => { callback(prevValue); }
          });
        }
      },
      applyCode: function(code, callback) {
       this.preApplyCodes(() => {
        if(window.location.href.indexOf("cart") > -1){
          const url = $('#discount-coupon-form').attr('action');
          const form_key = $('input[name="form_key"]').val();
          $.ajax({
            url: url,
            type: 'POST',
            data: {
              remove: 0,
              form_key: form_key,
              coupon_code: code
            },
            success: () => {
              $.get('https://www.hydroflask.com'+window.location.pathname, (responseGet) => {
                const checkoutconfigindex = responseGet.indexOf("window.checkoutConfig");
                const customerDataindex = responseGet.indexOf("window.customerData");
                const finalIndex = customerDataindex-checkoutconfigindex;
                const data = JSON.parse(responseGet.substr(responseGet.indexOf("window.checkoutConfig")+23, finalIndex-37));
                const value = data.totalsData.grand_total;
                callback(value);             
              });
            },error: (xhr, status, error) => {
               callback(Number.POSITIVE_INFINITY);
            }
          });
        }else{
           const windowVariables = retrieveWindowVariables(["window.checkoutConfig","window.NREUM"]);
           const quoteId = windowVariables["window.checkoutConfig"].quoteId;
           const xpid = windowVariables["window.NREUM"].loader_config.xpid;
           $.ajax({
                url: 'https://www.hydroflask.com/rest/default/V1/guest-carts/'+quoteId+'/coupons/'+code,
                type: 'PUT',
                headers: {
                'x-newrelic-id': xpid
                },
                success: (data) => {
                  const ts = Math.round(new Date().getTime());
                      $.ajax({
                          url: 'https://www.hydroflask.com/rest/default/V1/guest-carts/'+quoteId+'/payment-information?_='+ts,
                          type: 'GET',
                          headers: {
                          'x-newrelic-id': xpid
                          },
                          success: (response) => {                  
                             const value = response.totals.base_grand_total;
                             callback(value.toFixed(2));
                          }
                        });
                },error: (xhr, status, error) => {
                  console.log(error);
                  callback(Number.POSITIVE_INFINITY);
                }
              });
        }
       });
      },
      applyBestCode: (bestCode) => {
        if(window.location.href.indexOf("cart") > -1){
          const url = $('#discount-coupon-form').attr('action');
          const form_key = $('input[name="form_key"]').val();
          $.post(url, { remove: 0, coupon_code: bestCode,form_key: form_key }, 
            (response) => {
              location.reload();
            });
         }else{
           const windowVariables = retrieveWindowVariables(["window.checkoutConfig","window.NREUM"]);
           const quoteId = windowVariables["window.checkoutConfig"].quoteId;
           const xpid = windowVariables["window.NREUM"].loader_config.xpid;
           $.ajax({
                url: 'https://www.hydroflask.com/rest/default/V1/guest-carts/'+quoteId+'/coupons/'+bestCode,
                type: 'PUT',
                headers: {
                'x-newrelic-id': xpid
                },
                success: () => {location.reload();}
              });
        }
      }
    },

   bedrosians: {
      id: 2046, 
      preApplyCodes: function(callback) {
        const elTotal = $('.order-summary-total span:last-child');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);           
      },
      applyCode: function(code, callback) { 
       this._applyCode(code, function() {
        if(window.location.href.indexOf("cart") > -1){
          const locationUrl = window.location.pathname;
           $.get('https://www.bedrosians.com'+locationUrl, 
            (response) => {
              const elTotal = $(response).find('.order-summary-total span:last-child');
              const value = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
              callback(value);
            });
        }else{
          const locationUrl = '/en/shoppingbag/checkoutitems/';
           $.get('https://www.bedrosians.com'+locationUrl, 
            (response) => {
              const value = response.AmountDue;
              callback(value);
            });
         }        
        }) ; 
      },
      applyBestCode: function(bestCode) {
        this._applyCode(bestCode, function() {
               location.reload();
              }) ;
      },
      _applyCode: (code, callback) => {
        const url = $('[name="promotionalCodeForm"] ').attr('action');
          $.ajax({
                url: 'https://www.bedrosians.com'+url,
                type: 'POST',
                data: {'Promotion.PromotionalCode': code},
                success: (data, textStatus, request) => {
                  callback(data);                
                },
                error: (data) => {  callback(data);  }
          });
      }
    },

   ltdcommodities: {
      id: 3937, 
      preApplyCodes: function(callback) {
        const elTotal = $('aside.order-sum__tab span');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);           
      },
      applyCode: function(code, callback) { 
       this._applyCode(code, function(value) {
        callback(value);
        }) ; 
      },
      applyBestCode: function(bestCode) {
        this._applyCode(bestCode, function() {
               location.reload();
              }) ;
      },
      _applyCode: (code, callback) => {
        const formData = getFormFieldsAsJson(document.querySelector('#couponCodeForm'));
        formData['/atg/commerce/promotion/CouponFormHandler.couponClaimCode'] = code;
        if(window.location.href.indexOf("shopping_cart") > -1){
          var url = $("#couponCodeForm").attr('action');
        }else{
          var url = '/checkout/order_summary_container_acap.jsp';
        }
        $.ajax({
          url: 'https://www.ltdcommodities.com'+url,
          type: 'POST',
          data: formData,
          success: (response) => {
            const elTotal = $(response).find('aside.order-sum__tab span'); 
            const value = elTotal.length > 0 ? 
                          convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
            callback(value);           
          },
          error: (data) => {  callback(Number.POSITIVE_INFINITY);  }
        });
      }
    },

    iceland: {
      id: 29940,
      preApplyCodes: function(callback) {
        const elTotal = $('.order-total .order-value');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: function(code, callback) {
        const windowVariables = retrieveWindowVariables(["window.Urls"]);
        const addCouponUrl = windowVariables["window.Urls"].addCoupon;      
            $.get(addCouponUrl+'?couponCode='+code+'&format=ajax', 
              (response) => {
               const value = response.baskettotal;
               callback(value);
              });         
      },
      applyBestCode: (bestCode) => {
        location.reload();
      }
    },

 dickies: {
    id: 682,
    preApplyCodes: (callback) => {
      const orderValueEl = $('.order-total td:last');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: (code, callback) => {
      const url = $('#cart-items-form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
      formData['dwfrm_cart_couponCode'] = code;
      formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
      $.post(url, formData, 
        (response) => {
          const orderValueEl = $(response).find('.order-total td:last');
          const value = orderValueEl.length > 0 ? 
                            convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                            Number.POSITIVE_INFINITY;
          callback(value);
        });
    },
    applyBestCode: (bestCode) => {
      try{ document.querySelector('.cart-coupon-code-note').click(); } catch(e){ } 
      document.querySelector('#dwfrm_cart_couponCode').value = bestCode;
      document.querySelector('#dwfrm_cart_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('#add-coupon').click();
    }
  },

  underarmour: {
    id: 1956, 
    preApplyCodes: function(callback) {
      const elTotal = $('.grand-total.bfx-total-grandtotal');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      if(document.querySelector('.js-removecoupon')){
          const prevCode = $('.js-removecoupon').attr('data-code');
          const uuid = $('.js-removecoupon').attr('data-uuid');
           $.get('https://www.underarmour.com/on/demandware.store/Sites-US-Site/en-us/Cart-RemoveCouponLineItem?code='+prevCode+'&uuid='+uuid, 
                () => {
                  callback(prevValue,prevCode);
            });
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
       const url = $('form[name="promo-code-form"]').attr('action');
      const csrf_token = $('[name="promo-code-form"] input[name="csrf_token"]').val();
       $.get('https://www.underarmour.com'+url+'/?csrf_token='+csrf_token+'&couponCode='+code, 
        (response) => {
          if(response.totals){
              const value = response.totals.grandTotal;
              const totalValue = convertNumbers(value.replace( /[^0-9.,]/g, '').trim())
              const locale = response.locale;
              const uuid =  response.totals.discounts[0].UUID;
              $.get('https://www.underarmour.com/on/demandware.store/Sites-US-Site/'+locale+'/Cart-RemoveCouponLineItem?code='+code+'&uuid='+uuid, 
                () => {
                  callback(totalValue);
            });
              
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#couponCode').value = bestCode;
      document.querySelector('#couponCode').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('button.promo-code-btn').click();
    }
  },

 shoplet: {
    id: 2578,
    preApplyCodes: (callback) => {
      const orderValueEl = $('#cartSubTotal');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: (code, callback) => {
      const url = 'https://www.shoplet.com/cart/process/mode/add_coupon/coupon_code/'+code+'/express/true';
      $.post(url, 
        () => {
           $.get('https://www.shoplet.com/cart/view', 
              (response) => {
              const cartSubTotal = $(response).find('#cartSubTotal');
              const cartSubTotalValue = cartSubTotal.length > 0 ? 
                                convertNumbers(cartSubTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                Number.POSITIVE_INFINITY;
              const couponTotal = $(response).find('p:contains("Coupon") + p');
              const couponTotalValue = couponTotal.length > 0 ? 
                                convertNumbers(couponTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                0;
              const shipping  = $(response).find('p:contains("Shipping") + p');
              const shippingValue = shipping.length > 0 ? 
                                convertNumbers(shipping.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                0;
              const handling = $(response).find('p:contains("Handling") + p');
              const handlingValue = handling.length > 0 ? 
                                convertNumbers(handling.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                0;
              const value = (cartSubTotalValue+shippingValue+handlingValue)-couponTotalValue;
              callback(value);
          });
        });
    },
    applyBestCode: (bestCode) => {
      location.reload();
    }
  },


  apply_landsend: {
    id: 3924,
    preApplyCodes: (callback) => {
      const orderValueEl = $('#shopping-bag .total-price .price:not(:contains($0)), .total-price.clearfix .price.ng-binding:not(:contains($0)),  .grand .order-totals-value:not(:contains($0))');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
     applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
      }) ; 
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
        location.reload();
      }) ;
    },
    _applyCode: (code, callback) => {
      const csrf_token = getCookie('X-CSRF-TOKEN');
        $.ajax({
          url: 'https://www.landsend.com/co/checkout/applyPromotion',
          type: 'POST',
          headers: {
          'x-csrf-token': csrf_token
          },
          data : {promoCode: code, promoPIN : '', functionName: 'applyPromotion'},
          success: (data) => {
               if(data.basket && data.basket.orderTotals){
                  const value = data.basket.orderTotals.localizedGrandTotal;
                  callback(value);
               }else{
                 callback(Number.POSITIVE_INFINITY);
               }
          },error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
      });
    }
  },

  deluxe: {
    id: 2227, 
    preApplyCodes: function(callback) {  
      const orderValueEl = $('.total-line div:eq(2)').contents().get(2).textContent;
      const prevValue = orderValueEl ? 
                        convertNumbers(orderValueEl.replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      $.ajax({
          url: 'https://www.deluxe.com/shopdeluxe/common/removeAppliedCoupon.jsp',
          type: 'POST',
          success: () => { callback(prevValue); },
          error: () => { callback(prevValue); }
        });        
    },
    applyCode: function(code, callback) {
     this.preApplyCodes(() => {       
      this._applyCode(code, function(value) {
        callback(value);
      }); 
     });
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
          location.reload();
      }) ;
    },
    _applyCode: (code, callback) => {
      $.ajax({
        url: 'https://www.deluxe.com/shopdeluxe/common/promotion_form.jsp',
        type: 'POST',
        data: {
          promoid: code,
        },
        success: (data) => {
          $.ajax({
              url: 'https://www.deluxe.com/shopdeluxe/sd/cart/yourShoppingCart.jsp?message=',
              type: 'GET',
              success: (response) => {        
                 const total = $(response).find('.total-line div:eq(2)').contents().get(2).textContent;
                 const value = total ? 
                      convertNumbers(total.replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
                 callback(value);  
              },error: () => {
                callback(Number.POSITIVE_INFINITY);
              }
          });
        },
        error: () => {
          callback(Number.POSITIVE_INFINITY);
        }
      });
    }
  },

  hsamuel: {
    id: 8419, 
    preApplyCodes: function(callback) {  
      const orderValueEl = $('.order-summary__total-value:last');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('#couponCodeRemove');
      if(prevCodeSelector){
        const prevCode = $('#couponCodeRemove').val();
         this._removeCode(prevCode, function() {
           callback(prevValue,prevCode);
        });
      }else{
        callback(prevValue);
      }       
    },
    applyCode: function(code, callback) {     
      this._applyCode(code, function() {
       $.get('https://'+window.location.hostname+'/webstore/secure/showbasket.sdo', 
          (response) => {
          const orderValueEl = $(response).find('.order-summary__total-value:last');
          const value = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
          this._removeCode(code, function() {
           callback(value);
        });
       });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
          location.reload();
      }) ;
    },
    _applyCode: (code, callback) => {
     const csrfToken = $('meta[name="_csrf"]').attr('content');
     $.ajax({
      url: 'https://'+window.location.hostname+'/webstore/secure/couponRedemption.sdo',
      type: 'POST',
      data: {
          couponCode: code,  _csrf: csrfToken
      },
      success: () => { callback(code); },
      error: () => { callback(code); }
    });
    },
    _removeCode: (code, callback) => {
     const csrfToken = $('meta[name="_csrf"]').attr('content');
     $.ajax({
      url: 'https://'+window.location.hostname+'/webstore/secure/removeCoupon.sdo',
      type: 'POST',
      data: {
          couponCode: code, remove : '', _csrf: csrfToken
      },
      success: () => { callback(); },
      error: () => { callback(); }
    });
    }
  },

  ernestjones: {
    id: 8899, 
    preApplyCodes: function(callback) {  
      const orderValueEl = $('.order-summary__total-value:last');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('#couponCodeRemove');
      if(prevCodeSelector){
        const prevCode = $('#couponCodeRemove').val();
         this._removeCode(prevCode, function() {
           callback(prevValue,prevCode);
        });
      }else{
        callback(prevValue);
      }       
    },
    applyCode: function(code, callback) {     
      this._applyCode(code, function() {
       $.get('https://'+window.location.hostname+'/webstore/secure/showbasket.sdo', 
          (response) => {
          const orderValueEl = $(response).find('.order-summary__total-value:last');
          const value = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
          this._removeCode(code, function() {
           callback(value);
        });
       });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
        location.reload();
      }) ;
    },
    _applyCode: (code, callback) => {
     const csrfToken = $('meta[name="_csrf"]').attr('content');
     $.ajax({
      url: 'https://'+window.location.hostname+'/webstore/secure/couponRedemption.sdo',
      type: 'POST',
      data: {
          couponCode: code,  _csrf: csrfToken
      },
      success: () => { callback(code); },
      error: () => { callback(code); }
      });
    },
    _removeCode: (code, callback) => {
       const csrfToken = $('meta[name="_csrf"]').attr('content');
       $.ajax({
        url: 'https://'+window.location.hostname+'/webstore/secure/removeCoupon.sdo',
        type: 'POST',
        data: {
            couponCode: code, remove : '', _csrf: csrfToken
        },
        success: () => { callback(); },
        error: () => { callback(); }
      });
    }
  },

  basspro: {
      id: 394,
      preApplyCodes: (callback) => {
        const elTotal = $('#cartTotal .total_figures');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        callback(prevValue);
      },
      applyCode: (code, callback) => {    
        const url = $('form[name="PromotionCodeForm"]').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('form[name="PromotionCodeForm"]'));
          formData['promoCode'] = code; 
          formData['requesttype'] = 'ajax';
        $.ajax({
          url: url,
          type: 'POST',
          data: formData,
          success: (response) => {
            const catalogId = $('#PromotionCodeForm input[name="catalogId"]').val();
            var storeId = $('#PromotionCodeForm input[name="storeId"]').val();
            var langId = $('input[name="langId"]').val();
            var getUrl = 'https://'+window.location.hostname+'/shop/ShopCartDisplayView?shipmentType=single&catalogId='+catalogId+'&langId='+langId+'&storeId='+storeId;
             $.ajax({
              url: getUrl,
              type: 'POST',
              data: {
                'objectId': '',
                'requesttype': 'ajax'
              },
              success: (response) => {                    
                const elTotal =  $(response).find('#cartTotal .total_figures');                   
                const value = elTotal.length > 0 ? 
                              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
                const formData2 = formData;
                formData2['taskType'] = 'R';                    
                var removeUrl = 'https://'+window.location.hostname+'/shop/AjaxRESTPromotionCodeRemove';
                 $.ajax({
                  url: removeUrl,
                  type: 'POST',
                  data: formData2,
                  success: (response) => {  callback(value); },
                  error: (response) => {  callback(value); }
                });
              }
            });
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
        });
      },
      applyBestCode: (bestCode) => {
         document.querySelector('#promoCode').value = bestCode;
         document.querySelector('#promoCode').dispatchEvent(new Event('input', {bubbles: true}));
         document.querySelector('.promotion_button a').click();
      }
    },

  melissaanddoug: {
    removePrevCode: function(code, callback) {
      if(window.location.href.indexOf("cart") > -1){
          const url = $('#cart-items-form').attr('action');
          const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
          formData['dwfrm_cart_coupons_i0_deleteCoupon'] = 'Remove';
          $.post(url, formData, 
            (response) => {
              callback();
          });
      }else{
          const windowVariables = retrieveWindowVariables(["window.Urls"]);
          const addCouponUrl = windowVariables["window.Urls"].addCoupon;
          $.get(addCouponUrl+'?couponCode=empty&couponAction=0&format=ajax', 
            (response) => {
              callback();
          });         
      }
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.bfx-total-grandtotal');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue));
    },
    applyCode: function(code, callback) {
      if(window.location.href.indexOf("cart") > -1){
          const url = $('#cart-items-form').attr('action');
          const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
          formData['dwfrm_cart_couponCode'] = code;
          formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
          formData['dwfrm_cart_updateCart'] = 'dwfrm_cart_updateCart';
            $.post(url, formData, 
            (responsePost) => {
              $.get('https://'+window.location.hostname+'/cart', (response) => {
                  const orderValueEl = $(response).find('.bfx-total-grandtotal');
                  const value = orderValueEl.length > 0 ? 
                                  convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                                  Number.POSITIVE_INFINITY;  
                  this.removePrevCode(code, () => callback(value));
              });
            });
      }else{
        const windowVariables = retrieveWindowVariables(["window.Urls"]);
        const addCouponUrl = windowVariables["window.Urls"].addCoupon;
        $.get(addCouponUrl+'?couponCode='+code+'&couponAction=add&format=ajax', 
            (responseGet) => {
              $.get('https://'+window.location.hostname+window.location.pathname, (response) => {
                  const orderValueEl = $(response).find('.bfx-total-grandtotal');
                  const value = orderValueEl.length > 0 ? 
                                  convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                                  Number.POSITIVE_INFINITY;  
                  this.removePrevCode(code, () => callback(value));         
              });
          });
      }
    },
    applyBestCode: (bestCode) => {
      if(window.location.href.indexOf("cart") > -1){
        document.querySelector('#dwfrm_cart_couponCode, #dwfrm_billing_couponCode').value = bestCode;
        document.querySelector('#dwfrm_cart_couponCode, #dwfrm_billing_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
        document.querySelector('#add-coupon').click();
      }else{
        location.reload();
      }
    }
  },

  mpix: {
    id: 6011,
    preApplyCodes: (callback) => {
      const orderValueEl = $('.order-summary div:contains("Total") .col-5.text-right, .order-summary .card-block .total');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
     applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
      }); 
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
        location.reload();
      });
    },
    _applyCode: (code, callback) => {
      $.ajax({
        url: 'https://www.mpix.com/customer/api/Checkout/ApplyPromo',
        type: 'POST',
        headers: {
        'content-type': 'application/json',
        'webapi-version' : 'V2'
        },
        data : JSON.stringify({PromoCode: code}),
        success: (data) => {
         if(data.orderTotal){
            const value = data.orderTotal.total;
            callback(value);
         }else{
           callback(Number.POSITIVE_INFINITY);
         }
        },error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });
    }
  },

  sierra: {
    id: 236,
    preApplyCodes: (callback) => {
      const orderValueEl = $('#cartSummary #orderTotal, .js-order-details-sub-total');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
     applyCode: function(code, callback) {
      this._applyCode(code, function() {
         $.get(window.location.href, (responseGet) => {             
            const elTotal = $(responseGet).find('#cartSummary #orderTotal, .js-order-details-sub-total');
            const value = elTotal.length > 0 ? 
                          convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
            callback(value);
          });
      }); 
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
        location.reload();
      }) ;
    },
    _applyCode: (code, callback) => {
       const formData = getFormFieldsAsJson(document.querySelector('.keycodeFormContainer form'));
       const url = $(".keycodeFormContainer form ").attr('action');
       formData['KeyCode'] = code;
      $.ajax({
        url: 'https://www.sierra.com/'+url,
        type: 'POST',
        data : formData,
        success: (data, textStatus, request) => {
          const locationUrl = request.getResponseHeader('location');
          callback(locationUrl);
        },error: (xhr, status, error) => {
          callback();
        }
      });
    }
  },

  bradfordexchangechecks: {
    id: 478,
    preApplyCodes: function(callback) { 
      const orderValueEl = $('.totals dd strong');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      callback(prevValue);     
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function() {
         $.get(window.location.href, (responseGet) => {
            const elTotal = $(responseGet).find('.totals dd strong');
            const value = elTotal.length > 0 ? 
                          convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
            callback(value);
          });
      });
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
        location.reload();
      }) ;
    },
    _applyCode: (code, callback) => {
      $.ajax({
        url: 'https://www.bradfordexchangechecks.com/modals/modalHaveAnAdPostForHome.jsp?ACTION=HAVE_AN_AD_PRDTL&from=home',
        type: 'POST',
        data : {BECT_CODE : code},
        success: (data, textStatus, xhr) => {
          callback();
        },error: (xhr, status, error) => {
          callback();
        }
      });
    }
  },

  nativecos: {
      preApplyCodes: function(callback) {
       if(window.location.href.indexOf("cart") > -1){ 
        const elTotal = $('.price-row__total span.row-value, .cart-header__price-row:contains("Subtotal") span');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        const prevCodeSelector = document.querySelector('.price-row__coupon .row-label');
        if(prevCodeSelector){
          try{  $('.price-row__coupon .price-row__remove').click(); }catch(e){}
          setTimeout(function(){
            const prevCodeData = prevCodeSelector.innerText;
            const prevCode = prevCodeData.replace('Coupon: ','');
            callback(prevValue,prevCode);
           }, 500);
        }else{
          callback(prevValue);
        }        
       }else{
        const elTotal = $('.payment-due__price');
        const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
        const prevCode = $('.edit_checkout .reduction-code__text').first().text();
        callback(prevValue,prevCode);
       }
      },
      applyCode: function(code, callback) {
        if(window.location.href.indexOf("cart") > -1){
          setTimeout(function(){
          try{  $('.cart-header__promo-toggle').click(); }catch(e){}
          document.querySelector('.cart-header__promo-input').value = code;
          document.querySelector('.cart-header__promo-input').dispatchEvent(new Event('input', {bubbles: true}));
          document.querySelector('.cart-header__promo-input').dispatchEvent(new Event('change'));
          document.querySelector('.cart-header__promo-btn').click();          
          setTimeout(function(){
           const elTotal = $('.price-row__total span.row-value');
           const value = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY; 
           prevCodeSelector = $('.price-row__coupon .price-row__remove');
           if(prevCodeSelector){
              try{  $('.price-row__coupon .price-row__remove').click(); }catch(e){}
              callback(value); 
             }else{
              callback(value); 
             } 
           }, 2000);
        }, 2000);
        }else{
            const authenticity_token = $('input[name="authenticity_token"]:last').val();
            const url = 'https://'+window.location.hostname+$(".edit_checkout ").attr('action');
            $.ajax({
              url: url,
              type: 'POST',
              data: {
                _method: 'patch',
                authenticity_token: authenticity_token,
                'checkout[reduction_code]': code,
                'checkout[client_details][browser_width]': 1349,
                'checkout[client_details][browser_height]': 657,
                'checkout[client_details][javascript_enabled]': 1
              },
              success: () => {
                $.get('https://'+window.location.hostname+window.location.pathname, (responseGet) => {             
                  const elTotal = $(responseGet).find('.payment-due__price');
                  const value = elTotal.length > 0 ? 
                                convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                Number.POSITIVE_INFINITY;
                  callback(value);
                });
              },
              error: (xhr, status, error) => {
                console.log(error);
                callback(Number.POSITIVE_INFINITY);
              },
              fail: (xhr, status, error) => {
                console.log(error);
                callback(Number.POSITIVE_INFINITY);
              }
            });
         }
      },
      applyBestCode: (bestCode) => {
       if(window.location.href.indexOf("cart") > -1){
          document.querySelector('.cart-header__promo-input').value = bestCode;
          document.querySelector('.cart-header__promo-input').dispatchEvent(new Event('input', {bubbles: true}));
          document.querySelector('.cart-header__promo-input').dispatchEvent(new Event('change'));
          document.querySelector('.cart-header__promo-btn').click();
       }else{
        document.querySelector('[name="checkout[reduction_code]"], #checkout_discount_code').value = bestCode;
        document.querySelector('[name="checkout[reduction_code]"], #checkout_discount_code').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        setTimeout(function(){
            document.querySelector('[data-trekkie-id="apply_discount_button"], #apply-discount').click(); 
          }, 500);
       }
      }
    },

  elfcosmetics: {
    id: 722,
    preApplyCodes: (callback) => {
      const orderValueEl = $('.order-total .order-value');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: (code, callback) => {
    if(document.querySelector('#cart-items-form')){ 
      const url = $('#cart-items-form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
      formData['dwfrm_cart_couponCode'] = code;
      formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
      $.post(url, formData, 
        (response) => {
          const orderValueEl = $(response).find('.order-total .order-value');
          const value = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
          callback(value);
        });
    }else{
      const windowVariables = retrieveWindowVariables(["window.Urls"]);
      const addCouponUrl = windowVariables["window.Urls"].addCoupon;     
      $.get(addCouponUrl+'?couponCode='+code+'&format=ajax', 
        (response) => { const value = response.baskettotal; callback(value); }) 
      }
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#dwfrm_cart_couponCode, #dwfrm_billing_couponCode').value = bestCode;
      document.querySelector('#dwfrm_cart_couponCode, #dwfrm_billing_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('#add-coupon').click();
    }
  },

  acehardware: {
    id: 722,
    preApplyCodes: (callback) => {
      const orderValueEl = $('.cart-footer-pricing-total-container div:last-child .cart-footer-pricing-total');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: (code, callback) => {
      const cartId = $('[name="id"]').val();
      $.ajax({
        url: 'https://www.acehardware.com/api/commerce/carts/'+cartId+'/coupons/'+code,
        type: 'PUT',
        contentType: 'application/json',
        success: (response) => {
          if(response.discountedTotal){
            const value = response.discountedTotal;
            callback(value);
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        },error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });
    },
    applyBestCode: (bestCode) => {
      const cartId = $('[name="id"]').val();
      $.ajax({
        url: 'https://www.acehardware.com/api/commerce/carts/'+cartId+'/coupons/'+bestCode,
        type: 'PUT',
        contentType: 'application/json',
        success: () => { location.reload(); },
        error: () => { location.reload(); }
      });
    }
  },

  'ray-ban': {
    id: 198, 
    preApplyCodes: function(callback) {
      const elTotal = $('.wcs-shopping-total-title.wcs-shopping-grandtotal-js');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
      }) ;
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
        location.reload();
      }) ;
    },
    _applyCode: (code, callback) => {      
      const url = 'https://www.ray-ban.com/AjaxPromotionCodeManage';
      const orderID = $('#orderId').val();
      const storeId = $('[name="storeId"]').val();
      $.ajax({
        url: url,
        type: 'POST',
        data: {promoCode: code, orderId: orderID, taskType: 'A', URL: 'ShopCartDisplayView', isCalculateViewRequired: true, promoAjax: true, storeId: storeId },
        success: (response, status, xhr) => {
          const total = $(response).find('.wcs-shopping-total-title.wcs-shopping-grandtotal-js'); 
          const value = total.length > 0 ? 
            convertNumbers(total.first().text().replace( /[^0-9.,]/g, '').trim()) : 
            Number.POSITIVE_INFINITY;
            callback(value);
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });    
    }
  },

  coach_uk: {
    removePrevCode: function(code, callback) {
      if(window.location.href.indexOf("checkout") > -1){
        callback();
      }else{
        const url = $('#cart-items-form').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
        formData['dwfrm_cart_coupons_i0_deleteCoupon'] = 'Remove';
        $.get(url, formData, 
          (response) => {
            callback();
        }).fail(function() {
         callback();
        });         
      }
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('#secondary .order-total .subtotal.value, span:contains("Estimated Total") + span, .row.order-total span:last');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue));
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      if(window.location.href.indexOf("checkout") > -1){
        const url = $('#dwfrm_cart').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('#dwfrm_cart'));
        formData['dwfrm_cart_couponCode-text'] = code;
        formData['dwfrm_cart_couponCode'] = code;
        formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
        $.post(url, formData, 
        (responsePost) => {
          const orderValueEl = $(responsePost).find('#secondary .order-total .subtotal.value, span:contains("Estimated Total") + span, .row.order-total span:last');
          const value = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;  
          callback(value);
        }).fail(function(response) {
          callback(Number.POSITIVE_INFINITY)
        });  
      }else{
        const url = $('#cart-items-form').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
        formData['dwfrm_cart_couponCode-text'] = code;
        formData['dwfrm_cart_couponCode'] = code;
        formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
        formData['dwfrm_cart_updateCart'] = 'dwfrm_cart_updateCart';
        $.get(url, formData, 
        (responsePost) => {
          const orderValueEl = $(responsePost).find('#secondary .order-total .subtotal.value, span:contains("Estimated Total") + span, .row.order-total span:last');
          const value = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;  
          callback(value);
        }).fail(function(response) {
          callback(Number.POSITIVE_INFINITY)
        });
      }
    },
  },

  'magazine': {
    id: 33924,
    preApplyCodes: (callback) => {
      const orderValueEl = $('#subTotal__amount--price');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      this.totalBefore = prevValue;
      callback(prevValue);
    },
    applyCode: (code, callback) => {
      const sid = $('.arLanguage__selection.visible').attr('data-selection');
      const cid = $('#containerId').val();
      const url = 'https://www.magazine.store/rest-crt/model/public/com/meredith/commerce/order/coupon/ValidateCouponActor/validate/?sid='+sid+'&cid='+cid+'&cpn='+code;
      $.get(url, 
      (response) => {
        const data = JSON.parse(response.validationResult);
        const data2 = JSON.parse(Object.keys(data)[0]);
        const discount = data2.discount;
        const prevValue = this.totalBefore;
        const value = prevValue-discount;
        callback(value);       
      });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#couponCode').value = bestCode;
      document.querySelector('#couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('.coupon-apply').click(); 
    }
  },

  onehanesplace: {
    id: 1289,
    preApplyCodes: function(callback) {
      const elTotal = $('#cart-totals .price.bfx-price.bfx-total-grandtotal, tr.grand.totals');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      const url = $('#discount-coupon-form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#discount-coupon-form'));
      formData['coupon_code_fake'] = code;
      formData['coupon_code'] = code;
      formData['last_code'] = code;
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: () => {
          $.get('https://'+window.location.hostname+window.location.pathname, (responseGet) => {
            const checkoutconfigindex = responseGet.indexOf("window.checkoutConfig");
            const customerDataindex = responseGet.indexOf("window.isCustomerLoggedIn");
            const finalIndex = customerDataindex-checkoutconfigindex;
            const data = JSON.parse(responseGet.substr(responseGet.indexOf("window.checkoutConfig")+23, finalIndex-107));
            const value = data.totalsData.base_grand_total;
            const formData2 = getFormFieldsAsJson(document.querySelector('#discount-coupon-form'));
            formData2['last_code'] = code;
            formData2['remove_coupon'] = code;
             $.post(url, formData2, 
              (response) => {
               callback(value);
              });              
          });
        },
        error: (xhr, status, error) => {
           callback(Number.POSITIVE_INFINITY);
        }
      });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#coupon_code_fake, #discount-code-fake').value = bestCode;
      document.querySelector('#coupon_code_fake, #discount-code-fake').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
      document.querySelector('#coupon_code_fake, #discount-code-fake').dispatchEvent(new Event('change', {bubbles: true}));
      document.querySelector('#coupon_code_fake, #discount-code-fake').dispatchEvent(new Event('blur')); 
      document.querySelector('#coupon_code_fake, #discount-code-fake').dispatchEvent(new Event('focus'));    
      document.querySelector('#discount-coupon-form button.action.apply,#discount-form button.action.action-apply').click();    
    }
  },

  trekkinn: {
    preApplyCodes: function(callback) {
      const elTotal = $('#importe_total');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
      }) ;
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
        location.reload();
      }) ;
    },
    _applyCode: (code, callback) => {      
      const url = $('.c-zona-codigo').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('.c-zona-codigo'));
      formData['codigo_promocional'] = code;      
      $.ajax({
        url: 'https://'+window.location.hostname+'/'+url,
        type: 'POST',
        data: formData,
        success: (response, status, xhr) => {
          const total = $(response).find('#importe_total'); 
          const value = total.length > 0 ? 
                    convertNumbers(total.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
            callback(value);
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });    
    }
  },

  modanisa: {
    removePrevCode: function(code, callback) {
      const url = 'https://www.modanisa.com/en/basket/kupon_sil.php?new=1';
      $.get(url, 
        (response) => {
          callback();
      }).fail(function() {
          callback();
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.basketSummary-value-totalPrice');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('div:nth-child(3) > div.basketSummary-couponCodeWrapper > span').text();
      this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {      
      const url = 'https://www.modanisa.com/en/api/use_coupon.php';
      $.ajax({
        url: url,
        type: 'POST',
        data: {coupon_code: code},
        success: (response, status, xhr) => {
         $.get('https://www.modanisa.com/en/api/basket_components.php', 
          (responsePost) => {
            const data = JSON.parse(responsePost);
            const basket = data.basketSummary;
            const orderValueEl = $(basket).find('.basketSummary-value-totalPrice');
            const value = orderValueEl.length > 0 ? 
                            convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                            Number.POSITIVE_INFINITY;
            callback(value);
          }).fail(function(response) {
            callback(Number.POSITIVE_INFINITY)
          });
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });    
    },
  },

  shoecarnival: {
    id: 5851,
    preApplyCodes: (callback) => {
      const orderValueEl = $('.cart-order-totals .order-total .order-value');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: (code, callback) => {
      const url = $('#cart-items-form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
      formData['dwfrm_cart_couponCode'] = code;
      formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
      $.post(url, formData, 
        (response) => {
          const orderValueEl = $(response).find('.cart-order-totals .order-total .order-value');
          const value = orderValueEl.length > 0 ? 
                            convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                            Number.POSITIVE_INFINITY;
          callback(value);
        });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#dwfrm_cart_couponCode').value = bestCode;
      document.querySelector('#dwfrm_cart_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('#add-coupon').click();
    }
  },

  yesstyle: {
    removePrevCode: function(code, callback) {
      const windowVariables = retrieveWindowVariables(["ysApp.config"]);
      const authorization = windowVariables["ysApp.config"].security['Y-Authorization'];
      const expiration = windowVariables["ysApp.config"].security['Y-Expiration'];
      const string = windowVariables["ysApp.config"].security['Y-String'];
      const url = 'https://www.yesstyle.com/rest/coupon/v1/coupon-reward-code';
      $.ajax({
        url: url,
        type: 'DELETE',
        headers: {
                  'y-authorization': authorization,
                  'y-expiration': expiration,
                  'y-string': string,
                  'content-type': 'text/plain;charset=UTF-8'
                },
        data : JSON.stringify({couponCode : ''}),
        success: () => { callback(); },
        error: () => { callback(); }
      });  
    },
    preApplyCodes: function(callback) { 
      const elTotal = document.querySelector('[ng-bind-html="shoppingBag.orderSummary.grandTotal"]').innerText;
      const prevValue = elTotal.replace(/[^0-9.,]/g, '').trim();
      this.removePrevCode('prevCode', () => callback(prevValue));
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {      
      const windowVariables = retrieveWindowVariables(["ysApp.config"]);
      const authorization = windowVariables["ysApp.config"].security['Y-Authorization'];
      const expiration = windowVariables["ysApp.config"].security['Y-Expiration'];
      const string = windowVariables["ysApp.config"].security['Y-String'];
      const url = 'https://www.yesstyle.com/rest/coupon/v1/coupon-reward-code';
      $.ajax({
        url: url,
        type: 'PATCH',
        headers: {
                  'y-authorization': authorization,
                  'y-expiration': expiration,
                  'y-string': string,
                  'content-type': 'text/plain;charset=UTF-8'
                },
        data : JSON.stringify({couponCode : code}),
        success: (response) => {
          if(response.result && response.result.orderSummary){
            const value = response.result.orderSummary.orderTotal
            callback(value);
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        },
        error: () => {
          callback(Number.POSITIVE_INFINITY);
        }
      });    
    },
  },

  'shoppbs': {
    preApplyCodes: function(callback) {
      const elTotal = $('.total-line .summary-line .price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
      }) ;
    },
    applyBestCode: function(bestCode) {
     document.querySelector('input[name="COUPON_CODE"]').value = bestCode;
     try{  
      document.querySelector('input[name="COUPON_CODE"]').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('input[name="COUPON_CODE"]').dispatchEvent(new Event('change', {bubbles: true}));
      document.querySelector('button#cart-promo-button, button#billing-coupon-button').click();
     }catch(e){}
    },
    _applyCode: (code, callback) => {      
      $.ajax({
        url: location.href,
        type: 'POST',
        data: {COUPON_CODE: code},
        success: (response, status, xhr) => {
          const total = $(response).find('.total-line .summary-line .price'); 
          const value = total.length > 0 ? 
                    convertNumbers(total.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });    
    }
  },

  ctshirts: {
    removePrevCode: function(code, callback) {
      const url = $('#cart-items-form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
      formData['dwfrm_cart_coupons_i0_deleteCoupon'] = 'Remove';
      $.post(url, formData, 
        (response) => {
          callback();
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.js-summary-desktop .item__price--large:last-child');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      var prevCodeSelector = document.querySelector('#js-coupon-code + .item-list__coupon .coupon-radio label');
      var prevCode;
      if(prevCodeSelector){
        prevCode = prevCodeSelector.innerText;
        this.removePrevCode('prevCode', () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      const url = $('#cart-items-form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
      formData['dwfrm_cart_couponCode'] = code;
      formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
      formData['dwfrm_cart_updateCart'] = 'dwfrm_cart_updateCart';
      $.post(url, formData, 
      (responsePost) => {
        const orderValueEl = $(responsePost).find('.js-summary-desktop .item__price--large:last-child');
        const value = orderValueEl.length > 0 ? 
                    convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;  
        this.removePrevCode(code, () => callback(value));
      });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#dwfrm_cart_couponCode').value = bestCode;
      document.querySelector('#dwfrm_cart_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('#add-coupon').click();
    }
  },

  haggar: {
    removePrevCode: function(code, callback) {
      const windowVariables = retrieveWindowVariables(["window.Urls"]);
      const removeCouponUrl = windowVariables["window.Urls"].deleteCoupon;
      $.ajax({
        url: removeCouponUrl+'?couponCode='+code+'&format=ajax',
        type: 'GET',
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = document.querySelector('.order-total .order-value').innerText;
      const prevValue = elTotal.replace(/[^0-9.,]/g, '').trim();
      const prevCodeSelector = document.querySelector('.cartcoupon');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.innerText;
        this.removePrevCode(prevCode, () => callback(prevValue));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        $.get(location.href, 
          (response) => {
            const orderValueEl = $(response).find('.order-total .order-value');
            const value = orderValueEl.length > 0 ? 
                    convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY; 
            this.removePrevCode(code, () => callback(value));
        }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
        });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      const windowVariables = retrieveWindowVariables(["window.Urls"]);
      const addCouponUrl = windowVariables["window.Urls"].addCoupon;
      $.ajax({
        url: addCouponUrl+'?couponCode='+code+'&format=ajax',
        type: 'GET',
        success: (response) => { callback(); },
        error: () => { callback(); }
      });
    },
  },

  aeropostale: {
    removePrevCode: function(code, callback) {
      if(window.location.href.indexOf("cart") > -1){
        const url = $('#cart-items-form').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
        formData['dwfrm_cart_coupons_i0_deleteCoupon'] = 'Remove';
        $.post(url, formData, 
          (response) => {
             callback();
        });
      }
    },
    preApplyCodes: function(callback) { 
      const elTotal = document.querySelector('.order-total .order-value').innerText;
      const prevValue = elTotal.replace(/[^0-9.,]/g, '').trim();
      const prevCodeSelector = document.querySelector('.cartcoupon .value');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.innerText;
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        if(window.location.href.indexOf("cart") > -1){
          $.get('https://'+window.location.hostname+'/cart', (response) => {
              const orderValueEl = $(response).find('.order-total .order-value');
              const value = orderValueEl.length > 0 ? 
                          convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;  
              this.removePrevCode(code, () => callback(value));               
            }).fail(function() {
              callback(Number.POSITIVE_INFINITY);
          });
        }else{         
         $.get('https://'+window.location.hostname+'/on/demandware.store/Sites-aeropostale-Site/default/COBilling-UpdateSummary?format=ajax', 
          (response) => {
          const orderValueEl = $(response).find('.order-total .order-value');
          const value = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
          callback(value);
          });
        }
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      if(window.location.href.indexOf("cart") > -1){  
        const url = $('#cart-items-form').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
        formData['dwfrm_cart_couponCode'] = code;
        formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
        $.post(url, formData, 
        (responsePost) => {
          callback();
        });
      }else{
        $.get('https://'+window.location.hostname+'/on/demandware.store/Sites-aeropostale-Site/default/Cart-AddCouponJson?couponCode='+code+'&format=ajax', 
        (responseGet) => {
          callback();
        });
      }
    },
  },

  hockeymonkey: {
    id: 938,
    removePrevCode: function(code, callback) {
      if(window.location.href.indexOf("cart") > -1){
        const url = $('#discount-coupon-form').attr('action');
        const formData2 = getFormFieldsAsJson(document.querySelector('#discount-coupon-form'));
        formData2['last_code'] = code;
        formData2['remove_coupon'] = code;
        $.post(url, formData2, 
        (response) => {  callback(); }).fail(function() { callback(); });
      }else{
        const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
        const quoteId = windowVariables["window.checkoutConfig"].quoteId;
        const customerData = windowVariables["window.checkoutConfig"].customerData;
        const storeCode = windowVariables["window.checkoutConfig"].storeCode
        var url;
        if(customerData.id){
          url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/carts/mine/coupons';
        }else{
          url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/guest-carts/'+quoteId+'/coupons';
        }
        $.ajax({
          url: url,
          type: 'DELETE',
          success: (response) => { callback(); },
          error: (response) => { callback(); }
        });
      }           
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.grand.totals .price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#coupon_code, #discount-code').val();
      if(prevCode != ''){
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
        const ts = Math.round(new Date().getTime());
        const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
        const quoteId = windowVariables["window.checkoutConfig"].quoteId;
        const customerData = windowVariables["window.checkoutConfig"].customerData;
        const storeCode = windowVariables["window.checkoutConfig"].storeCode
        var url;
        if(customerData.id){
          url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/carts/mine/payment-information?_='+ts;
        }else{
          url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/guest-carts/'+quoteId+'/payment-information?_='+ts;
        }
        $.ajax({
            url: url,
            type: 'GET',
            success: (response) => {                  
               const value = response.totals.base_grand_total;
               this.removePrevCode(code, () => callback(value.toFixed(2)));
            },error: () => { this.removePrevCode(code, () => callback(Number.POSITIVE_INFINITY)); }
          });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
        location.reload();
      }) ;
    },
    _applyCode: (code, callback) => {
      if(window.location.href.indexOf("cart") > -1){
        const url = $('#discount-coupon-form').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('#discount-coupon-form'));
        formData['coupon_code_fake'] = code;
        formData['coupon_code'] = code;
        formData['last_code'] = code;
        $.ajax({
          url: url,
          type: 'POST',
          data: formData,
          success: () => { callback(); },
          error: () => { callback(); }
        });
      }else{
        const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
        const quoteId = windowVariables["window.checkoutConfig"].quoteId;
        const customerData = windowVariables["window.checkoutConfig"].customerData;
        const storeCode = windowVariables["window.checkoutConfig"].storeCode
        var url;
        if(customerData.id){
          url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/carts/mine/coupons/'+code;
        }else{
          url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/guest-carts/'+quoteId+'/coupons/'+code;
        }
        $.ajax({
          url: url,
          type: 'PUT',
          success: () => { callback(); },
          error: () => { callback(); }
        });
      }
    },
  },

  stylevana: {
    id: 39514, 
    preApplyCodes: function(callback) {
      const elTotal = $('#shopping-cart-totals-table tfoot tr:last-child td:last-child .price, #order-summary-table tfoot tr:last-child td:last-child .price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#coupon_code').val();
      callback(prevValue,prevCode);
    },
    applyCode: function(code, callback) {
      const url = $('#discount-coupon-form').attr('action');
      $.ajax({
        url: url,
        type: 'POST',
        data: {
          remove: 0,
          coupon_code: code
        },
        success: (data, textStatus, request) => {
          const locationUrl = request.getResponseHeader('location');
          $.get(locationUrl , (responseGet) => {
            const elTotal = $(responseGet).find('#shopping-cart-totals-table tfoot tr:last-child td:last-child .price, #order-summary-table tfoot tr:last-child td:last-child .price');
            var value = 0;
            if( elTotal.length > 0 ){
               $( elTotal ).each(function( index ) {
                value += convertNumbers($( this ).text().replace( /[^0-9.,]/g, '').trim());                
               });
            }else{
                value = Number.POSITIVE_INFINITY;
            }
            
            callback(value);
          });
        },
        error: (xhr, status, error) => {
           callback(Number.POSITIVE_INFINITY);
        }
      });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#coupon_code').value = bestCode;
      document.querySelector('#coupon_code').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
      document.querySelector('button[value="Apply Coupon"]').click();  
    }
  },

  '123inkjets': {
    preApplyCodes: function(callback) { 
      const elTotal = $('.grand-total .price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue)
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        $.get('https://www.123inkjets.com/checkout/cart/retrieveCartTotals', 
        (response) => {
          const data = JSON.parse(response);
          const value = data.grandtotal;
          callback(value);
      }).fail(function() {
          callback(Number.POSITIVE_INFINITY);
      });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      const url = 'https://www.123inkjets.com/checkout/cart/couponPost';
      $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({coupon_code :code, 'async': true }),
        success: () => { callback(); },
        error: () => { callback(); }
      });    
    },
  },

  'inkcartridges': {
    preApplyCodes: function(callback) { 
      const elTotal = $('.grand-total .price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue)
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        $.get('https://www.inkcartridges.com/checkout/cart/retrieveCartTotals', 
        (response) => {
          const data = JSON.parse(response);
          const value = data.grandtotal;
          callback(value);
      }).fail(function() {
          callback(Number.POSITIVE_INFINITY);
      });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      const url = 'https://www.inkcartridges.com/checkout/cart/couponPost';
      $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({coupon_code :code, 'async': true }),
        success: () => { callback(); },
        error: () => { callback(); }
      });    
    },
  },

  'kitchenaid': {
    preApplyCodes: function(callback) { 
      const elTotal = document.querySelector('.summary__row .order-summary-estimated-value strong').innerText;
      const prevValue = convertNumbers(elTotal.replace( /[^0-9.,]/g, '').trim());
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('.mobile-hidden #voucherCode, .shopping-cart-tile-wrapper #voucherCode, #order-promo-code-input').value = bestCode;
      document.querySelector('.mobile-hidden #voucherCode, .shopping-cart-tile-wrapper #voucherCode, #order-promo-code-input').dispatchEvent(new Event('input', {bubbles: true})); 
      document.querySelector('.mobile-hidden #voucherCode, .shopping-cart-tile-wrapper #voucherCode, #order-promo-code-input').dispatchEvent(new Event('change', {bubbles: true})); 
      document.querySelector('.mobile-hidden #voucherCode, .shopping-cart-tile-wrapper #voucherCode, #order-promo-code-input').dispatchEvent(new Event('blur')); 
      document.querySelector('.mobile-hidden #voucherCode, .shopping-cart-tile-wrapper #voucherCode, #order-promo-code-input').dispatchEvent(new Event('keyup')); 
      document.querySelector('.mobile-hidden #voucherCode, .shopping-cart-tile-wrapper #voucherCode, #order-promo-code-input').dispatchEvent(new Event('focus'));  
      document.querySelector('.js-order-summary-promo-apply').click()   
    },
    _applyCode: (code, callback) => {
      const url = $('#voucherForm').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#voucherForm'));
      formData['voucherCode'] = code;
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: (response) => { 
          const data = $(response).find('#updatedCartData').attr('data-updated-cart-data');
          const jsonData = JSON.parse(data);
          const value = jsonData.totalPriceWithTax.value;
          callback(value);
         },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });    
    },
  },

  'eaglemoss': {
    preApplyCodes: function(callback) { 
      const elTotal = document.querySelector('[value="vm.basket.subtotalWithDiscount"], [value="total.value"]').textContent;
      const prevValue = convertNumbers(elTotal.replace( /[^0-9.,]/g, '').trim());
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      const basehref = $('base').attr('href');
      const url = 'https://shop.eaglemoss.com'+basehref+'api/basket/coupon/add';
      $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({coupon :code }),
        success: (response) => { 
          if(response.customer && response.customer.cart){
            const value = response.customer.cart.totals.grand_total;
            callback(value); 
          }else{
            callback(Number.POSITIVE_INFINITY); 
          }
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });    
    },
  },

  'hayneedle': {
    preApplyCodes: function(callback) { 
      const elTotal = document.querySelector('[class*="cart-subtotal__cartRowTotal"].txt-black.txt-right, [class*="order-summary__cartRowTotal"].txt-black.txt-right').innerText;
      const prevValue = convertNumbers(elTotal.replace( /[^0-9.,]/g, '').trim());
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      const csrfToken = localStorage.getItem('csrfToken');
      if(window.location.href.indexOf("cart") > -1){
        const url = 'https://www.hayneedle.com/sf-service/carts/applyPromotionCode';
        $.ajax({
          url: url,
          type: 'POST',
          headers: {
                    'x-csrf-jwt': csrfToken,
                    'content-type': 'application/json'
                  },
          data: JSON.stringify({promotionCode :code }),
          success: (response) => {
            if(response.carts){
              const value = response.carts[0].total;
              callback(value);
            }else{
              callback(Number.POSITIVE_INFINITY);
            }
          },
          error: () => { callback(Number.POSITIVE_INFINITY); }
        }); 
      }else{
        const windowVariables = retrieveWindowVariables(["window.__PRELOADED_STATE__.session"]);
        const checkoutSessionId = windowVariables['window.__PRELOADED_STATE__.session'].checkoutSessionID;
        const browserSessionID = windowVariables['window.__PRELOADED_STATE__.session'].browserSessionID;
        const url = 'https://www.hayneedle.com/checkout-service/proxy/v1/checkouts/'+checkoutSessionId+'/promotions?browserSessionID='+browserSessionID;
        $.ajax({
          url: url,
          type: 'PUT',
          headers: {
                    'x-csrf-jwt': csrfToken,
                    'content-type': 'application/json'
                  },
          data: JSON.stringify({promotionCode :code }),
          success: (response) => {
            const getUrl = 'https://www.hayneedle.com/checkout-service/proxy/v1/checkouts/'+checkoutSessionId+'?bypassCache=false&includes=orderTotals';
            $.ajax({
              url: getUrl,
              type: 'GET',
              headers: {
                        'x-csrf-jwt': csrfToken,
                        'content-type': 'application/json'
                      },
              success: (responseGet) => {
                if(responseGet.orderReviews){
                  const value = responseGet.orderReviews[0].orderTotals[0].orderTotal;
                  callback(value);
                }else{
                  callback(Number.POSITIVE_INFINITY);
                }
              },
              error: () => { callback(Number.POSITIVE_INFINITY); }
            })            
          },
          error: () => { callback(Number.POSITIVE_INFINITY); }
        }); 
      }         
    },
  },

  kmart: {
    id: 201, 
    preApplyCodes: function(callback) {
      const elTotal = $('.est-total-bottom strong');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      var ts = Math.round(new Date().getTime());
       const body = {
          couponRequest: {couponCode: code },
        };
      $.ajax({
        url: 'https://www.kmart.com/crsp/api/cart/v1/coupon/add?ts='+ts,
        type: 'POST',
        data: JSON.stringify(body),
        contentType: 'application/json;charset=UTF-8',
        success: () => {
          var ts2 = Math.round(new Date().getTime());
          $.ajax({
            url: `https://www.kmart.com/crsp/api/cart/v1/view?ts=`+ts2,
            type: 'GET',
            success: (data) => {               
              const value = data.response.cartSummary.mrchSubTot;                       
              var ts3 = Math.round(new Date().getTime());
              $.ajax({
                url: 'https://www.kmart.com/crsp/api/cart/v1/coupon/remove?ts='+ts3,
                type: 'POST',
                data: JSON.stringify(body),
                contentType: 'application/json;charset=UTF-8',
                success: () => {   callback(value); },
                error: () => {  callback(value);  }
              });
            },
            error: (xhr, status, error) => {
              callback(Number.POSITIVE_INFINITY);
            }
          })
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('[ng-model=couponCode]').value = bestCode;
      document.querySelector('[ng-model=couponCode]').dispatchEvent(new MouseEvent('input', {bubbles: true}));
      setTimeout(function(){
        document.querySelector('.cc-add').click();
        location.reload();
      }, 1000);
    }
  },

  lacoste: {
    id: 5221,
    removePrevCode: function(code, callback) {
      const lang = getCookie('language');
      const url = 'https://'+window.location.hostname+'/on/demandware.store/Sites-FlagShip-Site/'+lang+'/CartV2-RemoveCouponLineItem';
      $.ajax({
        url: url,
        type: 'POST',
        data: {couponCode : code},
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('li.cart-price-total');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('.js-delete-code');
      if(prevCodeSelector){
        const prevCode = $('.js-delete-code').attr('data-coupon-code');
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        $.get(window.location.href, 
        (response) => {
          const orderValueEl = $(response).find('li.cart-price-total');
          const value = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
          this.removePrevCode(code, () => callback(value));
        }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
        });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {      
      const lang = getCookie('language');
      const url = 'https://'+window.location.hostname+'/on/demandware.store/Sites-FlagShip-Site/'+lang+'/Cart-AddCoupon';
      $.ajax({
        url: url,
        type: 'POST',
        data: {couponCode : code, format : 'ajax'},
        success: () => {  callback(); },
        error: () => { callback(); }
      });    
    },
  },

  popsockets: {
    id: 31559,
    removePrevCode: function(code, uuid, callback) {
      const url = 'https://'+window.location.hostname+'/on/demandware.store/Sites-AMER-Site/en_US/Cart-RemoveCouponLineItem' +
                '?code=' + code +
                '&uuid=' + uuid; 
      $.ajax({
        url: url,
        type: 'GET',
        data: {},
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('p.grand-total, span.grand-total-sum');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const el = $('button.remove-coupon');
      var url = null;
      if (el !== null && el !== undefined && el.length > 0) {
        const prevCode = el.attr('data-code');
        const uuid = el.attr('data-uuid');
        this.removePrevCode(prevCode,uuid, () => callback(prevValue, prevCode));
      } else {
        callback(prevValue);
      }     
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        $.get('https://'+window.location.hostname+window.location.pathname, (responseGet) => {
          const el = $(responseGet).find('button.remove-coupon');
          if (el !== null && el !== undefined && el.length > 0) {
            const uuid = el.attr('data-uuid');
            this.removePrevCode(code,uuid, () => callback(value));
          }else{
            callback(value);
          }      
        }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
        });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#couponCode').value = bestCode;
      document.querySelector('#couponCode').dispatchEvent(new MouseEvent('input', { bubbles: true } )); 
      document.querySelector('.promo-code-btn').click();   
    },
    _applyCode: (code, callback) => {      
        const csrf_token = $('input[name*="csrf_token"]').first().val();
        const addCouponUrl = '/on/demandware.store/Sites-AMER-Site/en_US/Cart-AddCoupon';
        const url = 'https://'+window.location.hostname+addCouponUrl +
                    '?couponCode=' + code + 
                    '&csrf_token=' + csrf_token;
        $.ajax({
          url: url,
          type: 'GET',
          data: {},
          success: (response, status, xhr) => {
            if (response !== null) {
              const totals = response.totals;
              if (totals !== null && totals !== undefined) {
                const value = totals.grandTotal !== null ? 
                          convertNumbers(totals.grandTotal.replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
                callback(value);                
                return;
              }
            }
            callback(Number.POSITIVE_INFINITY);
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
      });    
    },
  },

  geekbuying: {
    id: 16592, 
    preApplyCodes: function(callback) {
      const elTotal = $('#lbGrandTotal');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      const formData = getFormFieldsAsJson(document.querySelector('#BrainTreeForm'));
      formData['CouponCode'] = code;
      $.ajax({
        url: 'https://www.geekbuying.com/checkout/GetShoppingCartViewModelAjax',
        type: 'POST',
        data: formData,
        success: (response) => {
          const value = response.GrandTotal;
          callback(value);
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#txtCouponCode').value = bestCode;
      document.querySelector('#txtCouponCode').dispatchEvent(new MouseEvent('input', {bubbles: true}));
      document.querySelector('.geekcoud_btn').click();
    }
  },

  ashleyfurniture: {
    id: 22815, 
    removePrevCode: function(code, callback) {
      const url = $('#cart-items-form').attr('action');
      const csrf_token = $('#cart-items-form [name="csrf_token"]').val();
      const formData = {dwfrm_cart_updateCart : 'dwfrm_cart_updateCart', 
                        dwfrm_cart_couponCode : '',
                        dwfrm_cart_coupons_i0_deleteCoupon : 'Remove',
                        csrf_token : csrf_token
                        };
      $.post(url, formData, 
        (response) => {
           callback();
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.order-total .order-value');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('.cartcoupon .coupon-code');
      if(prevCodeSelector){
        const prevCode = $('.cartcoupon .coupon-code').first().text();
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {
      const url = $('#cart-items-form').attr('action');
      const csrf_token = $('#cart-items-form [name="csrf_token"]').val();
      const formData = {dwfrm_cart_updateCart : 'dwfrm_cart_updateCart', 
                        dwfrm_cart_couponCode : code,
                        dwfrm_cart_addCoupon : 'dwfrm_cart_addCoupon',
                        csrf_token : csrf_token
                        };
      $.post(url, formData, 
      (responsePost) => {
        $.get('https://'+window.location.hostname+'/cart', (response) => {
          const orderValueEl = $(response).find('.order-total .order-value');
          const value = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;  
          this.removePrevCode(code, () => callback(value));
        });
      });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#dwfrm_cart_couponCode').value = bestCode;
      document.querySelector('#dwfrm_cart_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('#add-coupon').click();
    }
  },

 'kiwico': {
    id: 10236,
    removePrevCode: function(code, callback) {
      const url = 'https://www.kiwico.com/kereru/v1/me/cart/coupon';
      $.ajax({
        url: url,
        type: 'DELETE',
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('dt:contains("Total") + dd');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('#__next .coupon-name');
      if(prevCodeSelector){
        document.querySelector('#coupon-toggle ~ div button[aria-label="Close"]').click();
        const prevCode = prevCodeSelector.innerText;
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#coupon').value = bestCode;
      document.querySelector('#coupon').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('#coupon').dispatchEvent(new Event('change'));
      $("button span:contains('Apply')").click();
    },
    _applyCode: (code, callback) => {
      const url = 'https://www.kiwico.com/kereru/v1/me/cart/coupon/'+code;
      $.ajax({
        url: url,
        type: 'POST',
        success: (response) => { 
          const value = response.data.totals.grandTotal;
          callback(value);
         },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });    
    },
  },

  'rag-bone': {
    removePrevCode: function(code, callback) {
      const url = $('#cart-items-form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
      formData['dwfrm_cart_coupons_i0_deleteCoupon'] = 'Remove';
      formData['dwfrm_cart_couponCode'] = '';
      $.post(url, formData, 
        (response) => {
           callback();
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = document.querySelector('tr.order-total td strong').innerText;
      const prevValue = elTotal.replace(/[^0-9.,]/g, '').trim();
      const prevCodeSelector = document.querySelector('.promo-remove strong');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.innerText;
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        $.get('https://'+window.location.hostname+'/cart', (response) => {
          const orderValueEl = $(response).find('tr.order-total td strong');          
          const value = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
          this.removePrevCode(code, () => callback(value));               
        }).fail(function() {
          callback(Number.POSITIVE_INFINITY);
        });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      const url = $('#cart-items-form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
      formData['dwfrm_cart_couponCode'] = code;
      formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
      $.post(url, formData, 
      (responsePost) => {
        callback();
      }).fail(function() {
          callback();
      });
    },
  },

  chowbus: {
    id: 44323,
    preApplyCodes: (callback) => {
      const elTotal = $('.MuiGrid-root .MuiTypography-body1:contains("Total") +');
      const prevValue = elTotal.length > 0 ? 
               convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
               Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: (code, callback) => {
      $('.MuiButtonBase-root:contains("Apply")').removeClass('Mui-disabled'); 
      document.querySelector('input[name="promoCode"]').value = code;
      document.querySelector('input[name="promoCode"]').dispatchEvent(new MouseEvent('input', {bubbles: true}));
      $('.MuiButtonBase-root:contains("Apply")').click();
      setTimeout(function(){              
       const fTotal = $('.MuiGrid-root .MuiTypography-body1:contains("Total") +');
       const value = fTotal.length > 0 ? 
               convertNumbers(fTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
               Number.POSITIVE_INFINITY;
        callback(value);
       }, 5000);
    },
    applyBestCode: (bestCode) => {
      $('.MuiButtonBase-root:contains("Apply")').removeClass('Mui-disabled'); 
      document.querySelector('input[name="promoCode"]').value = bestCode;
      document.querySelector('input[name="promoCode"]').dispatchEvent(new MouseEvent('input', {bubbles: true}));
      $('.MuiButtonBase-root:contains("Apply")').click();
    }
  },

  saksoff5th: {
    id: 9833,
    preApplyCodes: (callback) => {
      const elTotal = $('.grand-total-sum');
      const prevValue = elTotal.length > 0 ? 
               convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
               Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: (code, callback) => {
      try{   document.querySelector('.promo-click').click(); }catch(e){} 
      document.querySelector('#maincontent input#couponCode').value = code;      
      try{   
        setTimeout(()=>{
          $('.promo-code-btn').prop("disabled", false);
          $('.promo-code-btn').removeAttr("disabled");
          document.querySelector('#couponCode').dispatchEvent(new Event('input', { bubbles: true }));
          document.querySelector('#couponCode').dispatchEvent(new Event('keyup'));
          document.querySelector('#couponCode').dispatchEvent(new Event('blur'));
          document.querySelector('#couponCode').dispatchEvent(new Event('focus'));
          document.querySelector('.promo-code-btn').click();   
        }, 2000); 
      }catch(e){}
      setTimeout(function(){              
       const fTotal = $('#maincontent .grand-total-sum');
       const value = fTotal.length > 0 ? 
               convertNumbers(fTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
               Number.POSITIVE_INFINITY;
        callback(value);
       }, 4000);
    },
    applyBestCode: (bestCode) => {
      location.reload();
    }
  },

  elemis: {
    removePrevCode: function(code, callback) {
     const cartId = JSON.parse(localStorage.getItem('M2_VENIA_BROWSER_PERSISTENCE__cartId')).value.replace(/"/g,'');
     const windowVariables = retrieveWindowVariables(["window.STORE_CODE"]);
     const storeCode = windowVariables["window.STORE_CODE"];
     $.ajax({
        url: 'https://'+window.location.hostname+'/graphql',
        type: 'POST',
        contentType: 'application/json',
        headers: {
                  'store': storeCode,
                },
        data: JSON.stringify({
          operationName: 'removeCouponFromCart',
          query: 'mutation removeCouponFromCart($cartId: String!) { removeCouponFromCart(input: { cart_id: $cartId}) { cart { prices { grand_total { value currency __typename } }  __typename } __typename } }',
          variables : {cartId : cartId }
        }),
        success: (response) => {
          callback();
        },
        error: (xhr, status, error) => {
           callback();
        }
      });
    },
    preApplyCodes: function(callback) {
    console.log('elemis'); 
      const elTotal = $('div:contains("Grand Total") +div:first, .cart-grand-total');
      const prevValue = elTotal.length > 0 ? 
                        convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      if(document.querySelector('.remove-coupon')){
        var prevCode = document.querySelector('.applied-coupon').textContent;
        prevCode = prevCode.replace("Code ", "");
        prevCode = prevCode.replace(" successfully applied!", "");
        prevCode = prevCode.replace(/"/g, "").trim();
        console.log(prevCode);
        this.removePrevCode('prevCode', () => callback(prevValue,prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      var timeout = 100;
      try{document.querySelector('.promo-block-checkout .discount-coupon-form .collapsible-toggle, .minicart-bottom .discount-coupon-form .collapsible-toggle').click();}catch(e){}
      if(document.querySelector('.remove-coupon button')){
        document.querySelector('.remove-coupon button').click();
        timeout = 3000;
      }
      setTimeout(()=> { 
        document.querySelector('#coupon_code, input[name="coupon-code"]').value = bestCode;
        document.querySelector('#coupon_code, input[name="coupon-code"]').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('#coupon_code, input[name="coupon-code"]').dispatchEvent(new Event('change'));
        setTimeout(()=> { 
          document.querySelector('.promo-block-checkout .promo-text-filed .btn,.minicart-bottom .promo-text-filed .btn').click();  
        },1500); 
      },timeout);  
    },
    _applyCode: (code, callback) => {
      const cartId = JSON.parse(localStorage.getItem('M2_VENIA_BROWSER_PERSISTENCE__cartId')).value.replace(/"/g,'');
      const windowVariables = retrieveWindowVariables(["window.STORE_CODE"]);
      const storeCode = windowVariables["window.STORE_CODE"];
      $.ajax({
        url: 'https://'+window.location.hostname+'/graphql',
        type: 'POST',
        contentType: 'application/json',
        headers: {
                  'store': storeCode,
                },
        data: JSON.stringify({
          operationName: 'applyCouponToCart',
          query: 'mutation applyCouponToCart($cartId: String!, $couponCode: String!) { applyCouponToCart(input: { cart_id: $cartId,  coupon_code: $couponCode }) { cart { prices { grand_total { value currency __typename } }  __typename } __typename } }',
          variables : {cartId : cartId, couponCode: code }
        }),
        success: (response) => {
          if(response.data.applyCouponToCart){
            const value = response.data.applyCouponToCart.cart.prices.grand_total.value;
            callback(value);
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        },
        error: (xhr, status, error) => {
           callback(Number.POSITIVE_INFINITY);
        }
      });
    },
  },

  'dresslily': {
    id: 16963,
    removePrevCode: function(code, callback) {
      var ts = Math.round(new Date().getTime());
      const url = 'https://'+window.location.hostname+'/fun/index.php?act=clearCoupon&_='+ts;
      $.get(url, 
        (response) => {
        callback();
      }).fail(function() {
        callback();
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.cart-summary-info li:last-child .my-shop-price:contains($), li[class*="account-total"] span[class*="js_checkoutSummary"]:contains($)');
      const prevValue = elTotal.length > 0 ? 
                        convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('#cart_summary_promotion_code');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.value;
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        $.get('https://'+window.location.hostname+window.location.pathname, (responseGet) => {
          const checkoutconfigindex = responseGet.indexOf("o.cart.total");
          const customerDataindex = responseGet.indexOf("o.cart.list");
          const finalIndex = customerDataindex-checkoutconfigindex;
          const data = JSON.parse(responseGet.substr(responseGet.indexOf("o.cart.total")+15, finalIndex-21));
          const value = data.goods_price;
          this.removePrevCode(code, () => callback(value));               
        }).fail(function() {
          callback(Number.POSITIVE_INFINITY);
        });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      var ts = Math.round(new Date().getTime());
      const url = 'https://'+window.location.hostname+window.location.pathname+'?pcode='+code+'&_='+ts;
      $.get(url, 
      (responsePost) => {
        callback();
      }).fail(function() {
        callback();
      });
    },
  },

  'boutiquefeel': {
    id: 35130,
    removePrevCode: function(code, callback) {
      var ts = Math.round(new Date().getTime());
      const url = 'https://'+window.location.hostname+'/v9/shopping-cart/anon/unuse-coupon?_='+ts;
      const windowVariables = retrieveWindowVariables(["window.secret"]);
      const xtoken = windowVariables["window.secret"];
      const wid = getCookie('clientId');    
      $.ajax({
        url: url,
        type: 'GET',
         headers: {
                  'xtoken': xtoken,
                  'wid': wid,
                },
        success: (response) => { callback(); },
        error: (xhr, status, error) => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $(' #fixedSummary div:contains("Order Total") + div');
      const prevValue = elTotal.length > 0 ? 
                        convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      callback(prevValue);     
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        var ts = Math.round(new Date().getTime());
        const windowVariables = retrieveWindowVariables(["window.secret"]);
        const xtoken = windowVariables["window.secret"];
        const wid = getCookie('clientId');    
        $.ajax({
            url: 'https://'+window.location.hostname+'/v9/shopping-cart/show?_='+ts,
            type: 'GET',
             headers: {
                      'xtoken': xtoken,
                      'wid': wid,
                    },
            success: (response) => {
              const value = response.result.orderSummary.orderTotal.amount;
              this.removePrevCode(code, () => callback(value));
            },
            error: (xhr, status, error) => { callback(Number.POSITIVE_INFINITY); }
          });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      const windowVariables = retrieveWindowVariables(["window.secret"]);
      const xtoken = windowVariables["window.secret"];
      const wid = getCookie('clientId');    
      $.ajax({
          url: 'https://'+window.location.hostname+'/v9/coupon/anon/use-coupon-by-code',
          type: 'POST',
          data: {code: code},
           headers: {
                    'xtoken': xtoken,
                    'wid': wid,
                    'content-type': 'application/x-www-form-urlencoded'
                  },
          success: (response) => {   callback(); },
          error: (xhr, status, error) => { callback(); }
        });
    },
  },

  bronsonvitamins: {
    id: 14302,
    removePrevCode: function(code, callback) {
      if(window.location.href.indexOf("cart") > -1){
        const url = $('#discount-coupon-form').attr('action');
        const form_key = $('[name="form_key"]').val();
        $.post(url, { remove: 1, coupon_code: code, form_key: form_key }, 
        (response) => {  callback(); }).fail(function() { callback(); });
      }else{
        const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
        const quoteId = windowVariables["window.checkoutConfig"].quoteId;
        const customerData = windowVariables["window.checkoutConfig"].customerData;
        var url;
        if(customerData.id){
          url = 'https://www.bronsonvitamins.com/rest/default/V1/carts/mine/coupons';
        }else{
          url = 'https://www.bronsonvitamins.com/rest/default/V1/guest-carts/'+quoteId+'/coupons';
        }
        $.ajax({
          url: url,
          type: 'DELETE',
          success: (response) => { callback(); },
          error: (response) => { callback(); }
        });
      }           
    },
    preApplyCodes: function(callback) {
      const elTotal = $('[data-th="Order Total"] .c-price__value');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#coupon_code, #discount-code').val();
      if(prevCode != ''){
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
      if(window.location.href.indexOf("cart") > -1){
        $.get('https://www.bronsonvitamins.com'+window.location.pathname, (responseGet) => {
            const checkoutconfigindex = responseGet.indexOf("window.checkoutConfig");
            const customerDataindex = responseGet.indexOf("window.customerData");
            const finalIndex = customerDataindex-checkoutconfigindex;
            const data = JSON.parse(responseGet.substr(responseGet.indexOf("window.checkoutConfig")+24, finalIndex-38));
            const value = data.totalsData.base_grand_total;
            this.removePrevCode(code, () => callback(value));
          });
       }else{
        const ts = Math.round(new Date().getTime());
        const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
        const quoteId = windowVariables["window.checkoutConfig"].quoteId;
        const customerData = windowVariables["window.checkoutConfig"].customerData;
        var url;
        if(customerData.id){
          url = 'https://www.bronsonvitamins.com/rest/default/V1/carts/mine/payment-information?_='+ts;
        }else{
          url = 'https://www.bronsonvitamins.com/rest/default/V1/guest-carts/'+quoteId+'/payment-information?_='+ts;
        }
        $.ajax({
            url: url,
            type: 'GET',
            success: (response) => {                  
               const value = response.totals.base_grand_total;
               callback(value.toFixed(2));
            },error: () => { callback(Number.POSITIVE_INFINITY); }
          });
       }   
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
        location.reload();
      }) ;
    },
    _applyCode: (code, callback) => {
      if(window.location.href.indexOf("cart") > -1){
        const url = $('#discount-coupon-form').attr('action');
        const form_key = $('[name="form_key"]').val();
        $.ajax({
          url: url,
          type: 'POST',
          data: { remove: 0, coupon_code: code, form_key:form_key },
          success: () => { callback(); },
          error: () => { callback(); }
        });
      }else{
        const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
        const quoteId = windowVariables["window.checkoutConfig"].quoteId;
        const customerData = windowVariables["window.checkoutConfig"].customerData;
        var url;
        if(customerData.id){
          url = 'https://www.bronsonvitamins.com/rest/default/V1/carts/mine/coupons/'+code;
        }else{
          url = 'https://www.bronsonvitamins.com/rest/default/V1/guest-carts/'+quoteId+'/coupons/'+code;
        }
        $.ajax({
          url: url,
          type: 'PUT',
          success: () => { callback(); },
          error: () => { callback(); }
        });
      }
    },
  },

  kindsnacks: {
    id: 25518, 
    preApplyCodes: function(callback) {
      const elTotal = $('.c-cart-totals__order-summary__total__col.grand-total');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
       const url = $('form[name="promo-code-form"]').attr('action');
      const csrf_token = $('.promo-code-form input[name="csrf_token"]').val();
       $.get('https://www.kindsnacks.com'+url+'/?csrf_token='+csrf_token+'&couponCode='+code, 
        (response) => {
          if(response.totals){
              const value = response.totals.grandTotalDecimal;
              callback(value);                
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        });
    },
    applyBestCode: (bestCode) => {
      location.reload();
    }
  },

  timex: {
    id: 16918,
    preApplyCodes: (callback) => {
      const orderValueEl = $('.order-total .order-value');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: (code, callback) => {
     if(window.location.href.indexOf("cart") > -1){ 
      const url = $('#cart-items-form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
      formData['dwfrm_cart_couponCode'] = code;
      formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
      $.post(url, formData, 
        (response) => {
          const orderValueEl = $(response).find('.order-total .order-value');
          const value = orderValueEl.length > 0 ? 
                            convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                            Number.POSITIVE_INFINITY;
          callback(value);
        });
     }else{
      const url = $('#shipping-coupon-form').attr('action');
        $.get(url+'?couponCode='+code+'&format=ajax', 
        (response) => {
          $.get(window.location.href+'?cpnc='+code, 
            (responseGet) => {
              const orderValueEl = $(responseGet).find('.order-total .order-value');
              const value = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
              callback(value);
            }).fail(function() {
              callback(Number.POSITIVE_INFINITY);
          });
        }).fail(function() {
          callback(Number.POSITIVE_INFINITY);
        });
      }
    },
    applyBestCode: (bestCode) => {
      location.reload();
    }
  },

  'mirror': {
    id: 44880,
    removePrevCode: function(code, callback) {
      const appState = JSON.parse(localStorage.getItem('appState'));
      const entities_id = appState.orders.results[0];
      const orderNumber = appState.orders.entities[entities_id].number;
      const ordertoken = appState.orders.entities[entities_id].token;
      const url = 'https://www.mirror.co/api/v1/orders/'+orderNumber+'/remove_coupon_code?order_token='+ordertoken+'&type=order';
      $.ajax({
        url: url,
        type: 'PUT',
        contentType : 'application/json',
        data : JSON.stringify({coupon_code: code}),
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      var eltotal, prevValue;
      elTotal = $('[class*=Total__StyledPrice]');
      prevValue = elTotal.length > 0 ? 
              convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
              Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('.coupons .code');
      if(prevCodeSelector){
        const prevCodeContent = prevCodeSelector.textContent;
        const prevCode = prevCodeContent.replace(' REMOVE','')
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue); 
      }    
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        const appState = JSON.parse(localStorage.getItem('appState'));
        const entities_id = appState.orders.results[0];
        const orderNumber = appState.orders.entities[entities_id].number;
        const ordertoken = appState.orders.entities[entities_id].token;
        const url = 'https://www.mirror.co/api/v1/orders/'+orderNumber+'?order_token='+ordertoken+'&type=order';
        $.get(url, 
        (responseGet) => {
          const value = responseGet.total;
          if(responseGet.promotions[0]){
            const prevCode =responseGet.promotions[0].code;
            this.removePrevCode(prevCode, () => callback(value));
          }else{
            callback(value);
          }        
        }).fail(function() {
          callback(Number.POSITIVE_INFINITY);
        });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      const appState = JSON.parse(localStorage.getItem('appState'));
      const entities_id = appState.orders.results[0];
      const orderNumber = appState.orders.entities[entities_id].number;
      const ordertoken = appState.orders.entities[entities_id].token;
      const url = 'https://www.mirror.co/api/v1/orders/'+orderNumber+'/apply_coupon_code?order_token='+ordertoken+'&type=order';
      $.ajax({
        url: url,
        type: 'PUT',
        contentType : 'application/json',
        data : JSON.stringify({coupon_code: code}),
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
  },

  'rugsusa': {
    id: 4769,
    removePrevCode: function(code, callback) {
      const url = 'https://www.rugsusa.com/rugsusa/control/ajaxremovepromocode?productPromoCodeId='+code;
      $.ajax({
        url: url,
        type: 'POST',
        data : {},
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const orderValueEl = $('#cart-container  .order-summary__you-pay-chevron--open:first');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      const prevFinalValue = (prevValue/100).toFixed(2);
      const prevCode = $('#cart-container .order-summary__promo--applied-number:not(:contains("undefined"))').first().text();
      if(prevCode){
        this.removePrevCode(prevCode, () => callback(prevFinalValue,prevCode));
      }else{
        callback(prevFinalValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      const url = 'https://www.rugsusa.com/rugsusa/control/ajaxaddpromocodeorgiftcard';
      $.ajax({
        url: url,
        type: 'POST',
        data : {productPromoCodeId: code},
        success: (response) => { 
          const value = response.grandTotal;
          callback(value);
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'hearthsong': {
    id: 926,
    preApplyCodes: function(callback) {
      var prevValue;
      if(window.location.href.indexOf("cart") > -1){
        const orderValueEl = $('.cart-totals .grand-total, .cart-totals .totals');
        prevValue = orderValueEl.length > 0 ? 
                  convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      }else{
        const subTotal = $('.cart-totals .subtotal');
        const subTotalValue = subTotal.length > 0 ? 
                      convertNumbers(subTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;

        const tax = $('.cart-totals .tax');
        const taxValue = tax.length > 0 ? 
                      convertNumbers(tax.first().text().replace( /[^0-9.,]/g, '').trim()) :  0;
        var shippingValue = 0;
        $('.cart-totals .shipping').each(function() {
            var shipping = $(this).first().text();
            shippingValue += convertNumbers(shipping.replace( /[^0-9.,]/g, '').trim());
        });

        prevValue = (subTotalValue+taxValue+shippingValue).toFixed(2);
      }      
      const prevCode = $('#promoCode').val();
      if(prevCode){
        callback(prevValue,prevCode);
      }else{
        callback(prevValue);
      }  
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      }.bind(this));  
    },
    _applyCode: (code, callback) => {
      const url = $('#voucherForm').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#voucherForm'));
      formData['promoCode'] = code;
      $.ajax({
        url: 'https://www.hearthsong.com'+url,
        type: 'POST',
        data: formData,
        success:  (data, textStatus, request1) => {         
          var value;
          if(window.location.href.indexOf("cart") > -1){
             $.get(location.href, 
              (responseget) => {
                const elTotal = $(responseget).find('.cart-totals .grand-total, .cart-totals .totals');
                value = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
                callback(value); 
              }).fail(function() {
              callback(Number.POSITIVE_INFINITY);
            }); 
          }else{
            $.get(location.href, 
            (responseget) => {
              const subTotal = $(responseget).find('.cart-totals .subtotal');
              const subTotalValue = subTotal.length > 0 ? 
                            convertNumbers(subTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                            Number.POSITIVE_INFINITY;
              const tax = $(responseget).find('.cart-totals .tax');
              const taxValue = tax.length > 0 ? 
                            convertNumbers(tax.first().text().replace( /[^0-9.,]/g, '').trim()) :  0;
              var shippingValue = 0;
              $(responseget).find('.cart-totals .shipping').each(function() {
                var shipping = $(this).first().text();
                shippingValue += convertNumbers(shipping.replace( /[^0-9.,]/g, '').trim());
              });
              value = (subTotalValue+taxValue+shippingValue).toFixed(2);
              callback(value);
             }).fail(function() {
              callback(Number.POSITIVE_INFINITY);
            }); 
          }
         },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });    
    },
  },

  'plowhearth': {
    id: 3081,
    preApplyCodes: function(callback) { 
      const orderValueEl = $('.cart-totals .grand-total, .cart-totals .totals');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      const prevCode = $('#promoCode').val();
      if(prevCode){
        callback(prevValue,prevCode);
      }else{
        callback(prevValue);
      }  
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      }.bind(this));  
    },
    _applyCode: (code, callback) => {
      const url = $('#voucherForm').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#voucherForm'));
      formData['promoCode'] = code;
      $.ajax({
        url: 'https://www.plowhearth.com'+url,
        type: 'POST',
        data: formData,
        success:  (data, textStatus, request1) => {
          $.get(location.href, 
            (responseget) => {
              const elTotal = $(responseget).find('.cart-totals .grand-total, .cart-totals .totals');
              const value = elTotal.length > 0 ? 
                            convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                            Number.POSITIVE_INFINITY; 
              callback(value);
          }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
          }); 
         },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });    
    },
  },

  'vivino': {
    id: 41843,
    removePrevCode: function(code, callback) {
      const windowVariables = retrieveWindowVariables(["window.__PRELOADED_STATE__"]);
      const cartId = windowVariables['window.__PRELOADED_STATE__'].cartId;        
      const url = 'https://www.vivino.com/api/carts/'+cartId;
      const csrf = $('meta[name="csrf-token"]').attr('content');
      $.ajax({
        url: url,
        type: 'PUT',
        headers: {
                  'x-csrf-token': csrf,
                  'content-type': 'application/json',
                  'accept' :  'application/json'
                },
        data : JSON.stringify({carrier_service_system_id : 'vivino.ground', coupon_code : null }),
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const orderValueEl = $('[class*=OrderConfirmationStep__orderConfirmationStep] tfoot tr:last-child td:last-child [class*=OrderConfirmationStep], [class*="totalPrice"] > [class*="formattedPrice"]');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue));      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      const prevCodeSelector = document.querySelector('[class*=OrderConfirmationStep__orderConfirmationStep] button[class*=CouponCode__button], [class*="CouponApplied"] + [class*="CouponManagement__link"]');
      try {
        if(prevCodeSelector){
          prevCodeSelector.click();
          var timeout = '2000';
        }else{
          var timeout = '1';
        }        
      } catch(e) { var timeout = '1'; }
      setTimeout(function(){  
        const promobox = document.querySelector('[class*=OrderConfirmationStep__orderConfirmationStep] #couponCode, #coupon_code');
        promobox.value = bestCode;
        promobox.dispatchEvent(new Event('input', {bubbles: true}));
        promobox.dispatchEvent(new Event('change'));
        document.querySelector('[class*=OrderConfirmationStep__orderConfirmationStep] button[class*=CouponCode__button], [class*="CouponManagement__link"]').click();
      }, timeout);      
    },
    _applyCode: (code, callback) => {
      const windowVariables = retrieveWindowVariables(["window.__PRELOADED_STATE__"]);
      const cartId = windowVariables['window.__PRELOADED_STATE__'].cartId;        
      const url = 'https://www.vivino.com/api/carts/'+cartId;
      const csrf = $('meta[name="csrf-token"]').attr('content');
      $.ajax({
        url: url,
        type: 'PUT',
        headers: {
                  'x-csrf-token': csrf,
                  'content-type': 'application/json',
                  'accept' :  'application/json'
                },
        data : JSON.stringify({carrier_service_system_id : 'vivino.ground', coupon_code : code }),
        success: (response) => {
          if(response.cart){
            const value = response.cart.total_amount;
            callback(value); 
          }else{
            callback(Number.POSITIVE_INFINITY);
          }          
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  currentcatalog: {
    id: 640,
    removePrevCode: function(code, callback) {
      callback();          
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.grand.totals .price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#coupon_code, #discount-code').val();
      if(prevCode != ''){
        callback(prevValue, prevCode);
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
      if(window.location.href.indexOf("cart") > -1){
        $.get('https://www.currentcatalog.com'+window.location.pathname, (responseGet) => {
            const checkoutconfigindex = responseGet.indexOf("window.checkoutConfig");
            const customerDataindex = responseGet.indexOf("window.customerData");
            const finalIndex = customerDataindex-checkoutconfigindex;
            const data = JSON.parse(responseGet.substr(responseGet.indexOf("window.checkoutConfig")+24, finalIndex-38));
            const value = data.totalsData.base_grand_total;
            callback(value);
          });
       }else{
        const ts = Math.round(new Date().getTime());
        const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
        const quoteId = windowVariables["window.checkoutConfig"].quoteData.entity_id;
        const customerData = windowVariables["window.checkoutConfig"].customerData;
        var url;
        if(customerData.id){
          url = 'https://www.currentcatalog.com/rest/currentcatalog/V1/carts/mine/payment-information?_='+ts;
        }else{
          url = 'https://www.currentcatalog.com/rest/currentcatalog/V1/guest-carts/'+quoteId+'/payment-information?_='+ts;
        }
        $.ajax({
            url: url,
            type: 'GET',
            success: (response) => {                  
               const value = response.totals.base_grand_total;
               callback(value.toFixed(2));
            },error: () => { callback(Number.POSITIVE_INFINITY); }
          });
       }   
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
        location.reload();
      }) ;
    },
    _applyCode: (code, callback) => {
      if(window.location.href.indexOf("cart") > -1){
        const url = $('#discount-coupon-form').attr('action');
        const form_key = $('[name="form_key"]').val();
        $.ajax({
          url: url,
          type: 'POST',
          data: { remove: 0, coupon_code: code, form_key:form_key },
          success: () => { callback(); },
          error: () => { callback(); }
        });
      }else{
        const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
        const quoteId = windowVariables["window.checkoutConfig"].quoteData.entity_id;
        const customerData = windowVariables["window.checkoutConfig"].customerData;
        var url;
        if(customerData.id){
          url = 'https://www.currentcatalog.com/rest/currentcatalog/V1/carts/mine/coupons/'+code;
        }else{
          url = 'https://www.currentcatalog.com/rest/currentcatalog/V1/guest-carts/'+quoteId+'/coupons/'+code;
        }
        $.ajax({
          url: url,
          type: 'PUT',
          success: () => { callback(); },
          error: () => { callback(); }
        });
      }
    },
  },

  'ikrush_uk': {
    id: 13253,
    removePrevCode: function(code, callback) {
      const formData = getFormFieldsAsJson(document.querySelector('#payment-form'));
      formData['ajax'] = 'true';
      formData['action'] = 'clear_coupon';
      formData['basket[coupon_code]'] = code;
      formData['basket[coupon_name]'] = code;      
      $.ajax({
        url: 'https://www.ikrush.com/shop/checkout/ajax.php',
        type: 'POST',
        data: formData,
        success: () => { callback(); },
        error: () => { callback(); }
      });         
    },
    preApplyCodes: function(callback) { 
      const orderValueEl = $('#basketTotal .show');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      const prevCodeSelector = $('#totals td:contains("Discount Code")');
      if(prevCodeSelector.length > 0){
        const prevCodeText = prevCodeSelector.text().trim();
        const matches = prevCodeText.match(/\"(.*?)\"/);
        if (matches) {
            const prevCode = matches[1];
            this.removePrevCode(prevCode, () => callback(prevValue,prevCode));
        }else{
          callback(prevValue);
        }        
      }else{
        callback(prevValue); 
      } 
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      }.bind(this));  
    },
    _applyCode: (code, callback) => {
      const formData = getFormFieldsAsJson(document.querySelector('#payment-form'));
      formData['ajax'] = 'true';
      formData['action'] = 'validate_coupon';
      formData['basket[coupon_code]'] = code;
      $.ajax({
        url: 'https://www.ikrush.com/shop/checkout/ajax.php',
        type: 'POST',
        data: formData,
        success:  (response) => {
          const value = response.basket.cost_total;
          callback(value); 
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });    
    },
  },

  thredup: {
    id: 6340,
    removePrevCode: function(code, callback) {
      var shippingOptionId = '1';
      const xtupvisitorid = decodeURI(document.cookie.split(';').filter(function(c) { return c.indexOf('visitor_id') !== -1 })[0]).trim().split('=')[1];
      const authtoken = decodeURI(document.cookie.split(';').filter(function(c) { return c.indexOf('tup_jwt_token') !== -1 })[0]).trim().split('=')[1];
      const tuppt = decodeURI(document.cookie.split(';').filter(function(c) { return c.indexOf('tuppt') !== -1 })[0]).trim().split('=')[1];
      const guid = decodeURI(document.cookie.split(';').filter(function(c) { return c.indexOf('guid') !== -1 })[0]).trim().split('=')[1];
      const xclientapp = 'web'; 
      $.ajax({
        url: 'https://www.thredup.com/v2.0/carts/mine/remove_coupon',
        type: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        'x-tup-visitor-id': xtupvisitorid,
        'x-client-app': xclientapp,
        'x-tup-guid' : guid,
        'tuppt': tuppt,
        'auth-token': authtoken,
        },
        data: JSON.stringify({
          shippingOptionId:shippingOptionId                
        }),
          success: (response) => { callback(); },
          error: (response) => { callback(); }
      }); 
    },
    preApplyCodes: function(callback) {
      const elTotal = $('#root .u-font-weight-bold.u-flex div:contains("Total")+, #js-shop-app-root .flex.checkout__LineItem.checkout__LineItem__large.uppercase div:contains("Total")+, #root .u-font-weight-bold div:contains("Total") +, #root .u-font-bold.u-flex.u-justify-between div:contains("Total") +');
      const prevValue = elTotal.length > 0 ? 
                        convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      const prevCode = $('#root input#promo, #js-shop-app-root input#promo_code').val();
      if(prevCode != ''){
        this.removePrevCode(prevCode, () => callback(prevValue,prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      var shippingOptionId='1';
      const xtupvisitorid = decodeURI(document.cookie.split(';').filter(function(c) { return c.indexOf('visitor_id') !== -1 })[0]).trim().split('=')[1];
      const authtoken = decodeURI(document.cookie.split(';').filter(function(c) { return c.indexOf('tup_jwt_token') !== -1 })[0]).trim().split('=')[1];
      const tuppt = decodeURI(document.cookie.split(';').filter(function(c) { return c.indexOf('tuppt') !== -1 })[0]).trim().split('=')[1];
      const guid = decodeURI(document.cookie.split(';').filter(function(c) { return c.indexOf('guid') !== -1 })[0]).trim().split('=')[1];
      const xclientapp = 'web'; 
      $.ajax({
        url: 'https://www.thredup.com/v2.0/carts/mine/add_coupon',
        type: 'PUT',              
        headers: {
        'Content-Type': 'application/json',
        'x-tup-visitor-id': xtupvisitorid,
        'x-client-app': xclientapp,
        'x-tup-guid' : guid,
        'tuppt': tuppt,
        'auth-token': authtoken,
        },
        data: JSON.stringify({
           code : code, shippingOptionId: shippingOptionId
        }),
        success: (response) => {
          if(response.cart.cart_totals){                  
            const value = (response.cart.cart_totals.amount_charged)/100;
            callback(value.toFixed(2));
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        },
        error: (xhr, status, error) => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'tvc-mall': {
    id: 23667,
    removePrevCode: function(code, callback) {
      const orderId = $('#orderItemsList').attr('data-orderid');
      $.ajax({
        url: 'https://www.tvc-mall.com/AppService/OrderDiscount/CancelDiscount?UserID=%7BuserId%7D&OrderID='+orderId,
        type: 'GET',
          success: (response) => { callback(); },
          error: (response) => { callback(); }
      }); 
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.order-amount');
      const prevValue = elTotal.length > 0 ? 
                        convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('[data-type="remove-coupon"]');
      if(prevCodeSelector){
        const prevCode = $('[data-type="remove-coupon"]').attr('data-code');
        this.removePrevCode(prevCode, () => callback(prevValue,prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      const orderId = $('#orderItemsList').attr('data-orderid');
      $.ajax({
        url: 'https://www.tvc-mall.com/AppService/OrderDiscount/ApplyCoupon?UserId=%7BuserId%7D&OrderID='+orderId+'&CouponCode='+code,
        type: 'GET',
        success: (response) => {
          $.ajax({
            url: 'https://www.tvc-mall.com/Order/OrderInfo/'+orderId,
            type: 'GET',
            success: (responseget) => {
              const elTotal = $(responseget).find('.order-amount');
              const value = elTotal.length > 0 ? 
                            convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                            Number.POSITIVE_INFINITY; 
              callback(value);
            },
            error: () => { callback(Number.POSITIVE_INFINITY); }
          });
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'viking-direct': {
    id: 8457,
    removePrevCode: function(code, callback) {
      const CSRFToken = $('input[name="CSRFToken"]').val();
      $.ajax({
        url: 'https://www.viking-direct.co.uk/ajax/voucher/remove-voucher',
        type: 'POST',
        headers: {
                  'CSRFToken': CSRFToken
                },
        data : { voucherCode : code },
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const orderValueEl = $('#orderTotals #total');
      const prevValue = orderValueEl.length > 0 ? 
                    convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('#cartVoucherApplied');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.innerText;
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));       
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {      
      this._applyCode(bestCode, function(value) {
        location.reload();
      });  
    },
    _applyCode: (code, callback) => {
      const CSRFToken = $('input[name="CSRFToken"]').val();
      $.ajax({
        url: 'https://www.viking-direct.co.uk/ajax/voucher/apply-voucher',
        type: 'POST',
        headers: {
                  'CSRFToken': CSRFToken
                },
        data : { voucherCode : code },
        success: (response) => {
          const elTotal = $(response).find('#total');
          const value = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
          callback(value);          
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  coolhockey: {
    id: 32750,
    removePrevCode: function(code, callback) {
      if(window.location.href.indexOf("cart") > -1){
        const url = $('#discount-coupon-form').attr('action');
        const form_key = $('[name="form_key"]').val();
        $.post(url, { remove: 1, coupon_code: code, form_key: form_key }, 
        (response) => {  callback(); }).fail(function() { callback(); });
      }else{
        const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
        const quoteId = windowVariables["window.checkoutConfig"].quoteId;
        const customerData = windowVariables["window.checkoutConfig"].customerData;
        const storeCode = windowVariables["window.checkoutConfig"].storeCode
        var url;
        if(customerData.id){
          url = 'https://www.coolhockey.com/'+storeCode+'/rest/'+storeCode+'/V1/carts/mine/coupons';
        }else{
          url = 'https://www.coolhockey.com/'+storeCode+'/rest/'+storeCode+'/V1/guest-carts/'+quoteId+'/coupons';
        }
        $.ajax({
          url: url,
          type: 'DELETE',
          success: (response) => { callback(); },
          error: (response) => { callback(); }
        });
      }           
    },
    preApplyCodes: function(callback) {
      const elTotal = $('[data-th="Order Total"] .price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#coupon_code, #discount-code').val();
      if(prevCode != ''){
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
      if(window.location.href.indexOf("cart") > -1){
        $.get('https://www.coolhockey.com'+window.location.pathname, (responseGet) => {
            const checkoutconfigindex = responseGet.indexOf("window.checkoutConfig");
            const customerDataindex = responseGet.indexOf("window.customerData");
            const finalIndex = customerDataindex-checkoutconfigindex;
            const data = JSON.parse(responseGet.substr(responseGet.indexOf("window.checkoutConfig")+24, finalIndex-38));
            const value = data.totalsData.base_grand_total;
            this.removePrevCode(code, () => callback(value));
          });
       }else{
        const ts = Math.round(new Date().getTime());
        const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
        const quoteId = windowVariables["window.checkoutConfig"].quoteId;
        const customerData = windowVariables["window.checkoutConfig"].customerData;
        const storeCode = windowVariables["window.checkoutConfig"].storeCode
        var url;
        if(customerData.id){
          url = 'https://www.coolhockey.com/'+storeCode+'/rest/'+storeCode+'/carts/mine/payment-information?_='+ts;
        }else{
          url = 'https://www.coolhockey.com/'+storeCode+'/rest/'+storeCode+'/guest-carts/'+quoteId+'/payment-information?_='+ts;
        }
        $.ajax({
            url: url,
            type: 'GET',
            success: (response) => {                  
               const value = response.totals.base_grand_total;
               callback(value.toFixed(2));
            },error: () => { callback(Number.POSITIVE_INFINITY); }
          });
       }   
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
        location.reload();
      }) ;
    },
    _applyCode: (code, callback) => {
      if(window.location.href.indexOf("cart") > -1){
        const url = $('#discount-coupon-form').attr('action');
        const form_key = $('[name="form_key"]').val();
        $.ajax({
          url: url,
          type: 'POST',
          data: { remove: 0, coupon_code: code, form_key:form_key },
          success: () => { callback(); },
          error: () => { callback(); }
        });
      }else{
        const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
        const quoteId = windowVariables["window.checkoutConfig"].quoteId;
        const customerData = windowVariables["window.checkoutConfig"].customerData;
        const storeCode = windowVariables["window.checkoutConfig"].storeCode
        var url;
        if(customerData.id){
          url = 'https://www.coolhockey.com/'+storeCode+'/rest/'+storeCode+'/V1/carts/mine/coupons/'+code;
        }else{
          url = 'https://www.coolhockey.com/'+storeCode+'/rest/'+storeCode+'/V1/guest-carts/'+quoteId+'/coupons/'+code;
        }
        $.ajax({
          url: url,
          type: 'PUT',
          success: () => { callback(); },
          error: () => { callback(); }
        });
      }
    },
  },

  'philips_uk': {
    id: 11894,
    removePrevCode: function(code, callback) {
      const formData = getFormFieldsAsJson(document.querySelector('#voucherForm'));
      formData['removeVoucherCode'] = code;
      const url = $('#voucherForm').attr('action');
      $.ajax({
        url : 'https://'+window.location.hostname+'/shop/cart/removeVoucher',
        type : 'POST',
        data : formData,
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const orderValueEl = $('#tagging-price');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('.ph-applied-vouchers__item__code');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.innerText;
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }  
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      }.bind(this));  
    },
    _applyCode: (code, callback) => {
      const formData = getFormFieldsAsJson(document.querySelector('#voucherForm'));
      formData['voucherText'] = code;
      const url = $('#voucherForm').attr('action');
      $.ajax({
        url: 'https://'+window.location.hostname+url,
        type: 'POST',
        data: formData,
        success:  (data, textStatus, request1) => {
          $.get(location.href, 
            (responseget) => {
              const elTotal = $(responseget).find('#tagging-price');
              const value = elTotal.length > 0 ? 
                        convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY; 
              callback(value);
          }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
          }); 
         },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });    
    }
  },

  'appliancesconnection': {
    id: 5421,
    preApplyCodes: function(callback) { 
      const orderValueEl = $('.total-price');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      callback(prevValue);  
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      }.bind(this));  
    },
    _applyCode: (code, callback) => {
      const url = $('#mainform').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#mainform'));
      formData['promo_code'] = code;
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success:  (data, textStatus, request1) => {
          $.get(location.href, 
            (responseget) => {
              const elTotal = $(responseget).find('.total-price');
              const value = elTotal.length > 0 ? 
                            convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                            Number.POSITIVE_INFINITY; 
              callback(value);
          }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
          }); 
         },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });    
    },
  },

  balibras: {
    id: 44883,
    preApplyCodes: function(callback) {
      const elTotal = $('#cart-totals .price.bfx-price.bfx-total-grandtotal, tr.grand.totals');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      this.totalBefore = prevValue;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      const self = this;
      if (!self.codes) {
        self.codes = [];
      }
      self.codes.push(code);
      const couponCodes = self.codes;
      const url = $('#discount-coupon-form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#discount-coupon-form'));
      formData['coupon_code_fake'] = code;
      formData['coupon_code'] = couponCodes.join();
      formData['last_code'] = code;
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: () => {
          $.get('https://'+window.location.hostname+window.location.pathname, (responseGet) => {
            const checkoutconfigindex = responseGet.indexOf("window.checkoutConfig");
            const customerDataindex = responseGet.indexOf("window.isCustomerLoggedIn");
            const finalIndex = customerDataindex-checkoutconfigindex;
            const data = JSON.parse(responseGet.substr(responseGet.indexOf("window.checkoutConfig")+23, finalIndex-107));
            const value = data.totalsData.base_grand_total;
            callback(value);              
          });
        },
        error: (xhr, status, error) => {
           callback(Number.POSITIVE_INFINITY);
        }
      });
    },
    applyBestCode: function(bestCode) {
      location.reload();
    }
  },
  
  'bakemeawish': {
    id: 3770,
    preApplyCodes: function(callback) { 
      const orderValueEl = $('.cart-contents table:last-of-type tbody tr:last-child .price');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      callback(prevValue);  
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('[name="promo_code"]').value = bestCode;
      document.querySelector('[name="promo_code"]').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('[name="promo_code"]').dispatchEvent(new Event('change'));
      $(".form-promo-code [type='submit']").click();
    },
    _applyCode: (code, callback) => {
      const url = $('[name="promoform"]').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('[name="promoform"]'));
      formData['promo_code'] = code;
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success:  (data, textStatus, request1) => {
          $.get(location.href, 
            (responseget) => {
              const elTotal = $(responseget).find('.cart-contents table:last-of-type tbody tr:last-child .price');
              const value = elTotal.length > 0 ? 
                            convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                            Number.POSITIVE_INFINITY; 
              callback(value);
          }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
          }); 
         },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });    
    },
  },

  rockport: {
    removePrevCode: function(prevCodeUrl, callback) {
      if(document.querySelector('.pt_cart')){
        const url = $('.cart-coupons-form').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('.cart-coupons-form'));
        formData['dwfrm_cart_coupons_i0_deleteCoupon'] = 'Remove';
        $.post(url, formData, 
        (response) => {
          callback();
        }).fail(function() {
          callback();
        });
      }else{
        $.get(prevCodeUrl+'&format=ajax', 
        (response) => {
          callback();
        }).fail(function() {
          callback();
        });         
      }
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.cart-right .order-total .order-value, .onepage-summary .order-total .order-value');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('.remove.coupon-remove');
      if(prevCodeSelector){
        const prevCodeUrl = $('.remove.coupon-remove').attr('href');
        this.removePrevCode(prevCodeUrl, () => callback(prevValue));
      }else{
        callback(prevValue)
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       if(document.querySelector('.pt_cart')){
          this.removePrevCode(code, () => callback(value));
        }else{
          $.get(location.href, (response) => {
            const removeUrlSelector = $(response).find('.remove.coupon-remove');
            if(removeUrlSelector.length > 0 ){
              const prevCodeUrl = $(response).find('.remove.coupon-remove').attr('href');
              this.removePrevCode(prevCodeUrl, () => callback(value));
            }else{
              callback(value);
            }        
          });
        }
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });
    },
    _applyCode: (code, callback) => {
      if(document.querySelector('.pt_cart')){
        const url = $('.cart-coupons-form').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('.cart-coupons-form'));
        formData['dwfrm_cart_couponCode'] = code;
        formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
        $.post(url, formData, 
        (responsePost) => {
          const orderValueEl = $(responsePost).find('.cart-right .order-total .order-value');
          const value = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;  
          callback(value);
        }).fail(function() {
          callback(Number.POSITIVE_INFINITY);
        }); 
      }else{
        const url = $('#summary-coupon-form').attr('action');
        $.post('https://www.rockport.com'+url+'?onepageentry=true&format=ajax', {couponCode : code}, 
        (responsePost) => {
          const orderValueEl = $(responsePost).find('.order-total .order-value');
          const value = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;  
          callback(value);
        }).fail(function() {
          callback(Number.POSITIVE_INFINITY);
        }); 
      }    
    },
  },

  misspap: {
    removePrevCode: function(code, callback) {
      const windowVariables = retrieveWindowVariables(["window.Urls"]);
      const removeCouponUrl = windowVariables["window.Urls"].removeCoupon;
      $.ajax({
        url: removeCouponUrl+'?couponID='+code,
        type: 'GET',
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = document.querySelector('.js-checkout-order-totals .order-total .order-value').innerText;
      const prevValue = convertNumbers(elTotal.replace(/[^0-9.,]/g, '').trim());
      const prevCodeSelector = document.querySelector('#remove-coupon');
      if(prevCodeSelector){
        const prevCode = $('#remove-coupon').attr('data-coupon');
        this.removePrevCode(prevCode, () => callback(prevValue));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        $.get(location.href, 
          (response) => {
            const orderValueEl = $(response).find('.js-checkout-order-totals .order-total .order-value');
            const value = orderValueEl.length > 0 ? 
                    convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
            this.removePrevCode(code, () => callback(value));
        }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
        });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#dwfrm_billing_couponCode').value = bestCode;
      document.querySelector('#dwfrm_billing_couponCode').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('#dwfrm_billing_couponCode').dispatchEvent(new Event('change'));
      document.querySelector("#add-coupon").click();  
    },
    _applyCode: (code, callback) => {
      const windowVariables = retrieveWindowVariables(["window.Urls"]);
      const addCouponUrl = windowVariables["window.Urls"].addCoupon;
      $.ajax({
        url: addCouponUrl+'?couponCode='+code+'&format=ajax',
        type: 'POST',
        success: (response) => { callback(); },
        error: () => { callback(); }
      });
    },
  },

  focuscamera: {
    removePrevCode: function(code, callback) {
      const windowVariables = retrieveWindowVariables(["window.NREUM"]);
      const xpid = windowVariables["window.NREUM"].loader_config.xpid;
      const url = 'https://www.focuscamera.com/awesomecheckout/discount/apply';
      $.ajax({
          url: url,
          type: 'POST',
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-newrelic-id': xpid
          },
          data: {
            remove: '1',
          },
          success: () => {callback();}, error: () => {callback();}
        })
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('#shopping-cart-totals-table tfoot strong span.price, .grand_total td:last-child .update');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#discount_code').val();
      if(prevCode != ''){         
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#discount_code').value = bestCode;
      document.querySelector('#discount_code').dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('#discount_code').dispatchEvent(new Event('keyup'));
      document.querySelector('#discount_code').dispatchEvent(new Event('blur'));
      document.querySelector('#discount_code').dispatchEvent(new Event('focus'));
      document.querySelector('#discount-coupon-form fieldset button[value="Apply"], [name="add_couponaction"], [value="Apply Coupon"]').click();  
    },
    _applyCode: (code, callback) => {      
     const windowVariables = retrieveWindowVariables(["window.NREUM"]);
      const xpid = windowVariables["window.NREUM"].loader_config.xpid;
      const url = 'https://www.focuscamera.com/awesomecheckout/discount/apply';
      $.ajax({
          url: url,
          type: 'POST',
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-newrelic-id': xpid
          },
        data: {discount_code: code},
        success: (response, status, xhr) => {
          if(response.totals){
            const basket = response.totals;
            const orderValueEl = $(basket).find('tfoot strong span.price, .grand_total td:last-child .update');
            const value = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
            callback(value);
          }else{
            callback(Number.POSITIVE_INFINITY);
          }          
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });    
    },
  },

  hokaoneone: {
    id: 26184,
    removePrevCode: function(code,prevCodeUuid, callback) {
       const removeUrl = $('[data-js="removeCouponLineItem"]').attr('data-action');
       $.get('https://www.hokaoneone.com'+removeUrl+'?code='+code+'&uuid='+prevCodeUuid, 
        (response) => { callback(); }).fail(function() {  callback(); }); 
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.grand-total');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('#promoFormDisplay .coupon-code');          
      if(prevCodeSelector){
        const prevCode = $('#promoFormDisplay .coupon-code .remove-coupon').attr('data-code');
        const prevCodeUuid = $('#promoFormDisplay .coupon-code .remove-coupon').attr('data-uuid');
        this.removePrevCode(prevCode, prevCodeUuid, () => callback(prevValue, prevCode));
      }else{        
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {        
      const csrf_token = $('input[name="csrf_token"]').val();
      const url = $('[data-js="submitCouponCodeUrl"]').attr('data-action');     
       $.get('https://www.hokaoneone.com'+url+'?csrf_token='+csrf_token+'&couponCode='+code, 
        (response) => {
          if(response.totals){
            const value = response.totals.grandTotal;
            const totalValue = convertNumbers(value.replace( /[^0-9.,]/g, '').trim());                
            const uuid =  response.totals.discounts[0].UUID;
            this.removePrevCode(code,uuid, () => callback(totalValue));
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        }).fail(function() {  callback(Number.POSITIVE_INFINITY); }); 
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#couponCode').value = bestCode;
      document.querySelector('#couponCode').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('.promo-code-btn').click();
    }
  },

  istockphoto: {
    id: 3901,
    removePrevCode: function(code, callback) {
      const csrf = $('meta[name="csrf-token"]').attr('content');
      $.ajax({
        url: 'https://www.istockphoto.com/purchase/promo_codes/delete',
        type: 'POST',
         headers: {
          'x-csrf-token': csrf
        },
        success: () => { callback(); },
        error: () => { callback(); }
      }) 
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.order_total .uni-money');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#promo_code_form input[type="text"]').val();
      if(prevCode != ''){
         this.removePrevCode(prevCode, () => callback(prevValue, prevCode));       
      }else{        
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {        
      const csrf = $('meta[name="csrf-token"]').attr('content');    
      $.ajax({
        url: 'https://www.istockphoto.com/purchase/promo_codes',
        type: 'POST',
        data: {promo_code: code},
         headers: {
          'x-csrf-token': csrf
        },
        success: () => {
          $.ajax({
            url: 'https://www.istockphoto.com/purchase/cart.json?sortBy=DateAddedToCart&count=1&start=1&forCheckout=true',
            type: 'GET',
             headers: {
              'x-csrf-token': csrf
            },
            success: (response) => {
              const value = response.totals.total.amount;
              this.removePrevCode(code, () => callback(value));              
             },
            error: () => { const value = Number.POSITIVE_INFINITY;
              this.removePrevCode(code, () => callback(value)); }
          }) 
         },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      }) 
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#promo_code_form input[type="text"]').value = bestCode;
      document.querySelector('#promo_code_form input[type="text"]').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('#promo_code_form button[type="button"]').click();
    }
  },

  teespring: {
    removePrevCode: function(code, callback) {
      const csrf = $('meta[name="_csrf"]').attr('content');
      const country = $('#new_order_form_shipping_attributes_country').val();
      const state = $('#new_order_form_shipping_attributes_state').val();
      const zip = $('#new_order_form_shipping_attributes_zip').val();
      const currency = 'USD';
      const date = new Date();
      const order_lookup_numbers = $('.order_summary_items').attr('data-order-lookup-number');
      const url = 'https://teespring.com/order_costs.json?country='+country+'&state='+state+'&zip='+zip+'&currency=USD&date='+date+'&promo_code=tee&use_base_cost=false&order_lookup_numbers%5B%5D='+order_lookup_numbers;
      $.ajax({
        url: url,
        type: 'GET',
         headers: {
          'x-csrf-token': csrf
        },
        success: () => { callback();
        },
        error: () => { callback(); }
      }) 
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.order_summary__total[data-type="total"]');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#new_order_form_promo_code').val();
      if(prevCode != ''){
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#new_order_form_promo_code').value = bestCode;
      document.querySelector('#new_order_form_promo_code').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('#promo_code_apply').click();  
    },
    _applyCode: (code, callback) => {      
      const csrf = $('meta[name="_csrf"]').attr('content');
      const country = $('#new_order_form_shipping_attributes_country').val();
      const state = $('#new_order_form_shipping_attributes_state').val();
      const zip = $('#new_order_form_shipping_attributes_zip').val();
      const currency = 'USD';
      const date = new Date();
      const order_lookup_numbers = $('.order_summary_items').attr('data-order-lookup-number');
      const url = 'https://teespring.com/order_costs.json?country='+country+'&state='+state+'&zip='+zip+'&currency=USD&date='+date+'&promo_code='+code+'&use_base_cost=false&order_lookup_numbers%5B%5D='+order_lookup_numbers;
      $.ajax({
        url: url,
        type: 'GET',
         headers: {
          'x-csrf-token': csrf
        },
        success: (response) => { 
          const value = response.summary.total_price;
          callback(value);
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      })    
    },
  },

  corsair: {
    id: 30464, 
    preApplyCodes: function(callback) {
      const elTotal = $('.totals span:last');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      const csrfToken = $('[name="CSRFToken"]').val();
      $.ajax({
        url: 'https://www.corsair.com/us/en/corsaircheckout/apply',
        type: 'POST',
        data: {
          CSRFToken: csrfToken,
          code: code
        },
        success: (data, textStatus, request) => {
          const locationUrl = window.location.href;
          $.get(locationUrl , (responseGet) => {
            const orderValueEl = $(responseGet).find('.totals span:last');
            const value = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
            callback(value);
          }).fail(function() {  callback(Number.POSITIVE_INFINITY); }); 
        },
        error: (xhr, status, error) => {
           callback(Number.POSITIVE_INFINITY);
        }
      });
    },
    applyBestCode: (bestCode) => {
      location.reload(); 
    }
  },

  avery: {
    id: 29701,
    removePrevCode: function(code, callback) {
      $.ajax({
        url: 'https://cart.avery.com/index.php/amcoupons/checkout/cancelCoupon/',
        type: 'POST',
        data: {
          amcoupon_code_cancel: code
        },
        success: () => { callback(); },
        error: () => {  callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('#total .price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('[name="amcoupon_code_cancel"]');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.value;
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      const url = $('#discount-coupon-form').attr('action');
      $.ajax({
        url: url,
        type: 'POST',
        data: {
          remove: 0,
          coupon_code: code
        },
        success: (data, textStatus, request) => {
          const locationUrl = request.getResponseHeader('location');
          $.get(locationUrl, (responseGet) => {
            const elTotal = $(responseGet).find('#total .price');
            var value = 0;
            if( elTotal.length > 0 ){
               $( elTotal ).each(function( index ) {
                value += convertNumbers($( this ).text().replace( /[^0-9.,]/g, '').trim());                
               });
            }else{
                value = Number.POSITIVE_INFINITY;
            }              
            this.removePrevCode(code, () => callback(value));
          }).fail(function() {  callback(Number.POSITIVE_INFINITY); }); 
        },
        error: (xhr, status, error) => {
           callback(Number.POSITIVE_INFINITY);
        }
      });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#coupon_code').value = bestCode;
      document.querySelector('#coupon_code').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
      document.querySelector('#discount-coupon-form span a').click();  
    }
  },

  wiley: {
    removePrevCode: function(code, callback) {
      const formData = getFormFieldsAsJson(document.querySelector('#applyVoucherForm'));
      formData['discountCode'] = code;
      $.post('https://www.wiley.com/en-us/cart/voucher/remove', formData, 
        (response) => { callback(); }).fail(function() { callback(); });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('#orderTotalRow #amount');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('#js-applied-vouchers [name="discountCode"]');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.value;
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      const url = $('#applyVoucherForm').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#applyVoucherForm'));
      formData['discountCode'] = code;
      $.ajax({
        url: 'https://www.wiley.com'+url,
        type: 'POST',
        data: formData,
        success: (data, textStatus, request) => {
          const locationUrl = request.getResponseHeader('location');
          $.get(locationUrl, (responseGet) => {
            const orderValueEl = $(responseGet).find('#orderTotalRow #amount');
            const value = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;              
            this.removePrevCode(code, () => callback(value));
          }).fail(function() {
            callback(Number.POSITIVE_INFINITY); 
          }); 
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#js-voucher-code-text').value = bestCode;
      document.querySelector('#js-voucher-code-text').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('#js-voucher-apply-btn').click();
    }
  },

  urbandecay: {
    id: 5472,
    removePrevCode: function(code, callback) {
      var formData = {};
      formData['coupon_remove_'+code] = code
      const url = $('.c-form.m-reset.c-cart-coupon__form').attr('action');
      $.ajax({
        url: url+'?ajax=true',
        type: 'POST',
        data: formData,
        success: () => { callback(); },
        error: () => { callback(); }
      });   
    },
    preApplyCodes: function(callback) { 
      const elTotal = document.querySelector('.c-cart-summary-table .m-total .m-value').innerText;
      const prevValue = elTotal.replace(/[^0-9.,]/g, '').trim();
      const prevCodeSelector = document.querySelector('.c-cart-coupon__list-remove');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.value;
        const prevCodeName = prevCodeSelector.getAttribute('name');
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
      this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => { 
      const url = $('.c-form.m-reset.c-cart-coupon__form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('.c-form.m-reset.c-cart-coupon__form'));
      formData['couponcode'] = code;
      $.post(url+'?ajax=true', formData, 
      (responsePost) => {
        const orderValueEl = $(responsePost).find('.c-cart-summary-table .m-total .m-value');
        const value = orderValueEl.length > 0 ? 
                    convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY; 
        callback(value);
      }).fail(function() { callback(Number.POSITIVE_INFINITY); }); 
    },
  },

  garmin: {
    id: 13134,
    removePrevCode: function(code, callback) {
      const cartId = getCookie('GarminCart');
      const url = 'https://buy.garmin.com/cart/api/cartServices/removePromotionFromCart/?cartId='+cartId+'&promoCode='+code;
      $.ajax({
        url: url,
        type: 'DELETE',
        success: () => { callback(); },
        error: () => { callback(); }
      });   
    },
    preApplyCodes: function(callback) { 
      const elTotal = document.querySelector('#cartTotalValue .amount, #order-cost-summary-estimatedTotalValue, .order_totals tfoot .order_price').innerText;
      const prevValue = convertNumbers(elTotal.replace(/[^0-9.,]/g, '').trim());
      const prevCodeSelector = document.querySelector('span.promotions__promotion__code');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.innerText;
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => { 
      const cartId = getCookie('GarminCart');
      const locale = getCookie('GarminUserPrefs');
      const url = 'https://buy.garmin.com/cart/api/cartServices/addPromotionToCartByCartId/?cartId='+cartId+'&promoCode='+code;
      $.post(url, 
      (responsePost) => {
       $.get('https://buy.garmin.com/cart/api/cartServices/getPricedCartByCartId/?cartId='+cartId+'&locale='+locale, 
        (responseGet) => {
          const value = responseGet.body.estimatedTotal; 
          callback(value);
        }).fail(function() { callback(Number.POSITIVE_INFINITY); }); 
      }).fail(function() { callback(Number.POSITIVE_INFINITY); }); 
    },
  },

  luisaviaroma: {
    id: 5225,
    removePrevCode: function(code, callback) {
      const url = 'https://www.luisaviaroma.com/myarea/bag/removepromo';
      $.ajax({
        url: url,
        type: 'POST',
        headers: {
                'x-lvr-requested-with': 'bag/removepromo',
                'content-type': 'application/json'
                },
        data: JSON.stringify({IsMobile: false, PopulateExtraInfo: false, PopulateTrackingInfo: true}),
        success: ( ) => { callback(); },
        error: () => { callback(); }
      });   
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('#bsk_totaldiv > div:last-child > div:nth-child(3) > div:last-child > div:first-child');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#promo-code-input').val();
      if(prevCode != ''){ 
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      setTimeout(function(){
       this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
       }.bind(this));
      }.bind(this), 2000);
    },
    applyBestCode: function(bestCode) {
      setTimeout(function(){
        this._applyCode(bestCode, function(value) {
          location.reload();
        });
      }.bind(this), 2000);         
    },
    _applyCode: (code, callback) => { 
      const url = 'https://www.luisaviaroma.com/myarea/bag/addpromo';
      $.ajax({
        url: url,
        type: 'POST',
        headers: {
                'x-lvr-requested-with': 'bag/addpromo',
                'content-type': 'application/json'
                },
        data: JSON.stringify({Code: code, IsMobile: false, PopulateExtraInfo: false, PopulateTrackingInfo: true}),
        success: (response) => {
          if(response.status == '200'){
            const data = JSON.parse(response.responseText);
            const value = data.ListResponse.OrderInfo.TotalToPay;
            callback(value);
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
         },
        error: (response) => {
          if(response.status == '200'){
            const data = JSON.parse(response.responseText);
            const value = data.ListResponse.OrderInfo.TotalToPay;
            callback(value);
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
         }
      }); 
    },
  },

  dressinn: {
    preApplyCodes: function(callback) {
      const elTotal = $('#importe_total');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
      }) ;
    },
    applyBestCode: function(bestCode) {
      document.querySelector('.c-escribir-codigo').value = bestCode;
      document.querySelector('.c-escribir-codigo').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('.c-btn-codigo').click();
    },
    _applyCode: (code, callback) => {      
      const url = $('.c-zona-codigo').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('.c-zona-codigo'));
      formData['codigo_promocional'] = code;      
      $.ajax({
        url: 'https://www.dressinn.com/'+url,
        type: 'POST',
        data: formData,
        success: (response, status, xhr) => {
          const total = $(response).find('#importe_total'); 
          const value = total.length > 0 ? 
                    convertNumbers(total.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
            callback(value);
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });    
    }
  },

  apply_landsend_business: {
    id: 13293,
    removePrevCode: function(code, callback) {
      const url = 'https://business.landsend.com/cart/promo/removePromoCode';
      const csrfToken = getCookie('XSRF-TOKEN');
      $.ajax({
        url: url,
        type: 'POST',
        headers: {
                'X-XSRF-TOKEN': csrfToken,
                'content-type': 'application/json'
                },
        data: JSON.stringify({}),
        success: ( ) => { callback(); },
        error: () => { callback(); }
      });   
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.total-price-data .price-amount');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('#removePromo');
      if(prevCodeSelector){ 
        this.removePrevCode('prevCode', () => callback(prevValue));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      const url = 'https://business.landsend.com/checkout/promo/setPromoCode';
      const csrfToken = getCookie('XSRF-TOKEN');
      $.ajax({
        url: url,
        type: 'POST',
        headers: {
                'X-XSRF-TOKEN': csrfToken,
                'content-type': 'application/json'
                },
        data: JSON.stringify({code: code}),
        success: (response) => {
         const value = response.totalPrice.value;
         callback(value); },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'net-a-porter': {
    id: 6606,
    preApplyCodes: function(callback) { 
      const elTotal = $('.checkout-total-text');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);     
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      const url = $('#giftVoucherForm').attr('action');
      const csrfToken = getCookie('XSRF-TOKEN');
      const formData = getFormFieldsAsJson(document.querySelector('#giftVoucherForm'));
      formData['promotionalCode'] = code;
      $.ajax({
        url: 'https://www.net-a-porter.com'+url,
        type: 'POST',
        data: formData,
        success: (data, textStatus, request) => {
         const getUrl = request.getResponseHeader('location');
         $.get(getUrl, (responseget) => {
              const elTotal = $(responseget).find('.checkout-total-text');
              const value = elTotal.length > 0 ? 
                          convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY; 
              callback(value);
         }).fail(function() { callback(Number.POSITIVE_INFINITY); });
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  casetify : {
    id: 25511,
    preApplyCodes: function(callback) { 
      const elTotal = $('.total-price:not(:contains(£0)), td:contains(Total) ~ td:not(:contains(£0)),.total-price:not(:contains($0)), td:contains(Total) ~ td:not(:contains($0))');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);     
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      try {
        document.querySelector('.summary-container input.form-control-lg.uppercase').value = bestCode;   
        document.querySelector('.summary-container input.form-control-lg.uppercase').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('.summary-container input.form-control-lg.uppercase').dispatchEvent(new Event('change'));
        document.querySelector('.no-break button.btn-dark.uppercase').click(); 
      } catch (e) {   
        document.querySelector(' .summary-container input.form-control-lg.uppercase').value = bestCode; 
        jQuery('#submit-btn').click(); 
      }   
    },
    _applyCode: (code, callback) => {
      $.ajax({
        url: 'https://www.casetify.com/controllers/Checkout.php?fn=validateCodeType&code='+code,
        type: 'GET',
        success: (data, textStatus, request) => {
         const getUrl = 'https://www.casetify.com/controllers/Checkout.php?fn=getCheckoutSummary&giftCardAction=add&saveVoucher=Y&saveGiftCard=Y&useCredit=N&voucherCode='+code;
         $.get(getUrl, (responseget) => {
            const value = responseget.data.total;
            callback(value);
         }).fail(function() { callback(Number.POSITIVE_INFINITY); });
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  alamy: {
    id: 27950,
    removePrevCode: function(code, callback) {
      const url = 'https://www.alamy.com/purchase/Commonfunctions.asmx/RemovePromotionAppied';
      const orderID = $('#orderID').val();
      $.ajax({
        url: url,
        type: 'POST',
        data: {orderID : orderID },
        success: ( ) => { callback(); },
        error: () => { callback(); }
      });   
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('#Total strong');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('#removepromocode');
      if(prevCodeSelector){ 
        this.removePrevCode('prevCode', () => callback(prevValue));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      const url = 'https://www.alamy.com/purchase/Commonfunctions.asmx/Applypromocode';
      const OrderID = $('#orderID').val();
      const currencyCode = $('#currencyCode').val();
      const UserID = $('#userID').val();
      const ts = Math.round(new Date().getTime());
      $.ajax({
        url: url,
        type: 'POST',
        data: {Promocode: code, UserID : UserID, OrderID : OrderID },
        success: (response) => {
          $.ajax({
            url: 'https://www.alamy.com/purchase/Commonfunctions.asmx/GetOrderDetails',
            type: 'GET',
            data: {userID: UserID, 
                    Onload: 0,
                    Accountno: '',
                    shortAccountNo: '',
                    ccNo: 'add a credit card',
                    expiryMnth: '',
                    expiryYear: '',
                    ccType: '',
                    currencyCode: currencyCode,
                    Billingcountryid: '',
                    Useremail: '',
                    isUkVatEnabled: 0,
                    IsPackOrder: 0,
                    OrderID: OrderID,
                    t: ts },
            success: (responseGet) => {
             const value = responseGet.data.Table[0].ORD_TOT;
             callback(value); },
            error: () => { callback(Number.POSITIVE_INFINITY); }
          });
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  boohooman: {
    id : 29320,
    removePrevCode: function(code, callback) {
      const windowVariables = retrieveWindowVariables(["window.Urls"]);
      const removeCouponUrl = windowVariables["window.Urls"].removeCoupon;
      $.ajax({
        url: removeCouponUrl+'?couponID='+code,
        type: 'GET',
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.order-total .order-value');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('#remove-coupon');
      if(prevCodeSelector){
        const prevCode = $('#remove-coupon').attr('data-coupon');
        this.removePrevCode(prevCode, () => callback(prevValue));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        $.get(location.href, 
          (response) => {
            const orderValueEl = $(response).find('.order-total .order-value');
            const value = orderValueEl.length > 0 ? 
                    convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY; 
            this.removePrevCode(code, () => callback(value));
        }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
        });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#dwfrm_billing_couponCode').value = bestCode;
      document.querySelector('#dwfrm_billing_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('#add-coupon').click();   
    },
    _applyCode: (code, callback) => {
      const windowVariables = retrieveWindowVariables(["window.Urls"]);
      const addCouponUrl = windowVariables["window.Urls"].addCoupon;
      $.ajax({
        url: addCouponUrl+'?couponCode='+code+'&format=ajax',
        type: 'POST',
        success: (response) => { callback(); },
        error: () => { callback(); }
      });
    },
  },

  hbx : {
    id: 29641,
    preApplyCodes: function(callback) { 
      const elTotal = $('div.grand-total span.amount');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('div[class*="promotional"] input.form-control').val();
      if(prevCode != ''){
        callback(prevValue,prevCode);
      }else{
        callback(prevValue);
      }           
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('div[class*="promotional"] input.form-control').value = bestCode;
      document.querySelector('div[class*="promotional"] input.form-control').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('div[class*="promotional"] input.form-control').dispatchEvent(new Event('change'));
      document.querySelector('#sticky-sidebar .coupon.promotional button.btn.btn-primary').click();
    },
    _applyCode: (code, callback) => {
      const formData = getFormFieldsAsJson(document.querySelector('#cart-summary form'));
      formData['sylius_cart[promotionCoupons]'] = code;
      $.ajax({
        url: 'https://hbx.com/cart',
        type: 'POST',
        data : formData,
        success: (response) => {
          const orderValueEl = $(response).find('div.grand-total span.amount');
          const value = orderValueEl.length > 0 ? 
                  convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  eastdane: {
    id : 10176,
    removePrevCode: function(code, callback) {
      const csrfToken = $('#csrfToken').attr('data-csrf-token');
      const siteId = $('#site-id').attr('data-site-id');
      const language = $('body').attr('data-lang');
      const currency = $('body').attr('data-currency');
      const amazonSessionId = getCookie('session-id');
      const cartId = getCookie('cartId');
      const visitId = $('#visitid').attr('data-visitid');
      const url = 'https://api.eastdane.com/carts/'+cartId+'?siteId='+siteId+'&lang='+language+'&currency='+currency+'&amazonSessionId='+amazonSessionId+'&visitId='+visitId+'&referrerUrl=';
       $.ajax({
        url: url,
        type: 'POST',
        headers: {
                'X-XSRF-TOKEN': csrfToken,
                'accept': 'application/json',
                'content-type': 'application/json',
                'client-id': 'CartContainer',
                'client-version': 'BrowserApiClient',
                'csrf-token': csrfToken,
                'csrf-value': 'csrfToken',
                },
        data: JSON.stringify({promotionCode: ''}),
        success: (response) => {
         const value = response.total;
         callback(value); },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('[data-at="subtotal"]');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('[data-at="appliedPromoCode"]');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.innerText;
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));   
    },
    _applyCode: (code, callback) => {
      const csrfToken = $('#csrfToken').attr('data-csrf-token');
      const siteId = $('#site-id').attr('data-site-id');
      const language = $('body').attr('data-lang');
      const currency = $('body').attr('data-currency');
      const amazonSessionId = getCookie('session-id');
      const cartId = getCookie('cartId');
      const visitId = $('#visitid').attr('data-visitid');
      const url = 'https://api.eastdane.com/carts/'+cartId+'?siteId='+siteId+'&lang='+language+'&currency='+currency+'&amazonSessionId='+amazonSessionId+'&visitId='+visitId+'&referrerUrl=';
       $.ajax({
        url: url,
        type: 'POST',
        headers: {
                'X-XSRF-TOKEN': csrfToken,
                'accept': 'application/json',
                'content-type': 'application/json',
                'client-id': 'CartContainer',
                'client-version': 'BrowserApiClient',
                'csrf-token': csrfToken,
                'csrf-value': 'csrfToken',
                },
        data: JSON.stringify({promotionCode: code}),
        success: (response) => {
         const value = convertNumbers((response.total).replace( /[^0-9.,]/g, '').trim());
         callback(value); },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'bookdepository' : {
    id: 3489,
    preApplyCodes: function(callback) {
      const elTotal = $('.total dd');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
       callback(prevValue);
    },
    applyCode: function(code, callback) {
      const form = document.querySelector('form#coupons');
      const url = $('form#coupons').attr('action');
      const formData = getFormFieldsAsJson(form);
      formData['couponCode'] = code;
      $.ajax({
        url: 'https://'+window.location.hostname+url,
        type: 'POST',
        data: formData,
        success: (data, textStatus, request) => {
          const locationUrl = request.getResponseHeader('location');
          $.get(locationUrl, 
          (response) => {
            const elTotal = $(response).find('.total dd');
            const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
            callback(value);
          }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
          });
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#couponCode').value = bestCode;
      document.querySelector('#couponCode').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('#couponCode').dispatchEvent(new Event('keyup'));
      document.querySelector('#couponCode').dispatchEvent(new Event('blur')); 
      document.querySelector('#couponCode').dispatchEvent(new Event('focus'));        
      document.querySelector('.btn.btn-default.btn-sm').click()
    }
  },

  simplilearn: {
    id : 10230,
    removePrevCode: function(code, callback) {
      const windowVariables = retrieveWindowVariables(["window.NREUM", "tokenVal"]);
      const xpid = windowVariables["window.NREUM"].loader_config.xpid;
      const tokenVal = windowVariables["tokenVal"];
      const url = 'https://www.simplilearn.com/secure/order/remove-coupon';
       $.ajax({
        url: url,
        type: 'POST',
        headers: {
                'x-newrelic-id': xpid
                },
        data: {method: 'removeCoupon'},
        success: () => { callback();},
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.grand-total-price .grand-totals');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('.coupan-success .discount-price');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.innerText;
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));   
    },
    _applyCode: (code, callback) => {
      const windowVariables = retrieveWindowVariables(["window.NREUM", "tokenVal"]);
      const xpid = windowVariables["window.NREUM"].loader_config.xpid;
      const tokenVal = windowVariables["tokenVal"];
      const url = 'https://www.simplilearn.com/secure/order/apply-coupon';
       $.ajax({
        url: url,
        type: 'POST',
        headers: {
                'x-newrelic-id': xpid
                },
        data: {code: code, authtoken: tokenVal },
        success: (data) => {
          const response = JSON.parse(data);
          if(response.data.general){
            const value = response.data.general.grand_total;
            callback(value);
          }else{
            callback(Number.POSITIVE_INFINITY);
          }          
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  speckproducts: {
    id: 23907,
    preApplyCodes: function(callback) {
      const elTotal = $('.order-total td:last-child');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      if(document.querySelector('form[name="dwfrm_cart"]')){
        const url = $('form[name="dwfrm_cart"]').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('form[name="dwfrm_cart"]'));
        formData['dwfrm_cart_couponCode'] = code;
        formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
        $.ajax({
          url: url,
          type: 'POST',
          data: formData,
          success: (response, status, xhr) => {
            const elTotal = $(response).find('.order-total td:last-child');
            const value = elTotal.length > 0 ? 
                          convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY; 
            callback(value);
          },
          error: (xhr, status, error) => {
            callback(Number.POSITIVE_INFINITY);
          }
        });
      }else{
        const windowVariables = retrieveWindowVariables(["app.urls"]);
        const addCouponUrl = windowVariables["app.urls"].addCoupon;
        $.get(addCouponUrl+'?couponCode='+code+'&format=ajax', (response) => {             
          const value = response.baskettotal;
          callback(value);
        });
      }
    },
    applyBestCode: (bestCode) => {
      location.reload();
    }
  },

  edureka: {
    id: 16927,
    preApplyCodes: function(callback) {
      const elTotal = $(".ord_netval span.pull-right:last-child:has(span:not(:empty)):not(:contains(' 0'))");
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      const url = 'https://www.edureka.co/orders/changeBatch/NA/'+code+'?couponCode='+code;
      $.ajax({
        url: url,
        type: 'GET',
        success: (response, status, xhr) => {
          const elTotal = $(response).find('#order_total_desktop');
          const value = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY; 
          callback(value);
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#user-coupon').value = bestCode;
      document.querySelector('#user-coupon').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('#user-coupon').dispatchEvent(new Event('keyup'));
      document.querySelector('#user-coupon').dispatchEvent(new Event('blur')); 
      document.querySelector('#user-coupon').dispatchEvent(new Event('focus'));        
      document.querySelector('#cpn_sub_clik').click();
    }
  },

  'apply_pbskids': {
    id: 6669,
    removePrevCode: function(code, callback) {
      const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
      const quoteId = windowVariables["window.checkoutConfig"].quoteId;
      const customerData = windowVariables["window.checkoutConfig"].customerData;
      const storeCode = windowVariables["window.checkoutConfig"].storeCode
      var url;
      if(customerData.id){
        url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/carts/mine/coupons';
      }else{
        url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/guest-carts/'+quoteId+'/coupons';
      }
      $.ajax({
        url: url,
        type: 'DELETE',
        success: (response) => { callback(); },
        error: (response) => { callback(); }
      });       
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.grand.totals .price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#discount-code').val();
      if(prevCode != ''){
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
      const ts = Math.round(new Date().getTime());
      const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
      const quoteId = windowVariables["window.checkoutConfig"].quoteId;
      const customerData = windowVariables["window.checkoutConfig"].customerData;
      const storeCode = windowVariables["window.checkoutConfig"].storeCode
      var url;
      if(customerData.id){
        url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/carts/mine/totals-information';
      }else{
        url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/guest-carts/'+quoteId+'/totals-information';
      }
      $.ajax({
        url: url,
        type: 'POST',
        headers:{
          'content-type': 'application/json'
        },
        data: JSON.stringify({"addressInformation":{"address":{"countryId":"US","postcode":null,"extension_attributes":{"advanced_conditions":{"payment_method":"braintree","city":null,"shipping_address_line":[],"billing_address_country":"US"}}},"shipping_method_code":"amstrates6","shipping_carrier_code":"amstrates"}}),
        success: (response) => {                  
          const value = response.grand_total;
          callback(value);
        },error: () => { callback(Number.POSITIVE_INFINITY); }
      });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
        location.reload();
      }) ;
    },
    _applyCode: (code, callback) => {
      const windowVariables = retrieveWindowVariables(["window.checkoutConfig"]);
      const quoteId = windowVariables["window.checkoutConfig"].quoteId;
      const customerData = windowVariables["window.checkoutConfig"].customerData;
      const storeCode = windowVariables["window.checkoutConfig"].storeCode
      var url;
      if(customerData.id){
        url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/carts/mine/coupons/'+code;
      }else{
        url = 'https://'+window.location.hostname+'/rest/'+storeCode+'/V1/guest-carts/'+quoteId+'/coupons/'+code;
      }
      $.ajax({
        url: url,
        type: 'PUT',
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
  },

  a2hosting: {
    id : 38022,
    removePrevCode: function(code, callback) {
      const removeCouponUrl = 'https://'+window.location.hostname+'/cart.php?a=removepromo';
      $.ajax({
        url: removeCouponUrl,
        type: 'GET',
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('#orderSummary #totalDueToday');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('.view-cart-promotion-code');
      if(prevCodeSelector){
        this.removePrevCode('prevCode', () => callback(prevValue));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
        location.reload();
      }) ;   
    },
    _applyCode: (code, callback) => {
      const addCouponUrl = 'https://'+window.location.hostname+'/cart.php?a=view';
      const token = $('[name="token"]').val();
      $.ajax({
        url: addCouponUrl,
        type: 'POST',
        data : {token: token, promocode: code, validatepromo : 'Validate Code'},
        success: (response) => { 
          const elTotal = $(response).find('#orderSummary #totalDueToday');
          const value = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY; 
          callback(value); },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  fineartamerica: {
    id : 31438,
    preApplyCodes: function(callback) { 
      const elTotal = $('#total');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#promotionid').val();
      if(prevCode != ''){
        callback(prevValue,prevCode)
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#promotionid').value = bestCode;
      document.querySelector('#promotionid').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('#promotionid').dispatchEvent(new Event('keyup'));
      document.querySelector('#promotionid').dispatchEvent(new Event('blur')); 
      document.querySelector('#promotionid').dispatchEvent(new Event('focus'));        
      document.querySelector('#promotionid + p > a').click();  
    },
    _applyCode: (code, callback) => {
      const addCouponUrl = 'https://'+window.location.hostname+'/queries/queryCheckoutOrderSummary.php';
      const phpsessionid = $('[name="phpsessionid"]').val();
      const state = $('[name="lastshippingstate"]').val();
      const zipcode = document.getElementById('s_zipcode').value;
      const country = $('[name="lastshippingcountry"]').val();
      const smethod = $('[name="lastshippingmethod"]').val();
      const certificateid = $('[name="lastcertificateid"]').val();
      const billingcountry = document.getElementById('b_country').value;
      $.ajax({
        url: addCouponUrl,
        type: 'POST',
        data : {update: true,
                phpsessionid: phpsessionid,
                state: state,
                zipcode: zipcode,
                country: country,
                method: smethod,
                certificateid: certificateid,
                promotionid: code,
                billingcountry: billingcountry},
        success: (response) => { 
          const elTotal = $(response).find('#total');
          const value = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY; 
          callback(value); },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  antonioli: {
    id : 23836,
    preApplyCodes: function(callback) {
      const elTotal = $('#update-cart tr.total.totals_order_total');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#coupon_code').val();
      if(prevCode != ''){
        callback(prevValue,prevCode)
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
        location.reload();
      });  
    },
    _applyCode: (code, callback) => {
      const url = $('#update-cart').attr('action');
      const addCouponUrl = 'https://'+window.location.hostname+url+'.json';
      const csrf = $('meta[name="csrf-token"]').attr('content');
      $.ajax({
        url: addCouponUrl,
        type: 'PATCH',
        data : {'order[coupon_code]' : code},
        headers : {
          'X-CSRF-Token' : csrf
        },
        success: (response) => {
          const ts = Math.round(new Date().getTime());
          const getUrl = addCouponUrl+'?_='+ts;
          $.get(getUrl, 
          (responseGet) => {
            const elTotal = responseGet.total_price;
            const value = convertNumbers(elTotal.replace( /[^0-9.,]/g, '').trim());
            callback(value);
          }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
          });  
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  wwe: {
    id: 1793,
    preApplyCodes: (callback) => {
      const orderValueEl = $('.cart-order-totals .order-total .order-value');
      const prevValue = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: (code, callback) => {
      const url = $('.b-cart-coupon_block-coupon_code form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('.b-cart-coupon_block-coupon_code form'));
      formData['dwfrm_cart_couponCode'] = code;
      formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
      $.post(url, formData, 
      (response) => {
        const orderValueEl = $(response).find('.cart-order-totals .order-total .order-value');
        const value = orderValueEl.length > 0 ? 
                    convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
        callback(value);
      }).fail(function() {
        callback(Number.POSITIVE_INFINITY);
      });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#dwfrm_cart_couponCode').value = bestCode;
      document.querySelector('#dwfrm_cart_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('#add-coupon').click();
    }
  },


  asics: {
    id: 26646,
    preApplyCodes: (callback) => {
      const orderValueEl = $('.order-total .order-value');
      const prevValue = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: (code, callback) => {
      const windowVariables = retrieveWindowVariables(["window.Urls"]);
      const addCouponUrl = windowVariables["window.Urls"].addCoupon;
      $.get(addCouponUrl+'?couponCode='+code+'&format=ajax', 
        (response) => { 
        $.get('https://'+window.location.hostname+window.location.pathname, 
          (responseGet) => {
            const orderValueEl = $(responseGet).find('.order-total .order-value');
            const value = orderValueEl.length > 0 ? 
                              convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                              Number.POSITIVE_INFINITY;
            callback(value);
          }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
         });        
      }).fail(function() {
        callback(Number.POSITIVE_INFINITY);
      });
    },
    applyBestCode: (bestCode) => {
      location.reload();
    }
  },

  'outlet_loft': {
    id : 35813,
    removePrevCode: function(code, callback) {
      const removeCouponUrl = 'https://'+window.location.hostname+'/cws/cart/removeCoupon.jsp?couponCode='+code+'&device=desktop';
      $.ajax({
        url: removeCouponUrl,
        type: 'GET',
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('[data-slnm-id="orderTotalValue"]');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const windowVariables = retrieveWindowVariables(["__NEXT_DATA__"]);
      const prevCodeSelector = windowVariables["__NEXT_DATA__"].props.initialState.global.shoppingBagItems.cartData;
      if(prevCodeSelector && prevCodeSelector.promoSum){
        const prevCode = prevCodeSelector.promoSum.promos[0].promoCode;
        this.removePrevCode(prevCode, () => callback(prevValue,prevCode));
      }else{
        callback(prevValue);
      }   
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));   
    },
    _applyCode: (code, callback) => {
      const addCouponUrl = 'https://'+window.location.hostname+'/cws/cart/claimCoupon.jsp?couponCode='+code+'&loyaltyCoupon=false&device=desktop';
      $.ajax({
        url: addCouponUrl,
        type: 'GET',
        success: (response) => { 
          const value = response.checkout.ordSum.finalTotal; 
          callback(value); 
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'sneakersnstuff': {
    id : 26552,
    preApplyCodes: function(callback) { 
      const elTotal = $('.product-row .total.large, .cart-summary__value--total');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#checkoutcode').val();
      if(prevCode != ''){
        callback(prevValue,prevCode);
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#checkoutcode').value = bestCode;
      document.querySelector('#checkoutcode').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('.checkout-code-form-button').click();  
    },
    _applyCode: (code, callback) => {
      const url = $('#checkout-code').attr('data-action');
      const addCouponUrl = 'https://'+window.location.hostname+url;
      const csrfToken = $('[name="_AntiCsrfToken"]').val();
      $.ajax({
        url: addCouponUrl,
        type: 'POST',
        headers : {
          'x-anticsrftoken': csrfToken
        },
        data : {checkoutcode : code, partial : 'ajax-cart'},
        success: (response) => { 
          const orderValueEl = $(response).find('.product-row .total.large, .cart-summary__value--total');
          const value = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
          callback(value); 
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'tedbaker': {
    id : 12331,
    preApplyCodes: function(callback) { 
      const elTotal = $('dd.total.price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('.promo-code-loyalty[data-slnm-id="promotionalCodeName"]');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.innerText;
        this.removePrevCode(prevCode, () => callback(prevValue));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      location.reload(); 
    },
    _applyCode: (code, callback) => {
      const addCouponUrl = 'https://www.tedbaker.com/us/json/cart/addCoupon.json';
      const csrfToken = getCookie('XSRF-TOKEN');
      $.ajax({
        url: addCouponUrl,
        type: 'POST',
        headers : {
          'Content-Type': 'application/json;charset=UTF-8',
          'X-XSRF-TOKEN': csrfToken,
        },
        data : JSON.stringify({couponCode : code}),
        success: (response) => { 
          const value = response.data.totalPrice.value; 
          callback(value); 
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'costway': {
    id : 27283,
    removePrevCode: function(code, callback) {
      const addCouponUrl = 'https://www.costway.com/onestepcheckout/ajax/applyCoupon/';
      $.ajax({
        url: addCouponUrl,
        type: 'POST',
        data: {coupon_code : ''},
        success: (response) => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('body:not(:has(li> a:contains("Sign up"))) #aw-onestepcheckout-order-review:not(:has(#aw-onestepcheckout-review-table-cart-wrapper .a-right:contains("Special Offer"))) .aw-onestepcheckout-cart-table strong .price, body:not(:has(li> a:contains("Sign up"))) #aw-onestepcheckout-order-review:has(#aw-onestepcheckout-review-table-cart-wrapper .a-right:contains("Special Offer (")) .aw-onestepcheckout-cart-table strong .price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue));      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));   
    },
    _applyCode: (code, callback) => {
      const addCouponUrl = 'https://www.costway.com/onestepcheckout/ajax/applyCoupon/';
      $.ajax({
        url: addCouponUrl,
        type: 'POST',
        data: {coupon_code :code},
        success: (response) => {
          const data = JSON.parse(response);
          const elTotal = data.grand_total; 
          if(elTotal && elTotal != ''){
            const value = convertNumbers(elTotal.replace( /[^0-9.,]/g, '').trim());
            callback(value);            
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'waves': {
    id : 30148,
    removePrevCode: function(code, callback) {
      const token = $('#p_lt_placeholder_zone_main_placeholder_p_lt_MainZone_WavesShoppingCart_CSRFToken').val();
      const addCouponUrl = 'https://www.waves.com/2code/handlers/cart/cart-coupon.aspx?token='+token+'&label=CartLoginAndRegistration';
      $.ajax({
        url: addCouponUrl,
        type: 'DELETE',
        success: (response) => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.total-price .sr-only');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('.cart-remove-coupon');
      if(prevCodeSelector){
        const prevCode = $('.cart-coupon-val span').text();
        this.removePrevCode('prevCode', () => callback(prevValue,prevCode)); 
      }else{
        callback(prevValue)
      }           
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));   
    },
    _applyCode: (code, callback) => {
      const token = $('#p_lt_placeholder_zone_main_placeholder_p_lt_MainZone_WavesShoppingCart_CSRFToken').val();
      const addCouponUrl = 'https://www.waves.com/2code/handlers/cart/cart-coupon.aspx?token='+token+'&label=CartLoginAndRegistration';
      $.ajax({
        url: addCouponUrl,
        type: 'POST',
        headers : {
          'Content-Type': 'text/plain;charset=UTF-8'
        },
        data: JSON.stringify({couponCode :code}),
        success: (response) => {
          const value = response.RelatedData.total;
          callback(value); 
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'revzilla': {
    id : 5405,
    preApplyCodes: function(callback) { 
      const elTotal = $('.checkout-summary-table--foot tfoot tr:last-child td:last-child');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);           
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));   
    },
    _applyCode: (code, callback) => {
      const addCouponUrl = 'https://www.revzilla.com/checkout/add_discount_code';
      const csrfToken = $('[name="_csrf_token"]').val();
      $.ajax({
        url: addCouponUrl,
        type: 'POST',
        data: {discount_code : code, _utf8 : '✓', _csrf_token : csrfToken},
        success: (response) => {
         $.get(location.href, 
          (responseGet) => {
            const orderValueEl = $(responseGet).find('.checkout-summary-table--foot tfoot tr:last-child td:last-child');
            const value = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
            callback(value);
          }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
         });
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'dynadot': {
    id : 5579,
    removePrevCode: function(code, callback) {
      const removeCouponUrl = 'https://www.dynadot.com/order/cart.html';
      $.ajax({
        url: removeCouponUrl,
        type: 'POST',
        data : {p_c : code, p_c_a_b : 'Remove', cmd :'rm_cuco'  },
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.order-total-price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('input#promo_id').val();
      if(prevCode != ''){
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));   
    },
    _applyCode: (code, callback) => {
      const addCouponUrl = 'https://www.dynadot.com/order/cart.html';
      $.ajax({
        url: addCouponUrl,
        type: 'POST',
        data : {p_c : code,p_c_a_b : 'Apply'},
        success: () => { 
          $.get(location.href, 
          (responseGet) => {
            const orderValueEl = $(responseGet).find('.order-total-price');
            const value = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
            callback(value);
          }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
         });
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'ithemes': {
    id : 29558,
    removePrevCode: function(code, callback) {
      const removeCouponUrl = location.href;
      $.ajax({
        url: removeCouponUrl+'?redirect=true&coupon=',
        type: 'GET',
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('#cart_total');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('input.cart_coupon-field').val();
      if(prevCode != ''){
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        $.get(location.href, 
          (responseGet) => {
            const orderValueEl = $(responseGet).find('#cart_total');
            const value = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
            this.removePrevCode(code, () => callback(value));
          }).fail(function() {
            this.removePrevCode(code, () => callback(Number.POSITIVE_INFINITY));
         });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));   
    },
    _applyCode: (code, callback) => {
      const addCouponUrl = location.href;
      $.ajax({
        url: addCouponUrl+'?coupon='+code+'&redirect=true',
        type: 'GET',
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
  },

  'alexandalexa': {
    id : 4138,
    removePrevCode: function(code, callback) {
      const url = $('#checkout-code').attr('data-action');
      const addCouponUrl = 'https://'+window.location.hostname+url;
      const csrfToken = $('[name="_AntiCsrfToken"]').val();
      $.ajax({
        url: addCouponUrl,
        type: 'POST',
        headers : {
          'x-anticsrftoken': csrfToken
        },
        data : {checkoutcode : '', partial : 'ajax-cart'},
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.cart-summary-total-sum');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('[name="checkoutcode"]').val();
      if(prevCode != ''){
        this.removePrevCode(prevCode, () => callback(prevValue,prevCode));
      }else{
        callback(prevValue);
      }          
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));   
    },
    _applyCode: (code, callback) => {
      const url = $('#checkout-code').attr('data-action');
      const addCouponUrl = 'https://'+window.location.hostname+url;
      const csrfToken = $('[name="_AntiCsrfToken"]').val();
      $.ajax({
        url: addCouponUrl,
        type: 'POST',
        headers : {
          'x-anticsrftoken': csrfToken
        },
        data : {checkoutcode : code, partial : 'ajax-cart'},
        success: (response) => { 
          const orderValueEl = $(response).find('.cart-summary-total-sum');
          const value = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
          callback(value); 
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'polar': {
    id : 37012,
    removePrevCode: function(code, callback) {
      const url = 'https://'+window.location.hostname+'/cart/json/voucher';
      const csrfToken = localStorage.getItem('X-XSRF-TOKEN');
      $.ajax({
        url: url,
        type: 'DELETE',
        headers : {
          'X-XSRF-TOKEN': csrfToken
        },
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.totals .total:last');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('.clickable.mat-icon.material-icons');
      if(prevCodeSelector){
        this.removePrevCode('prevCode', () => callback(prevValue));
      }else{
        callback(prevValue);
      }          
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));   
    },
    _applyCode: (code, callback) => {
      const url = 'https://'+window.location.hostname+'/cart/json/voucher';
      const csrfToken = localStorage.getItem('X-XSRF-TOKEN');
      $.ajax({
        url: url+'?voucherCode='+code,
        type: 'POST',
        headers : {
          'X-XSRF-TOKEN': csrfToken,
          'content-type': 'application/json'
        },
        data : JSON.stringify({}),
        success: (response) => { 
          const value = response.data.cart.totalPrice.value;
          callback(value); },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  muscleandstrength: {
    id: 10218,
    removePrevCode: function(code, callback) {
      $.ajax({
        url: 'https://www.muscleandstrength.com/store/mnscoupon/checkout/cancelCoupon/',
        type: 'POST',
        data: {
          mnscoupon_code_cancel: code
        },
        success: () => { callback(); },
        error: () => {  callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.orderTotals .grand .price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('[name="mnscoupon_code_cancel"]');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.value;
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      const url = $('#discount-coupon-form').attr('action');
      $.ajax({
        url: url,
        type: 'POST',
        data: {
          remove: 0,
          coupon_code: code
        },
        success: (data, textStatus, request) => {
          const locationUrl = request.getResponseHeader('location');
          $.get(locationUrl, (responseGet) => {
            const elTotal = $(responseGet).find('.orderTotals .grand .price');
            var value = 0;
            if( elTotal.length > 0 ){
               $( elTotal ).each(function( index ) {
                value += convertNumbers($( this ).text().replace( /[^0-9.,]/g, '').trim());                
               });
            }else{
                value = Number.POSITIVE_INFINITY;
            }              
            this.removePrevCode(code, () => callback(value));
          }).fail(function() {  callback(Number.POSITIVE_INFINITY); }); 
        },
        error: (xhr, status, error) => {
           callback(Number.POSITIVE_INFINITY);
        }
      });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#coupon_code').value = bestCode;
      document.querySelector('#coupon_code').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
      document.querySelector('#discount-coupon-form button').click();  
    }
  },

  'oakley': {
    id : 1278,
    removePrevCode: function(code, callback) {
      const removeUrl = $('.checkout-promo-code-list').attr('data-href');
      const url = 'https://'+window.location.hostname+removeUrl;
      const cToken = $('[name="_requestConfirmationToken"]').val();
      $.ajax({
        url: url,
        type: 'POST',
        data : {_requestConfirmationToken : cToken},
        success: (response) => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.totals .total-price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue));         
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));   
    },
    _applyCode: (code, callback) => {
      const addUrl = $('#promoCodeForm').attr('action');
      const url = 'https://'+window.location.hostname+addUrl;
      const cToken = $('[name="_requestConfirmationToken"]').val();
      $.ajax({
        url: url,
        type: 'POST',
        data : {code : code , _requestConfirmationToken : cToken},
        success: (response) => {
          if(response.cartTotals){
            const totalValue = response.cartTotals.total;
            const value = convertNumbers(totalValue.replace( /[^0-9.,]/g, '').trim());
            callback(value); 
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'manning': {
    id : 26952,
    preApplyCodes: function(callback) { 
      const elTotal = $('.total-cost-for-quantity:last');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('.discount-code');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.innerText;
        callback(prevValue, prevCode);       
      }else{
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#code').value = bestCode;
      document.querySelector('#code').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
      document.querySelector('#applyDiscountButton').click();   
    },
    _applyCode: (code, callback) => {
      const addUrl = $('#discount-form').attr('action');
      const url = 'https://'+window.location.hostname+addUrl;
      $.ajax({
        url: url,
        type: 'POST',
        data : {code : code},
        success: (response) => {
         $.get(location.href, 
          (responseGet) => {
            const orderValueEl = $(responseGet).find('.total-cost-for-quantity:last');
            const value = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
            callback(value);
          }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
         });
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'classmates': {
    id : 1278,
    preApplyCodes: function(callback) { 
      const elTotal = $('#subtotal_before_discount .totalDisplay.largeText');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const discountValue = $('.totalDisplay.largeText.discValue');
      const discount = discountValue.length > 0 ? 
                  convertNumbers(discountValue.first().text().replace( /[^0-9.,]/g, '').trim()) : 0;
      this.totalBefore = prevValue + discount;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));   
    },
    _applyCode: function(code, callback) {
      const url = 'https://secure.classmates.com/epsf/view-cart.ep';
      const formData = getFormFieldsAsJson(document.querySelector('[name="shoppingCart"]'));
      formData['cartAction'] = 'applyCode';
      formData['code'] = code;
      $.ajax({
        url: url,
        type: 'POST',
        data : formData,
        success: (response) => {
          $.get(url, 
          (responseGet) => {
            const discountValue = $(responseGet).find('.totalDisplay.largeText.discValue');
            const discount = discountValue.length > 0 ? 
                        convertNumbers(discountValue.first().text().replace( /[^0-9.,]/g, '').trim()) : 0;
            const value = this.totalBefore - discount;
            callback(value);
          }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
         });
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  furla: {
    id: 42846,
    preApplyCodes: (callback) => {
      const orderValueEl = $('.cart-order-totals .order-total .order-value');
      const prevValue = orderValueEl.length > 0 ? 
                    convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: (code, callback) => {
      const url = $('#cart-items-form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
      formData['dwfrm_cart_couponCode'] = code;
      formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
      $.post(url, formData, 
        (response) => {
          const orderValueEl = $(response).find('.cart-order-totals .order-total .order-value');
          const value = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
          callback(value);
        }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
        });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#dwfrm_cart_couponCode').value = bestCode;
      document.querySelector('#dwfrm_cart_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('#add-coupon').click();
    }
  },

  'motorola': {
    id: 3401,
    removePrevCode: function(code, callback) {
      const localData = JSON.parse(localStorage.getItem('orderform'));
      const formId = localData.id;
      const basehref = $('base').attr('href');
      const url = 'https://www.motorola.com'+basehref+'/api/checkout/pub/orderForm/'+formId+'/coupons'            
      $.ajax({
        url: url,
        type: 'POST',
         headers: {
                  'Content-Type': 'application/json; charset=UTF-8'
                },
        data : JSON.stringify({text : ''}) ,
        success: (response) => { callback(); },
        error: (xhr, status, error) => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.cart-template.full-cart.active td[data-bind$="totalLabel"]:visible');
      const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
      this.removePrevCode('code', () => callback(prevValue));
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      const localData = JSON.parse(localStorage.getItem('orderform'));
      const formId = localData.id;
      const basehref = $('base').attr('href');
      const url = 'https://www.motorola.com'+basehref+'/api/checkout/pub/orderForm/'+formId+'/coupons'            
      $.ajax({
        url: url,
        type: 'POST',
         headers: {
                  'Content-Type': 'application/json; charset=UTF-8'
                },
        data : JSON.stringify({text : code}) ,
        success: (response) => { 
          const value = (response.value)/100;
          callback(value); },
        error: (xhr, status, error) => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'hunterboots': {
    id: 37276,
    preApplyCodes: function(callback) { 
      const elTotal = $('[class*="pricing-summary__value--total"]:last');
      const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      const token = $('[name="ctr"]').val();
      const endpoints = $('#endpoints').attr('data-api');
      const url = 'https://www.hunterboots.com'+endpoints+'update-promotion-code';         
      $.ajax({
        url: url,
        type: 'PUT',
        data : {code : code, token : token} ,
        success: (response) => { 
          if(response.data){
            const value = response.data.totalToPay.price.value;
            callback(value);
          }else{
            callback(Number.POSITIVE_INFINITY);
          }   
        },
        error: (xhr, status, error) => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'magix': {
    id: 2414,
    removePrevCode: function(code, callback) {
      const url = location.href;
      $.ajax({
        url: url,
        type: 'POST',
        data : {removeCoupon : code} ,
        success: (response) => { callback(); },
        error: (xhr, status, error) => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.basketTotalPrice');
      const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('[name="removeCoupon"]');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.value;
        this.removePrevCode(prevCode, () => callback(prevValue,prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      const url = location.href;
      $.ajax({
        url: url,
        type: 'POST',
        data : {coupon : code} ,
        success: (response) => { 
          const orderValueEl = $(response).find('.basketTotalPrice');
          const value = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: (xhr, status, error) => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  amara: {
    id: 1793,
    preApplyCodes: (callback) => {
      const orderValueEl = $('[class*="OrderSummaryTotalPrice"]');
      const prevValue = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: (code, callback) => {
      const siteId = getCookie('amsi');
      const url = 'https://'+window.location.hostname+'/api/checkout/query?_site_id='+siteId;
      $.ajax({
        url: url,
        type: 'POST',
        header : {
          'content-type': 'text/plain;charset=UTF-8'
        },
        data : JSON.stringify({"bag":true,"bagScreenData":true,"purchases":true,"addDiscount":{"code":code}}),
        success: (response) => {
          const value = response.bag.totalPrice.value;
          callback(value);
        },
        error: (xhr, status, error) => { callback(Number.POSITIVE_INFINITY); }
      });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('[data-test-id="form-input-code"]').value = bestCode;
      document.querySelector('[data-test-id="form-input-code"]').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('[data-test-id="add-discount"]').click();
    }
  },

  'belkin': {
    id: 2414,
    removePrevCode: function(code, callback) {
      const url = 'https://www.belkin.com/us/voucher/'+code+'/remove/';
      $.ajax({
        url: url,
        type: 'DELETE',
        success: (response) => { callback(); },
        error: (xhr, status, error) => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.js-cart-totals div:nth-child(2), .totals');
      const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
      const discountValue = $('.cart-totals-right.discount');
      const discount = discountValue.length > 0 ? 
                  convertNumbers(discountValue.first().text().replace( /[^0-9.,]/g, '').trim()) : 0;
      this.totalBefore = prevValue + discount;
      const prevCodeSelector = document.querySelector('.js-release-voucher');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.getAttribute('data-voucher-code');
        this.removePrevCode(prevCode, () => callback(prevValue,prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: function(code, callback) {
      const csrfToken = $('[name="CSRFToken"]').val();
      const url = 'https://www.belkin.com/us/voucher/apply';
      $.ajax({
        url: url,
        type: 'POST',
        data : {voucherCode : code, CSRFToken : csrfToken} ,
        success: (response) => { 
          $.get(location.href, 
          (responseGet) => {
            var value;
            if(window.location.href.indexOf("cart") > -1){
              const discountValue = $(responseGet).find('.cart-totals-right.discount');
              const discount = discountValue.length > 0 ? 
                          convertNumbers(discountValue.first().text().replace( /[^0-9.,]/g, '').trim()) : 0;
              value = this.totalBefore - discount;
              callback(value);
            }else{
              const finalValue = $(responseGet).find('.totals');
              value = finalValue.length > 0 ? 
                          convertNumbers(finalValue.first().text().replace( /[^0-9.,]/g, '').trim()) : Number.POSITIVE_INFINITY;
              callback(value);
            }
          }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
         });
        },
        error: (xhr, status, error) => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  curiositystream: {
    id: 41106,
    preApplyCodes: (callback) => {
      const elTotal = $('[class*="_planPriceHolder_"]:last span:contains("$"), .text-dark-brand.leading-none');
      const prevValue = elTotal.length > 0 ? 
                     convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;       
      callback(prevValue);
    },
    applyCode: (code, callback) => {
      if(!document.querySelector('[name="couponCode"], [name="coupon"]')){
        try{ document.querySelector('[class*="couponComponentHolder"] [class*="couponDropdownLink"]').click(); }catch(e){}
      }      
      setTimeout(function(){
        document.querySelector('[name="couponCode"], [name="coupon"]').value = code;
         try{ document.querySelector('[class*="_couponInput_"] + button').removeAttribute('disabled');}catch(e){}
        document.querySelector('[name="couponCode"], [name="coupon"]').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('[name="couponCode"], [name="coupon"]').dispatchEvent(new Event('change'));
         try{ document.querySelector('[class*="_couponInput_"] + button').click(); }catch(e){}
        setTimeout(function(){              
          const elTotal = $('[class*="_planPriceHolder_"]:last span:contains("$"), .text-dark-brand.leading-none');
          const value = elTotal.length > 0 ? 
                           convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
          callback(value);
         }, 2000);
      }, 3000);
    },
    applyBestCode: (bestCode) => {
      document.querySelector('[name="couponCode"], [name="coupon"]').value = bestCode;
      try{ document.querySelector('[class*="_couponInput_"] + button').removeAttribute('disabled');}catch(e){}
      document.querySelector('[name="couponCode"], [name="coupon"]').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('[name="couponCode"], [name="coupon"]').dispatchEvent(new Event('change'));
      try{ document.querySelector('[class*="_couponInput_"] + button').click(); }catch(e){}
    }
  },

  onnit: {
    id: 24365,
    preApplyCodes: (callback) => {
      const orderValueEl = $('#checkout-root span:contains(Total) + span');
      const prevValue = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: (code, callback) => {
      const cartId = getCookie('ONNIT_CART_UUID');
      const url = 'https://api.onnit.com/carts/'+cartId+'/coupons';
      $.ajax({
        url: url,
        type: 'POST',
        headers : {
          'content-type': 'application/json;charset=UTF-8'
        },
        data : JSON.stringify({'code' : code}),
        success: (response) => {
          if(response.totals){
            const value = response.totals.grand;
            callback(value);
          }else{
            callback(Number.POSITIVE_INFINITY);
          }          
        },
        error: (xhr, status, error) => { callback(Number.POSITIVE_INFINITY); }
      });
    },
    applyBestCode: (bestCode) => {
     try{ document.querySelector("aside button:not([role='button'])").click(); }catch(e){}
     setTimeout(function(){  
      document.querySelector('input[placeholder="Coupon or gift card"]').value = bestCode;
      document.querySelector('input[placeholder="Coupon or gift card"]').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('input[placeholder="Coupon or gift card"]').dispatchEvent(new Event('change'));
      document.querySelector('aside button[type="submit"]').click();
      }, 1000);
    }
  },

  'renttherunway': {
    id: 7139,
    removePrevCode: function(code, callback) {
      const url = $('#checkout-submit').attr('action');
      const deleteurl = 'https://'+window.location.hostname+url+'/promoCode';
      $.ajax({
        url: deleteurl,
        type: 'DELETE',
        success: (response) => { callback(); },
        error: (xhr, status, error) => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('[aria-label="Order Total"]');
      const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue));      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: function(code, callback) {
      const url = $('#checkout-submit').attr('action');
      const addurl = 'https://'+window.location.hostname+url+'/promoCode';
      $.ajax({
        url: addurl,
        type: 'PATCH',
        data: {promoCode : code},
        success: (response) => { 
          if(response.currentInvoice){
            const elTotal = response.currentInvoice.totals['14'].amount;
            const value = convertNumbers(elTotal.replace( /[^0-9.,]/g, '').trim());
            callback(value);
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        },
        error: (xhr, status, error) => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'torrid': {
    id: 1670,
    removePrevCode: function(code, callback) {
      const url = $('form[name="dwfrm_cart"]').attr('action');
      const formData2 = getFormFieldsAsJson(document.querySelector('form[name="dwfrm_cart"]'));
      formData2['dwfrm_cart_coupons_i0_deleteCoupon'] = 'Remove';
      formData2['dwfrm_cart_updateCart'] = 'dwfrm_cart_updateCart';
      $.post(url, formData2, 
        (response) => {
         callback();
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.orderTotal');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      this.removePrevCode('code', () => callback(prevValue)); 
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        if(window.location.href.indexOf("cart") > -1){
        this.removePrevCode(code, () => callback(value));
         }else{ callback(value); }
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#dwfrm_cart_couponCode, #dwfrm_billing_couponCode').value = bestCode;
      document.querySelector('#dwfrm_cart_couponCode, #dwfrm_billing_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('#add-coupon, #apply-coupon').click();   
    },
    _applyCode: function(code, callback) {
      if(window.location.href.indexOf("cart") > -1){
        const url = $('form[name="dwfrm_cart"]').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('form[name="dwfrm_cart"]'));
        formData['dwfrm_cart_couponCode'] = code;
        formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
        $.ajax({
          url: url,
          type: 'POST',
          data: formData,
          success: (response, status, xhr) => {
            const elTotal = $(response).find('.orderTotal');
            const value = elTotal.length > 0 ? 
                          convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
            callback(value);              
          },
          error: (xhr, status, error) => {
            callback(Number.POSITIVE_INFINITY);
          }
        });
      }else{
       $.get('https://www.torrid.com/on/demandware.store/Sites-torrid-Site/default/Cart-AddCouponJson?couponCode='+code+'&format=ajax', (response) => {             
          const value = response.baskettotal;
          $.get('https://www.torrid.com/on/demandware.store/Sites-torrid-Site/default/COBilling-RemoveCouponJson?couponCode='+code+'&format=ajax', (responseremove) => {             
            callback(value);
          }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
          });
        }).fail(function() {
          callback(Number.POSITIVE_INFINITY);
        });
      }
    },
  },

  'spirithalloween': {
    id: 1892,
    removePrevCode: function(code, callback) {
      var url;
      if(window.location.href.indexOf("basket") > -1){
      url = $('form[name="basket_body"]').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('form[name="basket_body"]'));
      formData['promoCode'] = code;
      formData['removePromoCode'] = 'TRUE';
      formData['checkoutAction'] = '4';
      $.ajax({
        url: url,
        type: 'GET',
        data: formData,
        success: (response, status, xhr) => { callback(); },
        error: (xhr, status, error) => { callback(); }
      });
     }else{
      url = 'https://www.spirithalloween.com/checkout/update_promo_code_ajax.cmd';
       $.ajax({
        url: url,
        type: 'POST',
        data: {form_state: 'updatePromoCodeForm' , promoCode: '', allCarrierCodes: '', delete: 'true'},
        success: (response, status, xhr) => { callback(); },
        error: (xhr, status, error) => { callback(); }
      });
     }
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('#CC_TOTAL-value, #estimated-grand-total');
      var prevValue;
      if(window.location.href.indexOf("basket") > -1){
        prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.get(0).childNodes[0].nodeValue.replace(/[^0-9.,]/g,'').trim()) : 
                  Number.POSITIVE_INFINITY;
      }else{
        prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      }      
      const prevCodeSelector = document.querySelector('.promoCode-val strong');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.innerText;
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('[name="promoCode"]').value = bestCode;
      document.querySelector('[name="promoCode"]').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('[data-qaautomationid="pymtPnl-PromoCodeApply"], [data-qaautomationid="cart-ApplyPromoBtn"]').click(); 
    },
    _applyCode: function(code, callback) {
      var url;
     if(window.location.href.indexOf("basket") > -1){
      url = $('form[name="basket_body"]').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('form[name="basket_body"]'));
      formData['promoCode'] = code;
      formData['removePromoCode'] = '';
      formData['checkoutAction'] = '4';
      $.ajax({
        url: url,
        type: 'GET',
        data: formData,
        success: (response, status, xhr) => {
          const elTotal = $(response).find('#estimated-grand-total');
          const value = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
          callback(value);              
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });
     }else{
       url = 'https://www.spirithalloween.com/checkout/update_promo_code_ajax.cmd';
       const allCarrierCodes = $('[name="allCarrierCodes"]').val();
       $.ajax({
        url: url,
        type: 'POST',
        data: {form_state: 'updatePromoCodeForm' , promoCode: code, allCarrierCodes: allCarrierCodes, delete: 'false'},
        success: (response, status, xhr) => { 
          $.post('https://www.spirithalloween.com/checkout/data/order_summary_data.jsp', {activeStepId : 'payment'},
          (responsePost) => {
            const finalValue = responsePost.orderTotal;
            const value = finalValue/100;
            callback(value);
          }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
         });
        },
        error: (xhr, status, error) => { callback(Number.POSITIVE_INFINITY); }
      });
     }
    },
  },

  'everlywell': {
    id: 7139,
    removePrevCode: function(code, callback) {
      const localData = JSON.parse(localStorage.getItem('customStorage'));
      const current_order =  JSON.parse(localData.current_order);
      const orderId =  current_order.id;
      const auth_token  = localData.auth_token;
      const deleteurl = 'https://secure.everlywell.com/aapi/v2/orders/'+orderId+'/remove_promos';
      $.ajax({
        url: deleteurl,
        type: 'PUT',
        headers : {
          authorization : 'Bearer '+ auth_token
        },
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('[data-testid="grand-total"], .grandtotal .amount');
      const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('[data-testid="discount-applied"], #applied-codes .codes .promo-code');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.innerText;
         this.removePrevCode('prevCode', () => callback(prevValue,prevCode)); 
      }else{
        callback(prevValue);
      }     
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      const promobox = document.querySelector('#promo, .promo-code');
      promobox.value = bestCode;
      promobox.dispatchEvent(new Event('input', {bubbles: true}));
      promobox.dispatchEvent(new Event('change'));
      document.querySelector('[data-testid="promo-button"], .add-promo-code-btn').click(); 
    },
    _applyCode: function(code, callback) {
      const localData = JSON.parse(localStorage.getItem('customStorage'));
      const current_order =  JSON.parse(localData.current_order);
      const orderId =  current_order.id;
      const auth_token  = localData.auth_token;
      const addurl = 'https://secure.everlywell.com/aapi/v2/orders/'+orderId+'/add_promo';
      $.ajax({
        url: addurl,
        type: 'PUT',
        headers : {
          authorization : 'Bearer '+ auth_token
        },
        data: {coupon_code :code},
        success: (response) => {
          const value = response.total;
          callback(value); },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'otterbox': {
    id: 2491,
    preApplyCodes: function(callback) { 
      const elTotal = $('.order-total .value:last span');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);     
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      location.reload();   
    },
    _applyCode: function(code, callback) {
      const windowVariables = retrieveWindowVariables(["app.urls"]);
      const addCouponUrl = windowVariables["app.urls"].addCoupon;
      const summaryRefreshURL = windowVariables["app.urls"].summaryRefreshURL;
      const url = 'https://'+window.location.hostname+summaryRefreshURL;
      const checkoutStep = $('.b-order_minisummary').attr('data-checkoutstep');
      $.get(addCouponUrl, {couponCode : code, format : 'ajax'}, 
      (responseGet) => {
        $.get(url, {checkoutStep : checkoutStep}, 
        (response) => {
          const orderValueEl = $(response).find('.order-total .value:last span');
          const value = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;   
          callback(value);            
        }).fail(function() { callback(Number.POSITIVE_INFINITY); });          
      }).fail(function() { callback(Number.POSITIVE_INFINITY); });
    },
  },

  'thehungryjpeg': {
    id: 23580,
    preApplyCodes: function(callback) { 
      const elTotal = $('.grand-total-price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);     
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#coupon_code').value = bestCode;
      document.querySelector('#coupon_code').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('button[value="Apply Coupon"]').click();
    },
    _applyCode: function(code, callback) {
      const addurl = 'https://thehungryjpeg.com/ajax_discount_code';
      $.ajax({
        url: addurl,
        type: 'POST',
        data: {code :code},
        success: (data) => {
          const response = JSON.parse(data);
          if(response.data){
            const value = response.data.grandtotal;
            callback(value);
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'shop_nasm': {
    id: 6854,
    preApplyCodes: function(callback) { 
      const elTotal = $('[id*="afterDiscountPrice"], #shoppingCart > div:nth-child(4) > aside > table > tbody > tr:nth-child(3) > th.text-right > span');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);     
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      location.reload();
    },
    _applyCode: function(code, callback) {
      const addurl = 'https://shop.nasm.org/api/CartOrder/ValidateCouponAndSave';
      $.ajax({
        url: addurl,
        type: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        },
        data: JSON.stringify({coupon :code}),
        success: (data) => {
          $.ajax({
            url: 'https://shop.nasm.org/api/CartOrder/GetCartOrder',
            type: 'GET',
            success: (response) => {
              const value = response.total;
              callback(value);
            },error: () => { callback(Number.POSITIVE_INFINITY); }
          });
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'entertainmentearth': {
    id: 754,
    removePrevCode: function(code, callback) {
      var url, cartId;
      if(window.location.href.indexOf("shoppingcart") > -1){
        url = 'https://www.entertainmentearth.com/ShoppingCart/RemovePromo';
      }else{
        url = 'https://www.entertainmentearth.com/Checkout/RemovePromo';
      }
      cartId = $('.apply-coupon-code, .remove-coupon-code').attr('data-cartid');
      $.ajax({
        url: url,
        type: 'POST',
        data: {cartId : cartId},
        success: (response) => { callback(); },
        error: (xhr, status, error) => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.visible-md.visible-lg .cart-summary-item h3.pull-right, #checkout-page h3.colorBlue.display-inline.pull-right');
      const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue));      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: function(code, callback) {
      var url, cartId;
      if(window.location.href.indexOf("shoppingcart") > -1){
        url = 'https://www.entertainmentearth.com/ShoppingCart/ApplyPromo';
      }else{
        url = 'https://www.entertainmentearth.com/Checkout/ApplyPromo';
      }
      cartId = $('.apply-coupon-code, .remove-coupon-code').attr('data-cartid');
      $.ajax({
        url: url,
        type: 'POST',
        data: {cartId : cartId, promoCode : code},
        success: (response) => {  
          const orderValueEl = $(response).find('.visible-md.visible-lg .cart-summary-item h3.pull-right, h3.colorBlue.display-inline.pull-right');
          const value = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;   
          callback(value);
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  vault: {
    id: 2708,  
    removePrevCode: (code, callback) => {
      const url = 'https://www.vault.com/Ajax/RemovePromoCode';
      $.ajax({
        url: url,
        type: 'POST',
        success: (response) => { callback(); },
        error: (error) => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.cartTotal');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue)); 
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode('code', () => callback(value)); 
      }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#AddPromoCode').value = bestCode;
      document.querySelector('#AddPromoCode').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('.applyPromoBtn').click();
    },
    _applyCode: (code, callback) => {      
      const url = 'https://www.vault.com/Ajax/ApplyPromoCode';     
      $.ajax({
        url: url,
        type: 'POST',
        data: {PromoCode : code},
        success: (response, status, xhr) => {
          const eltotal = response.OSummary.Total; 
          const value = convertNumbers(eltotal.replace( /[^0-9.,]/g, '').trim());
          callback(value);
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });    
    }
  },

  searchmetrics: {
    id: 41175,
    preApplyCodes: function(callback) {
      const elTotal = $('.grandtotal .price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#coupon_code').val();
      if(prevCode != ''){
        callback(prevValue,prevCode);
      }else{
        callback(prevValue);
      } 
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value)
      }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload(); 
      }.bind(this));
    },
    _applyCode: (code, callback) => {      
      const url = $('#discount-coupon-form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#discount-coupon-form'));    
      formData['coupon_code'] = code;
      const windowVariables = retrieveWindowVariables(["checkout"]);
      const couponReturnUrl = windowVariables["checkout"].couponReturnUrl;
      $.ajax({
        url: url+'?return_url='+couponReturnUrl,
        type: 'POST',
        data: formData,
        success: (response, status, xhr) => {
          $.ajax({
            url: couponReturnUrl,
            type: 'GET',
            success: (responseGet, status, xhr) => {
              const response = JSON.parse(responseGet);
              const data = response.update_section_review.html;
              const elTotal = $(data).find('.grandtotal .price');
              const value =  elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
              callback(value);
            },
            error: (xhr, status, error) => {
              callback(Number.POSITIVE_INFINITY);
            }
          }); 
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });    
    }
  },

  rushordertees: {
    id: 16827,
    preApplyCodes: function(callback) {
      const elTotal = $('.line-item--total div:last');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
       callback(prevValue); 
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value)
      }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload(); 
      }.bind(this));
    },
    _applyCode: (code, callback) => {      
      const url = 'https://www.rushordertees.com/beta-checkout/get-cart/';
      $.ajax({
        url: url,
        type: 'POST',
        data: {'updateCoupon[code]' : code},
        success: (data, status, xhr) => {
          const response = JSON.parse(data);
          const value = response.grandTotal;
          callback(value); 
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });    
    }
  },

  hannaandersson: {
    id: 2983,
    preApplyCodes: (callback) => {
      const orderValueEl = $('.cpo-order-total .order-value');
      const prevValue = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: (code, callback) => {
      const windowVariables = retrieveWindowVariables(["window.Urls"]);
      const addCouponUrl = windowVariables["window.Urls"].addCoupon;
      $.get(addCouponUrl+'?couponCode='+code+'&format=ajax&cartPage=n', 
        (response) => { 
        const value = response.baskettotal;
        callback(value);        
      }).fail(function() {
        callback(Number.POSITIVE_INFINITY);
      });
    },
    applyBestCode: (bestCode) => {
      location.reload();
    }
  },

  calzedonia: {
    id: 34836,
    removePrevCode: function(code, uuid, callback) {
      const url = 'https://'+window.location.hostname+'/on/demandware.store/Sites-calzedonia-us-Site/en_US/Cart-RemoveCouponLineItem' +
                    '?code=' + code +
                    '&uuid=' + uuid; 
      $.ajax({
        url: url,
        type: 'GET',
        data: {},
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('p.grand-total, span.grand-total-sum');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const el = $('button.remove-coupon');
      var url = null;
      if (el !== null && el !== undefined && el.length > 0) {
        const prevCode = el.attr('data-code');
        const uuid = el.attr('data-uuid');
        this.removePrevCode(prevCode,uuid, () => callback(prevValue, prevCode));
      } else {
        callback(prevValue);
      }     
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        $.get('https://'+window.location.hostname+window.location.pathname, (responseGet) => {
          const el = $(responseGet).find('button.remove-coupon');
          if (el !== null && el !== undefined && el.length > 0) {
            const uuid = el.attr('data-uuid');
            this.removePrevCode(code,uuid, () => callback(value));
          }else{
            callback(value);
          }      
        }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
        });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#couponCode').removeAttribute('disabled');
      document.querySelector('#couponCode').value = bestCode;
      document.querySelector('#couponCode').dispatchEvent(new MouseEvent('input', { bubbles: true } )); 
      document.querySelector('.promo-code-btn').removeAttribute('disabled');
      document.querySelector('.promo-code-btn').click();
    },
    _applyCode: (code, callback) => {      
        const csrf_token = $('input[name*="csrf_token"]').first().val();
        const addCouponUrl = '/on/demandware.store/Sites-calzedonia-us-Site/en_US/Cart-AddCoupon';
        const url = 'https://'+window.location.hostname+addCouponUrl +
                    '?couponCode=' + code + 
                    '&csrf_token=' + csrf_token;
        $.ajax({
          url: url,
          type: 'GET',
          success: (response, status, xhr) => {
            if (response !== null) {
              const totals = response.totals;
              if (totals !== null && totals !== undefined) {
                const value = totals.grandTotal !== null ? 
                          convertNumbers(totals.grandTotal.replace( /[^0-9.,]/g, '').trim()) : 
                          Number.POSITIVE_INFINITY;
                callback(value);                
                return;
              }
            }
            callback(Number.POSITIVE_INFINITY);
          },
          error: (xhr, status, error) => {
            console.log(error);
            callback(Number.POSITIVE_INFINITY);
          }
      });    
    },
  },

  apply_mltd: {
    id: 24178,
    preApplyCodes: function(callback) {
      const elTotal = $('.total-list .red-clr:not(:contains($0.00)), #review-order p:contains(Grand total:) span:not(:contains($0.00))');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
       callback(prevValue); 
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value)
      }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('.cart-box input, #coupcode').value = bestCode;
      document.querySelector('.cart-box input, #coupcode').dispatchEvent(new MouseEvent('input', { bubbles: true } )); 
      document.querySelector('.cart-box .form-group button, #coupcode + button').click();
    },
    _applyCode: (code, callback) => {
     if(window.location.href.indexOf("checkout") > -1){
      $.ajax({
        url: 'https://www.mltd.com/customer/revieworder',
        type: 'POST',
        data: {coupcode : code},
        success: (data) => {
          const response = JSON.parse(data);
          if(response.review){
           const bagtotal = convertNumbers(response.review.bagtotal);
           const discount = convertNumbers(response.review.couponamt);
           const shipamt = convertNumbers(response.review.shipamt);
           const tax = convertNumbers(response.review.tax); 
           const value = (bagtotal+tax+shipamt)-discount;
           callback(value);
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        },
        error: (error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });
     }else{     
      const url = location.href;
      $.ajax({
        url: url,
        type: 'POST',
        data: {cf_name : code},
        success: (response) => {
          const orderValueEl = $(response).find('.total-list .red-clr:not(:contains($0.00))');
          const value = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;   
          callback(value);
        },
        error: (error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });
     }  
    }
  },

  arvixe: {
    id: 24520,  
    removePrevCode: (code, callback) => {
      const url = 'https://customers.arvixe.com/cart.php?a=removepromo';
      $.ajax({
        url: url,
        type: 'GET',
        success: (response) => { callback(); },
        error: (error) => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('#totalDueToday');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue)); 
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode('code', () => callback(value)); 
      }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload(); 
      }.bind(this));
    },
    _applyCode: (code, callback) => {      
      const url = 'https://customers.arvixe.com/cart.php?a=view';
      const token = $('[name="token"]').val(); 
      $.ajax({
        url: url,
        type: 'POST',
        data: {promocode : code, validatepromo :'Validate Code', token : token},
        success: (response, status, xhr) => {
          const orderValueEl = $(response).find('#totalDueToday');
          const value = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;   
          callback(value);
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });    
    }
  },

  mountainwarehouse: {
    id : 33765,
    removePrevCode: function(code, callback) {
      const windowVariables = retrieveWindowVariables(["window.NREUM"]);
      const xpid = windowVariables["window.NREUM"].loader_config.xpid;
      const url = 'https://www.mountainwarehouse.com/basket/coupon/?id=0';
       $.ajax({
        url: url,
        type: 'POST',
        headers: {
                'x-newrelic-id': xpid
                },
        data: {'X-Requested-With': 'XMLHttpRequest', 'X-HTTP-Method-Override': 'DELETE'},
        success: () => { callback();},
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('[class*="basket-subtotal"], .c-basket-summary__costs div:nth-child(2) strong strong');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue));      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function() {
        $.get('https://'+window.location.hostname+window.location.pathname, (responseGet) => {
          const elTotal = $(responseGet).find('[class*="basket-subtotal"], .c-basket-summary__costs div:nth-child(2) strong strong');
          const value = elTotal.length > 0 ? 
                convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                Number.POSITIVE_INFINITY;
          callback(value);
          this.removePrevCode(code, () => callback(value));
        }).fail(function() {  this.removePrevCode(code, () => callback(Number.POSITIVE_INFINITY)); });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
        location.reload();
     }.bind(this));   
    },
    _applyCode: (code, callback) => {
      const windowVariables = retrieveWindowVariables(["window.NREUM"]);
      const xpid = windowVariables["window.NREUM"].loader_config.xpid;
      const url = 'https://www.mountainwarehouse.com/basket/coupon/?couponCode=couponCode&autoApply=True';
       $.ajax({
        url: url,
        type: 'POST',
        headers: {
                'x-newrelic-id': xpid
                },
        data: {CouponCode: code, 'X-Requested-With': 'XMLHttpRequest' },
        success: (data) => { callback(); },
        error: () => { callback(); }
      });
    },
  },

  raymourflanigan: {
    id: 30299, 
    preApplyCodes: function(callback) {
      const elTotal = $('.grand-total.bfx-total-grandtotal');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      if(document.querySelector('.js-removecoupon')){
          const prevCode = $('.js-removecoupon').attr('data-code');
          const uuid = $('.js-removecoupon').attr('data-uuid');
           $.get('https://www.underarmour.com/on/demandware.store/Sites-US-Site/en-us/Cart-RemoveCouponLineItem?code='+prevCode+'&uuid='+uuid, 
                () => {
                  callback(prevValue,prevCode);
            });
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      const url = $('form[name="promo-code-form"]').attr('action');
      const csrf_token = $('[name="promo-code-form"] input[name="csrf_token"]').val();
       $.get('https://www.underarmour.com'+url+'/?csrf_token='+csrf_token+'&couponCode='+code, 
        (response) => {
          if(response.totals){
              const value = response.totals.grandTotal;
              const totalValue = convertNumbers(value.replace( /[^0-9.,]/g, '').trim())
              const locale = response.locale;
              const uuid =  response.totals.discounts[0].UUID;
              $.get('https://www.underarmour.com/on/demandware.store/Sites-US-Site/'+locale+'/Cart-RemoveCouponLineItem?code='+code+'&uuid='+uuid, 
                () => {
                  callback(totalValue);
            });
              
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#couponCode').value = bestCode;
      document.querySelector('#couponCode').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('button.promo-code-btn').click();
    }
  },

  'apply_wolterskluwer': {
    id : 7760,
    removePrevCode: function(code, callback) {
      const windowVariables = retrieveWindowVariables(["window.NREUM"]);
      const xpid = windowVariables["window.NREUM"].loader_config.xpid;
      const url = 'https://www.mountainwarehouse.com/basket/coupon/?id=0';
       $.ajax({
        url: url,
        type: 'POST',
        headers: {
                'x-newrelic-id': xpid
                },
        data: {'X-Requested-With': 'XMLHttpRequest', 'X-HTTP-Method-Override': 'DELETE'},
        success: () => { callback();},
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('[class*="basket-subtotal"], .c-basket-summary__costs div:nth-child(2) strong strong');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue));      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function() {
        $.get('https://'+window.location.hostname+window.location.pathname, (responseGet) => {
          const elTotal = $(responseGet).find('[class*="basket-subtotal"], .c-basket-summary__costs div:nth-child(2) strong strong');
          const value = elTotal.length > 0 ? 
                convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                Number.POSITIVE_INFINITY;
          callback(value);
          this.removePrevCode(code, () => callback(value));
        }).fail(function() {  this.removePrevCode(code, () => callback(Number.POSITIVE_INFINITY)); });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
        location.reload();
     }.bind(this));   
    },
    _applyCode: (code, callback) => {
      const windowVariables = retrieveWindowVariables(["window.NREUM"]);
      const xpid = windowVariables["window.NREUM"].loader_config.xpid;
      const url = 'https://www.mountainwarehouse.com/basket/coupon/?couponCode=couponCode&autoApply=True';
       $.ajax({
        url: url,
        type: 'POST',
        headers: {
                'x-newrelic-id': xpid
                },
        data: {CouponCode: code, 'X-Requested-With': 'XMLHttpRequest' },
        success: (data) => { callback(); },
        error: () => { callback(); }
      });
    },
  },

  verishop: {    
    removePrevCode: function(code, callback) {
     try{ document.querySelector('[class*="CartPromoCodeRemoveButton"]').click(); }catch(e){}
     setTimeout(function(){
      callback();
     }, 3000);
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.payment-due__price, div:contains(Order Subtotal) + div:contains($)');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const savings_ec = $('div:contains(Promo Savings) + div:contains($)');
      const savings_value = savings_ec.length > 0 ? 
              convertNumbers(savings_ec.first().text().replace( /[^0-9.,]/g, '').trim()) : 0;
      if(document.querySelector('#checkout_reduction_code')){
        const prevCode = $('.edit_checkout .reduction-code__text').first().text();
        callback(prevValue,prevCode);
      }else{
        const prevCode = $('[class*="CartPromoCodeInfo_name"]').first().text();
        this.removePrevCode('code', () => callback(prevValue-savings_value,prevCode));        
      }
    },
    applyCode: function(code, callback) {
     if(document.querySelector('#checkout_reduction_code')){
      const authenticity_token = $('input[name="authenticity_token"]:last').val();
      const url = 'https://'+window.location.hostname+$(".edit_checkout ").attr('action');
      $.ajax({
        url: url,
        type: 'POST',
        data: {
          _method: 'patch',
          authenticity_token: authenticity_token,
          'checkout[reduction_code]': code,
          'checkout[client_details][browser_width]': 1349,
          'checkout[client_details][browser_height]': 657,
          'checkout[client_details][javascript_enabled]': 1
        },
        success: () => {
          $.get('https://'+window.location.hostname+window.location.pathname, (responseGet) => {             
            const elTotal = $(responseGet).find('.payment-due__price');
            const value = elTotal.length > 0 ? 
                        convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
            callback(value);
          });
        },
        error: (xhr, status, error) => {
          console.log(error);
          callback(Number.POSITIVE_INFINITY);
        },
        fail: (xhr, status, error) => {
          console.log(error);
          callback(Number.POSITIVE_INFINITY);
        }
      });
     }else{
      document.querySelector('[placeholder="Promo code"]').value = code;
      document.querySelector('[placeholder="Promo code"]').dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('[placeholder="Promo code"]').dispatchEvent(new Event('keyup'));
      document.querySelector('[placeholder="Promo code"]').dispatchEvent(new Event('blur'));
      document.querySelector('[placeholder="Promo code"]').dispatchEvent(new Event('focus'));
      document.querySelector('[class*="CartPromoCodeEntry_applyCodeButton"]').click();
      setTimeout(function(){ 
       const elTotal_ac = $('div:contains(Order Subtotal) + div:contains($)');
       const el_value = elTotal_ac.length > 0 ? 
                convertNumbers(elTotal_ac.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                Number.POSITIVE_INFINITY;
        const savings_ec = $('div:contains(Promo Savings) + div:contains($)');
        const savings_value = savings_ec.length > 0 ? 
                convertNumbers(savings_ec.first().text().replace( /[^0-9.,]/g, '').trim()) : 0;
        const value =  el_value-savings_value;    
         try{ document.querySelector('[class*="CartPromoCodeRemoveButton"]').click(); }catch(e){}
           setTimeout(function(){
            callback(value);
           }, 3000);
       }, 3000);
     }
    },
    applyBestCode: (bestCode) => {
      if(document.querySelector('#checkout_reduction_code')){
        document.querySelector('[name="checkout[reduction_code]"]').value = bestCode;
        document.querySelector('[name="checkout[reduction_code]"]').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
        $('button:contains("Apply")').click()
      }else{
        document.querySelector('[placeholder="Promo code"]').value = bestCode;
        document.querySelector('[placeholder="Promo code"]').dispatchEvent(new Event('input', { bubbles: true }));
        document.querySelector('[placeholder="Promo code"]').dispatchEvent(new Event('keyup'));
        document.querySelector('[placeholder="Promo code"]').dispatchEvent(new Event('blur'));
        document.querySelector('[placeholder="Promo code"]').dispatchEvent(new Event('focus'));
        document.querySelector('[class*="CartPromoCodeEntry_applyCodeButton"]').click();
      }
    }
  },

  clinique: {
    id: 575,
    preApplyCodes: function(callback) {
      const elTotal = $('#checkout-right-col .grand-total .price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $().val();
      if(prevCode != ''){
        callback(prevValue,prevCode);
      }else{
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
      }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload(); 
      }.bind(this));
    },
    _applyCode: (code, callback) => {      
      const url = $('[name="offer_code"]').attr('action')
      const formData = getFormFieldsAsJson(document.querySelector('[name="offer_code"]'));
      formData['OFFER_CODE'] = code;
      $.ajax({
        url: 'https://www.clinique.com'+url,
        type: 'POST',
        data: formData,
        success: (response, status, xhr) => {
          const orderValueEl = $(response).find('#checkout-right-col .grand-total .price');
          const value = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;   
          callback(value);
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });    
    }
  },

  meundies: {
    id: 10099,
    preApplyCodes: function(callback) {
      const elTotal = $('.cart-promo-and-totals .cart-subtotal .cart-subtotal-amount');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const savings_ec = $('.cart-promo-total');
      const savings_value = savings_ec.length > 0 ? 
              convertNumbers(savings_ec.first().text().replace( /[^0-9.,]/g, '').trim()) : 0;
      this.totalBefore = prevValue+savings_value;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
      }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload(); 
      }.bind(this));
    },
    _applyCode: function(code, callback) {      
      const url = $('.cart-promo-code-form form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('.cart-promo-code-form form'));
      formData['order[coupon_code]'] = code;
      $.ajax({
        url: 'https://www.meundies.com'+url,
        type: 'POST',
        data: formData,
        success: (response, status, xhr) => {  
          const savings_ec = $(response).find('.cart-promo-total');
          const savings_value = savings_ec.length > 0 ? 
                  convertNumbers(savings_ec.first().text().replace( /[^0-9.,]/g, '').trim()) : 0;
          const value =  this.totalBefore-savings_value;  
          callback(value);
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });    
    }
  },

  vapesourcing: {
    id: 34386,
    preApplyCodes: function(callback) {
      const elTotal = $('[data-type="grand_total"]');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
      }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#coupon_code').value = bestCode;
      document.querySelector('#coupon_code').dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('#coupon_code').dispatchEvent(new Event('keyup'));
      document.querySelector('.coupon-buttons button').click();
    },
    _applyCode: function(code, callback) {
      const url = 'https://vapesourcing.com/sale/checkout/update';
      const token = $('#amscheckout-onepage [name="_token"]').val();
      const formData = getFormFieldsAsJson(document.querySelector('#amscheckout-onepage'));
      formData['coupon_code'] = code;
      $.ajax({
        url: url,
        type: 'GET',
        headers:{
          'x-csrf-token': token
        },
        data: formData,
        success: (response, status, xhr) => {
          const totalsData = response.totals;
          const elTotal = $(totalsData).find('[data-type="grand_total"]');
          const value = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY; 
          callback(value);
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });       
    }
  },

  collage: {
    id: 7386,  
    removePrevCode: (code, callback) => {
      const url = 'https://www.collage.com/api/couponapply';
      const token = getCookie('reauth');
      $.ajax({
        url: url,
        type: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          'x-reauth-token': token
        },
        data: JSON.stringify({code:'clear'}),
        success: (response) => { callback(); },
        error: (error) => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.order-summary-wrapper .c-PriceColumn-totalPrice');
      var prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      if(prevValue == ''){
        prevValue = 0;
      }
      const prevCodeSelector = document.querySelector('.discount-code');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.innerText;
        this.removePrevCode('prevCode', () => callback(prevValue,prevCode));
      }else{
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode('code', () => callback(value));
      }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload(); 
      }.bind(this));
    },
    _applyCode: (code, callback) => {
      const url = 'https://www.collage.com/api/couponapply';
      const token = getCookie('reauth');
      $.ajax({
        url: url,
        type: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          'x-reauth-token': token
        },
        data: JSON.stringify({code:code}),
        success: (response) => {
          if(response.totalprice){
            var value=0;
            if(window.location.href.indexOf("cart") > -1){
              const cartdata = response.cartItems;
              Object.values(cartdata).forEach(val => {
                value += convertNumbers(val.discountedPriceCents);
              });
              callback(value/100); 
            }else{
              const c_value = response.totalprice;
              callback(c_value);
            }
          }else{
            callback(Number.POSITIVE_INFINITY);
          }          
        },
        error: (error) => { callback(Number.POSITIVE_INFINITY); }
      });          
    }
  },

  shoebacca: {
    removePrevCode: function(code, callback) {
     const cartId = JSON.parse(localStorage.getItem('M2_VENIA_BROWSER_PERSISTENCE__cartId')).value.replace(/"/g,'');
     $.ajax({
        url: 'https://'+window.location.hostname+'/graphql',
        type: 'POST',
        contentType: 'application/json',
        headers: {
                  'operationname': 'removeCouponFromCart',
                },
        data: JSON.stringify({
        operationName: 'removeCouponFromCart',
        query: 'mutation removeCouponFromCart($cartId: String!) { removeCouponFromCart(input: { cart_id: $cartId}) { cart { prices { grand_total { value currency __typename } }  __typename } __typename } }',
        variables : {cartId : cartId, couponCode : code }
        }),
        success: () => { callback(); },
        error: () => {  callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('span:contains(Total) + span');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#couponCode').attr('placeholder');
      if(prevCode.includes('?')){
        callback(prevValue);
      }else{
        callback(prevValue,prevCode);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();
     }.bind(this)); 
    },
    _applyCode: (code, callback) => {
      const cartId = JSON.parse(localStorage.getItem('M2_VENIA_BROWSER_PERSISTENCE__cartId')).value.replace(/"/g,'');
      $.ajax({
        url: 'https://'+window.location.hostname+'/graphql',
        type: 'POST',
        contentType: 'application/json',
        headers: {
                  'operationName': 'applyCouponToCart',
                },
        data: JSON.stringify({
          operationName: 'applyCouponToCart',
          query: 'mutation applyCouponToCart($cartId: String!, $couponCode: String!) { applyCouponToCart(input: { cart_id: $cartId,  coupon_code: $couponCode }) { cart { prices { grand_total { value currency __typename } }  __typename } __typename } }',
          variables : {cartId : cartId, couponCode: code }
        }),
        success: (response) => {
          if(response.data.applyCouponToCart){
            const value = response.data.applyCouponToCart.cart.prices.grand_total.value;
            callback(value);
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        },
        error: (xhr, status, error) => {
           callback(Number.POSITIVE_INFINITY);
        }
      });
    },
  },

  tennisexpress: {
    id: 2636,
    removePrevCode: function(code, callback) {
      $.ajax({
        url: 'https://www.tennisexpress.com/checkout.cfm?removeCoupon=Y',
        type: 'GET',
        success: () => { callback(); },
        error: () => {  callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('#orderTotals tbody tr:last-child td:last-child:not(:contains("$0.00")), .shoppingCart span:contains("Total") +span');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue));
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        $.get('https://'+window.location.hostname+window.location.pathname, (responseGet) => {
          const elTotal = $(responseGet).find('#orderTotals tbody tr:last-child td:last-child:not(:contains("$0.00")), .shoppingCart span:contains("Total") +span');
          const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;           
         this.removePrevCode(code, () => callback(value));
        }).fail(function() {
          this.removePrevCode(code, () => callback(Number.POSITIVE_INFINITY)); });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.href = 'https://'+window.location.hostname+window.location.pathname;
     }.bind(this)); 
    },
    _applyCode: (code, callback) => {
      var returnto,submitPromoCodex,submitPromoCodey;
      if(window.location.href.indexOf("viewcart") > -1){
        returnto = 'viewcart';
        submitPromoCodex = '91';
        submitPromoCodey = '20'; 
      }else{
        returnto = 'checkout';
        submitPromoCodex = '132';
        submitPromoCodey = '20';
      }
      const url = 'https://www.tennisexpress.com/index.cfm?action=PROCESSCOUPON';
      $.ajax({
        url: url,
        type: 'POST',
        data: { lookup: code,returnto: returnto,'submitPromoCode.x': submitPromoCodex, 'submitPromoCode.y': submitPromoCodey},
        success: (data, textStatus, request) => { callback(); },
        error: (xhr, status, error) => { callback(); }
      });
    }
  },

  'lorextechnology' : {
    id: 1112,
    preApplyCodes: function(callback) {
      const elTotal = $('.order-total h3:last');
      const prevValue = elTotal.length > 0 ? 
              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
              Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      const form = document.querySelector('form#couponForm');
      const url = $('form#couponForm').attr('action');
      const formData = getFormFieldsAsJson(form);
      formData['promoCode'] = code;
      $.ajax({
        url: 'https://www.lorextechnology.com'+url,
        type: 'POST',
        data: formData,
        success: (data, textStatus, request) => {
          const locationUrl = request.getResponseHeader('location');
          $.get(locationUrl, 
          (response) => {
            const elTotal = $(response).find('.order-total h3:last');
            const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
            callback(value);
          });
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#promoCode').value = bestCode;
      document.querySelector('#promoCode').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('#promoCode').dispatchEvent(new Event('keyup'));
      document.querySelector('#promoCode').dispatchEvent(new Event('blur')); 
      document.querySelector('#promoCode').dispatchEvent(new Event('focus'));        
      $('.col-xxs-12 [class="button-grey"]:first').click();
    }
  },

  billabong: {
    id: 16330,
    removePrevCode: function(code, callback) {
      const url = $('#dwfrm_cart-tableform').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('form#dwfrm_cart-tableform'));
      formData['dwfrm_cart_coupons_i0_deleteCoupon'] = 'Remove';
      $.ajax({
        url: 'https://www.billabong.com'+url,
        type: 'POST',
        data: formData,
        success: () => { callback(); },
        error: () => {  callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('#dwfrm_cart-tableform .ordertotal .value, .total-value-container .ordertotal');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue));
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        $.get(location.href, (responseGet) => {
          const elTotal = $(responseGet).find('#dwfrm_cart-tableform .ordertotal .value, .total-value-container .ordertotal');
          const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;           
         this.removePrevCode(code, () => callback(value));
         }).fail(function() {
          this.removePrevCode(code, () => callback(Number.POSITIVE_INFINITY)); });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();
     }.bind(this)); 
    },
    _applyCode: (code, callback) => {
      const url = $('#dwfrm_cart-tableform').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('form#dwfrm_cart-tableform'));
      formData['dwfrm_cart_couponCode'] = code;
      formData['dwfrm_cart_addCoupon'] = 'Apply';
      $.ajax({
        url: 'https://www.billabong.com'+url,
        type: 'POST',
        data: formData,
        success: () => { callback(); },
        error: () => {  callback(); }
      });
    }
  },

  booksamillion: {
    id: 468,
    preApplyCodes: function(callback) {
      const elTotal = $('tr td:contains("Balance Due") + td + td');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('[name="cpncode"]').val();
      if(prevCode != ''){
        callback(prevValue,prevCode)
      }else{
        callback(prevValue)
      }
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
        document.querySelector('#checkout_cpn').click();
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#checkout_cpn').value = bestCode;
      document.querySelector('#checkout_cpn').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('#checkout_cpn').dispatchEvent(new Event('keyup'));      
      document.querySelector('[name="apply_coupon"]').click();
    },
    _applyCode: (code, callback) => {
      const url = $('#checkout').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('form#checkout'));
      formData['cpncode'] = code;
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: (response) => { 
          const elTotal = $(response).find('tr td:contains("Balance Due") + td + td');
          const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: () => {  callback(Number.POSITIVE_INFINITY); }
      });
    }
  },

  mancrates: {
    id: 32035,
    preApplyCodes: function(callback) {
      const elTotal = $('.order-grand-total .order-total-value');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value)
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();
     }.bind(this)); 
    },
    _applyCode: (code, callback) => {
      const url = $('[data-js-hook="form-cart-coupon"]').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('[data-js-hook="form-cart-coupon"]'));
      formData['cart[coupon_attributes][code]'] = code;
      $.ajax({
        url: 'https://www.mancrates.com'+url,
        type: 'POST',
        data: formData,
        success: (response) => { 
          const elTotal = $(response).find('.order-grand-total .order-total-value');
          const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: () => {  callback(Number.POSITIVE_INFINITY); }
      });
    }
  },

  zalora: {
    id: 28778,    
    removePrevCode: function(code, callback) {
      const csrfToken = $('#cart-promo-form [name="YII_CSRF_TOKEN"]').val();
      const url = 'https://www.zalora.sg/cart/removevoucher/?YII_CSRF_TOKEN='+csrfToken;
      $.ajax({
        url: url,
        type: 'GET',
        success: () => { callback(); },
        error: () => {  callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.review__total div:contains("Grand Total") + div span');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue));
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();
     }.bind(this)); 
    },
    _applyCode: (code, callback) => {
      const url = $('#cart-promo-form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('form#cart-promo-form'));
      formData['vc'] = code;
      $.ajax({
        url: 'https://www.zalora.sg'+url,
        type: 'POST',
        data: formData,
        success: (response) => { 
          const elTotal = $(response).find('.review__total div:contains("Grand Total") + div span');
          const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: () => {  callback(Number.POSITIVE_INFINITY); }
      });
    }
  },

  lovehoney: {
    id: 35090,
    removePrevCode: function(code,prevCodeUuid, callback) {
     const removeUrl = 'https://www.lovehoney.com/cart/removecouponlineitem';
     const token = JSON.parse(localStorage.getItem('token'));
     const csrf_token = token.value; 
     $.get(removeUrl+'?couponCode='+code+'&uuid='+prevCodeUuid+'&csrf_token='+csrf_token, 
      (response) => { callback(); }).fail(function() {  callback(); }); 
    },
    preApplyCodes: function(callback) {
      const elTotal = $('[data-t="orderTotal"]');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('[data-event-click="removeCoupon"]');          
      if(prevCodeSelector){
        const prevCode = $('[data-event-click="removeCoupon"]').attr('data-code');
        const prevCodeUuid = $('[data-event-click="removeCoupon"]').attr('data-uuid');
        this.removePrevCode(prevCode, prevCodeUuid, () => callback(prevValue, prevCode));
      }else{        
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {        
      const token = JSON.parse(localStorage.getItem('token'));
      const csrf_token = token.value;    
       $.get('https://www.lovehoney.com/cart/addcoupon?csrf_token='+csrf_token+'&couponCode='+code, 
        (response) => {
          if(response.totals){
            const value = response.totals.cartTotal;
            const totalValue = convertNumbers(value.replace( /[^0-9.,]/g, '').trim());                
            const uuid =  response.totals.discounts[0].UUID;
            this.removePrevCode(code,uuid, () => callback(totalValue));
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        }).fail(function() {  callback(Number.POSITIVE_INFINITY); }); 
    },
    applyBestCode: (bestCode) => {
      const token = JSON.parse(localStorage.getItem('token'));
      const csrf_token = token.value;    
      $.get('https://www.lovehoney.com/cart/addcoupon?csrf_token='+csrf_token+'&couponCode='+bestCode, 
        (response) => { location.reload(); }).fail(function() { location.reload(); }); 
    }
  },

  discountmags: {
    id: 2935,
    preApplyCodes: function(callback) {
      const elTotal = $('.payment-info table tfoot td:last, .summary table tfoot td:last');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value)
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      location.reload(); 
    },
    _applyCode: (code, callback) => {
      const url = $('[name="cartForm"]').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('[name="cartForm"]'));
      formData['xOfferCode'] = code;
      formData['xOffer'] = 'Apply';
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: (response) => { 
          const elTotal = $(response).find('.payment-info table tfoot td:last, .summary table tfoot td:last');
          const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: () => {  callback(Number.POSITIVE_INFINITY); }
      });
    }
  },

  letsgetchecked: {
    id: 34994,
    preApplyCodes: function(callback) {
      const elTotal = $('#cart-total');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#txtDiscountCode').val();
      if(prevCode != ''){
        callback(prevValue,prevCode);
      }else{ callback(prevValue); }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));
    },
    _applyCode: (code, callback) => {
      const url = 'apply-discount/';
      $.ajax({
        url: location.href+url,
        type: 'POST',
        data: {AppliedDiscountCode : code},
        success: (response) => { 
          const elTotal = response.Total;
          const value = elTotal ? 
                    convertNumbers(elTotal.replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: () => {  callback(Number.POSITIVE_INFINITY); }
      });
    }
  },

  flaviar: {
    id: 17112,
    preApplyCodes: function(callback) {
      const elTotal = $('.pricecurr, #coupon_num, #checkout .order-summary .order-total > div.order-summary__row:last-child div:last-child');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);    
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();
     }.bind(this));
    },
    _applyCode: (code, callback) => {
      var url = 'https://flaviar.com/checkout/apply-coupon-code';
      $.ajax({
        url: url,
        type: 'PATCH',
        headers:{
          'content-type' : 'application/json'
        },
        data: JSON.stringify({code : code}),
        success: (response) => {
          if(response.data){
            const value = response.data.total;
            callback(value/100);
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    }
  },

  godiva: {
    id: 35090,
    removePrevCode: function(code,prevCodeUuid, callback) {
     const removeUrl = $('.delete-coupon-confirmation-btn').attr('data-action');
     const csrf_token = $('[name="promo-code-form"] [name="csrf_token"]').val();
     $.get('https://www.godiva.com'+removeUrl+'?code='+code+'&uuid='+prevCodeUuid, 
      (response) => { callback(); }).fail(function() {  callback(); }); 
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.grand-total');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('.remove-coupon');          
      if(prevCodeSelector){
        const prevCode = $('.remove-coupon').attr('data-code');
        const prevCodeUuid = $('.remove-coupon').attr('data-uuid');
        this.removePrevCode(prevCode, prevCodeUuid, () => callback(prevValue, prevCode));
      }else{        
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {
      const url = $('[name="promo-code-form"]').attr('action');
      const csrf_token = $('[name="promo-code-form"] [name="csrf_token"]').val();
       $.get('https://www.godiva.com'+url+'?csrf_token='+csrf_token+'&couponCode='+code, 
        (response) => {
          if(response.totals){
            const value = response.totals.grandTotal;
            const totalValue = convertNumbers(value.replace( /[^0-9.,]/g, '').trim());                
            const uuid =  response.totals.discounts[0].UUID;
            this.removePrevCode(code,uuid, () => callback(totalValue));
          }else{ callback(Number.POSITIVE_INFINITY); }
        }).fail(function() {  callback(Number.POSITIVE_INFINITY); }); 
    },
    applyBestCode: (bestCode) => {
      const url = $('[name="promo-code-form"]').attr('action');
      const csrf_token = $('[name="promo-code-form"] [name="csrf_token"]').val();   
       $.get('https://www.godiva.com'+url+'?csrf_token='+csrf_token+'&couponCode='+bestCode, 
        (response) => { location.reload(); }).fail(function() { location.reload(); }); 
    }
  },

  replacements: {
    id: 41108,  
    removePrevCode: (code, callback) => {
      const url = 'https://www.replacements.com/service/cart/promo-code';
      $.ajax({
        url: url,
        type: 'DELETE',
        data: {code:code},
        success: (response) => { callback(); },
        error: (error) => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('[data-field="total"]');
      var prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('.applied-promos .code');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.innerText;
        this.removePrevCode(prevCode, () => callback(prevValue,prevCode));
      }else{
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
      }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload(); 
      }.bind(this));
    },
    _applyCode: (code, callback) => {
      const url = 'https://www.replacements.com/service/cart/promo-code';
      $.ajax({
        url: url,
        type: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        data: JSON.stringify({code:code}),
        success: (response) => {
          if(response.cart){
            const c_value = response.cart.balance;
            callback(c_value);
          }else{
            callback(Number.POSITIVE_INFINITY);
          }          
        },
        error: (error) => { callback(Number.POSITIVE_INFINITY); }
      });          
    }
  },

  teeshirtpalace: {
    id: 18433,  
    removePrevCode: (code, callback) => {
      const url = 'https://www.teeshirtpalace.com/removecode';
      $.ajax({
        url: url,
        type: 'POST',
        success: (response) => { callback(); },
        error: (error) => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('#total');
      var prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('.coupon-code__apply-box #codebtn');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.innerText;
        this.removePrevCode(prevCode, () => callback(prevValue,prevCode));
      }else{
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        $.get(location.href, (responseGet) => {
          const elTotal = $(responseGet).find('#total');
          const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;           
         this.removePrevCode(code, () => callback(value));
        }).fail(function() {
         this.removePrevCode(code, () => callback(Number.POSITIVE_INFINITY)); });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload(); 
      }.bind(this));
    },
    _applyCode: (code, callback) => {
      const url = 'https://www.teeshirtpalace.com/applycode';
      $.ajax({
        url: url,
        type: 'POST',
        data: {code:code},
        success: (response) => { callback(); },
        error: (error) => { callback(); }
      });          
    }
  },

  'logosoftwear' : {
    id: 3645,
    preApplyCodes: function(callback) {
      const elTotal = $('.cartOrderFinalTotal  .cartSubTotal_Total.BA_SUMMARY_VALUE_TEXT_TOTAL, #ottotal');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
     if(window.location.href.indexOf("checkout") > -1){
      const form = document.querySelector('form#checkout_payment');
      const url = $('form#checkout_payment').attr('action');
      const formData = getFormFieldsAsJson(form);
      formData['dc_redeem_code'] = code;
      $.ajax({
        url: url+'&fecaction=update',
        type: 'POST',
        data: formData,
        success: (response) => {
          const elTotal = $(response).find('#ottotal');
          const value = elTotal.length > 0 ? 
                convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: (xhr, status, error) => { callback(Number.POSITIVE_INFINITY); }
      });      
     }else{
      const form = document.querySelector('form#cart_quantity');
      const url = $('form#cart_quantity').attr('action');
      const formData = getFormFieldsAsJson(form);
      formData['dc_redeem_code'] = code;
      var ts = Math.round(new Date().getTime());
      const windowVariables = retrieveWindowVariables(["CARTVARS"]);
      const subtotal = windowVariables["CARTVARS"].order_final_subtotal;        
      $.ajax({
        url: 'https://www.logosoftwear.com/cart/logo-modules/lineitem-update.php',
        type: 'POST',
        data: {line_extras : '1', dc_redeem_code : code, subtotal : subtotal, '_' : ts},
        success: (data, textStatus, request) => {
          $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            success: (data, textStatus, request) => {
              const locationUrl = request.getResponseHeader('location');
              $.get(locationUrl, 
              (response) => {
                const elTotal = $(response).find('.cartOrderFinalTotal  .cartSubTotal_Total.BA_SUMMARY_VALUE_TEXT_TOTAL');
                const value = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
                callback(value);
              }).fail(function() { callback(Number.POSITIVE_INFINITY); });
            },
            error: (xhr, status, error) => { callback(Number.POSITIVE_INFINITY); }
          });
        },
        error: (xhr, status, error) => { callback(Number.POSITIVE_INFINITY); }
      });
     }
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#dc_redeem_code').value = bestCode;
      document.querySelector('#dc_redeem_code').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('#dc_redeem_code').dispatchEvent(new Event('keyup'));
      document.querySelector('#dc_redeem_code').dispatchEvent(new Event('blur')); 
      document.querySelector('#dc_redeem_code').dispatchEvent(new Event('focus'));        
      document.querySelector('#dc_redeem_code + button').click();
    }
  },

  fasttech: {
    id: 468,
    preApplyCodes: function(callback) {
      const elTotal = $('#content_CartItems_OrderTotal');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value)
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();
     }.bind(this)); 
    },
    _applyCode: (code, callback) => {
      const url = $('#master').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('form#master'));
      formData['ctl00$content$CouponCode'] = code;
      formData['ctl00$content$ApplyCoupon'] = 'Apply';
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: (response) => { 
          const elTotal = $(response).find('#content_CartItems_OrderTotal');
          const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: () => {  callback(Number.POSITIVE_INFINITY); }
      });
    }
  },

  nitecorestore: {
    id: 35787,
    removePrevCode: function(code, callback) {
      $.ajax({
        url: 'https://'+window.location.hostname+'/ShoppingCart.asp?RemoveCouponCode='+code,
        type: 'GET',
        success: () => { callback(); },
        error: () => {  callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('#v65-cart-total-estimate-cell .pricecolor.colors_productprice b');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('a[href*="RemoveCouponCode"]');
      if(prevCodeSelector){
        const prevCodeurl = 'https://'+window.location.hostname+'/'+prevCodeSelector.getAttribute('href');
        const prevCode = getParam('RemoveCouponCode', prevCodeurl);
        this.removePrevCode(prevCode, () => callback(prevValue,prevCode));
      }else{
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#v65-cart-coupon-entry-details-input').value = bestCode;
      document.querySelector('#v65-cart-coupon-entry-details-input').dispatchEvent(new Event('input', {bubbles: true}));        
      document.querySelector('#v65-cart-coupon-entry-details-button').click();
    },
    _applyCode: (code, callback) => {
      const formData = getFormFieldsAsJson(document.querySelector('[name="form"]'));
      formData['CouponCode'] = code;
      const url = 'https://'+window.location.hostname+'/ShoppingCart.asp';
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: (response) => { 
          const elTotal = $(response).find('#v65-cart-total-estimate-cell .pricecolor.colors_productprice b');
          const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: (error) => { callback(Number.POSITIVE_INFINITY); }
      });
    }
  },

  angara: {
    id: 334,
    preApplyCodes: function(callback) {
      const elTotal = $('.shipping-total .customGrandTotal');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#coupon_code').val();
      if(prevCode != ''){
        callback(prevValue,prevCode);
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value)
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#coupon_code').value = bestCode;
      document.querySelector('#coupon_code').dispatchEvent(new Event('input', {bubbles: true}));        
      document.querySelector('#apply-btn').click();
    },
    _applyCode: (code, callback) => {
      $.ajax({
        url: 'https://'+window.location.hostname+'/angarashipping/index/couponpost/?'+code,
        type: 'POST',
        data: {coupon_code : code},
        success: (data, textStatus, request) => {
          const locationUrl = request.getResponseHeader('location');
          $.get(locationUrl , (responseGet) => {
            const elTotal = $(responseGet).find('.shipping-total .customGrandTotal');
            const value = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
            callback(value);
          }).fail(function() { callback(Number.POSITIVE_INFINITY); });
        },
        error: () => {  callback(Number.POSITIVE_INFINITY); }
      });
    }
  },

  wearpact: {
    id: 14240,
    preApplyCodes: function(callback) {
      const elTotal = $('.cart-summary-wrapper .estimated-total-summary span:not(:empty), .row.total .amount');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value)
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));
    },
    _applyCode: (code, callback) => {
      $.ajax({
        url: 'https://wearpact.com/controller/promotion',
        type: 'POST',
        data: {action: 'set',code : code},
        success: (data, textStatus, request) => {
          const locationUrl = 'https://wearpact.com/controller/cart';
          $.post(locationUrl ,{action : 'get'}, (responsepost) => {
            const value = responsepost.data.ledger.total;
            callback(value);
          }).fail(function() { callback(Number.POSITIVE_INFINITY); });
        },
        error: () => {  callback(Number.POSITIVE_INFINITY); }
      });
    }
  },

  gifttree: {
    id: 861,
    preApplyCodes: function(callback) {
      const prevValue = $('#cor_grandtotal_billing').attr('data-total');
      const prevCodeSelector = document.querySelector('#cor-summary-promo-code');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.innerText;
        callback(prevValue,prevCode);
      }else{
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        $.get(location.href, (responseGet) => {
          const value = $(responseGet).find('#cor_grandtotal_billing').attr('data-total');
          callback(value)
        }).fail(function() { callback(Number.POSITIVE_INFINITY); });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('input[name="promo_code"]').value = bestCode;
      document.querySelector('input[name="promo_code"]').dispatchEvent(new Event('input', {bubbles: true}));        
      document.querySelector('input[name="update_promo_code"]').click();
    },
    _applyCode: (code, callback) => {
      const url = $('#cor_actions_billing_form').attr('action');
      $.ajax({
        url: 'https://www.gifttree.com'+url,
        type: 'POST',
        data: {update_promo_code: 'Update Code',promo_code : code},
        success: () => { callback(); },
        error: () => { callback(); }
      });          
    }
  },

  milanoo: {
    id: 3042,
    removePrevCode: function(code, callback) {
      const url = 'https://www.milanoo.com/index.php?module=ajax&action=promotionCoupon&act=removeCode';
      $.ajax({ 
        url: url,
        type: 'POST',
        data : {libkey : code},
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.total-price .smt_price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      if(document.querySelector('.used-coupons-item span')){
        const prevCode = $('.used-coupons-item span').first().text();
        this.removePrevCode(prevCode, () => callback(prevValue,prevCode));
      }else{
        callback(prevValue); 
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
      const url = location.href;
      $.get(url, (responseGet) => {
        const elTotal = $(responseGet).find('.total-price .smt_price');
        const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
        this.removePrevCode(code, () => callback(value));
      }).fail(function() { callback(Number.POSITIVE_INFINITY); });       
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();
     }.bind(this));
    },
    _applyCode: (code, callback) => {
      const url = 'https://www.milanoo.com/index.php?module=ajax&action=promotionCode&libkey='+code+'&websiteId=1&pageName=Cart&';
      $.ajax({ 
        url: url,
        type: 'GET',
        success: () => { callback(); },
        error: () => { callback(); }
      });               
    }
  },

  compsource: {
    id: 18433,  
    removePrevCode: (code, callback) => {
      const url = 'https://www.compsource.com/basket.asp?op=promo';
      $.ajax({
        url: url,
        type: 'GET',
        success: (response) => { callback(); },
        error: (error) => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('#totalPrice');
      var prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue));
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.href= 'https://'+window.location.hostname+'/'+window.location.pathname;
      }.bind(this));
    },
    _applyCode: (code, callback) => {
      const url = $('#form2').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#form2'));
      formData['promo_code'] = code;
      formData['submit_promo'] = 'Apply Promo';
      $.ajax({
        url:  'https://'+window.location.hostname+'/'+url,
        type: 'POST',
        data: formData,
        success: (response) => {
          const elTotal = $(response).find('#totalPrice');
          const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: (error) => { callback(Number.POSITIVE_INFINITY); }
      });          
    }
  },

  mmoga: {
    id: 10215,
    preApplyCodes: function(callback) {
      const elTotal = $('td:contains(Total) + td');
      var prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#gvRedeemCode').value = bestCode;
      document.querySelector('#gvRedeemCode').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('#gvRedeemCode').dispatchEvent(new Event('change'));
      document.querySelector('#gvRedeemCode + a').click();
    },
    _applyCode: (code, callback) => {
      const url = 'https://www.mmoga.com/gv_redeem.ajax.php';
      $.ajax({
        url:  url,
        type: 'POST',
        data: {gv_no : code},
        success: (response) => {
          $.ajax({
          url:  'https://www.mmoga.com/checkout_payment.php',
          type: 'GET',
          success: (responseGet) => {
            const elTotal = $(responseGet).find('td:contains(Total) + td');
            const value = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
            callback(value);
          },
          error: (error) => { callback(Number.POSITIVE_INFINITY); }
        }); 
        },
        error: (error) => { callback(Number.POSITIVE_INFINITY); }
      });          
    }
  },

  wolfandbadger: {
    id: 14872,
    removePrevCode: (code, callback) => {
      if(window.location.href.indexOf("shopping-bag") > -1){
        const url = 'https://www.wolfandbadger.com/api/v1/shop/cart/remove-discount/';
         $.ajax({
          url: 'https://www.wolfandbadger.com/api/v1/session/csrf',
          type: 'GET',
          success: (response) => {
            const csrf_token = response.csrf;
            $.ajax({
              url: url,
              type: 'PATCH',
              headers:{
                'content-type': 'application/json',
                'x-csrftoken' : csrf_token
              },
              data: JSON.stringify({code:code}),
              success: (response) => { callback(); },
              error: (error) => { callback(); }
            });
          },
          error: (error) => { callback(); }
        });
      }else{
        const token = $('[name="csrfmiddlewaretoken"]').val();
        $.ajax({
          url: location.href,
          type: 'POST',
          data: {csrfmiddlewaretoken:token, remove_discount:''},
          success: (response) => { callback(); },
          error: (error) => { callback(); }
        });
      }      
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.total-line .total-cart, p:contains(Total) +p');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      if(window.location.href.indexOf("shopping-bag") > -1){
        const prevCodeSelector = document.querySelector('[data-testid="remove-code"]');
        if(prevCodeSelector){
          const prevCode = $('[data-testid="remove-code"]').prev('p').find('b').text();
          prevCode.replace(/`/g,'');
          this.removePrevCode(prevCode, () => callback(prevValue,prevCode)); 
        }else{
          callback(prevValue);
        }
      }else{
       this.removePrevCode('prevCode', () => callback(prevValue)); 
      }      
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
      this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();
     }.bind(this));
    },
    _applyCode: (code, callback) => {
      if(window.location.href.indexOf("shopping-bag") > -1){
        const url = 'https://www.wolfandbadger.com/api/v1/shop/cart/add-discount/';
         $.ajax({
          url: 'https://www.wolfandbadger.com/api/v1/session/csrf',
          type: 'GET',
          success: (response) => {
            const csrf_token = response.csrf;
            $.ajax({
              url: url,
              type: 'PATCH',
              headers:{
                'content-type': 'application/json',
                'x-csrftoken' : csrf_token
              },
              data: JSON.stringify({code:code}),
              success: (response) => { 
                const value = response.estimatedTotals.total;
                callback(value); 
              },
              error: (error) => { callback(Number.POSITIVE_INFINITY); }
            });
          },
          error: (error) => { callback(Number.POSITIVE_INFINITY); }
        });
      }else{
        const formData = getFormFieldsAsJson(document.querySelector('.update-code-form'));
        const url = location.href;
        formData['discount_code'] = code;
        formData['add_discount'] = 'Update code';
        $.ajax({ 
          url: url,
          type: 'POST',
          data: formData,
          success: (response) => {
            const elTotal = $(response).find('.total-line .total-cart');
            const value = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
            callback(value);
          },
          error: () => { callback(Number.POSITIVE_INFINITY); }
        });
      }            
    }
  },

  christmaslightsetc: {
    id: 569,
    removePrevCode: (code, callback) => {
      const url = 'https://'+window.location.hostname+'/'+window.location.pathname+'?action=RemoveCoupon';
      $.ajax({
        url: url,
        type: 'POST',
        data: {addCoupon:code},
        success: (response) => { callback(); },
        error: (error) => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('#cartForm .cart-subtotal div strong > span:visible');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#coupon-code').val();
      if(prevCode != ''){
        this.removePrevCode(prevCode, () => callback(prevValue,prevCode)); 
      }else{
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
      this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.href = 'https://'+window.location.hostname+'/'+window.location.pathname;
     }.bind(this));
    },
    _applyCode: (code, callback) => {
      const url = 'https://'+window.location.hostname+'/'+window.location.pathname+'?action=AddCoupon';
      $.ajax({ 
        url: url,
        type: 'POST',
        data: {addCoupon:code},
        success: (response) => {
          const elTotal = $(response).find('#cartForm .cart-subtotal div strong span:last');
          const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });               
    }
  },

  beautycarechoices: {
    id: 9957,
    preApplyCodes: function(callback) {
     const elTotal = $('td:contains("Total") + td');
     const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
     const prevCode = $('[name="promo"]').val();
     if(prevCode != ''){
      callback(prevValue,prevCode);
     }else{
      callback(prevValue);
     }
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
      const url = location.href;
      $.get(url, (responseGet) => {
        const elTotal = $(responseGet).find('td:contains("Total") + td');
        const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
        callback(value);
      }).fail(function() { callback(Number.POSITIVE_INFINITY); });      
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();
     }.bind(this));
    },
    _applyCode: (code, callback) => {
      const url = $('.checkout-form form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('.checkout-form form'));
      formData['promo'] = code;
      $.ajax({
        url: url,
        type: 'GET',
        data: formData,
        success: () => { callback(); },
        error: () => { callback(); },
        fail: () => { callback(); }
      });                
    }
  },

  evitamins: {
    id: 770,
    preApplyCodes: function(callback) {
     const elTotal = $('tr td:contains("Order Total")+ td, tr td:contains("* Order Total")+ td');
     const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
     callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       callback(value);     
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('[name="coupon"]').value = bestCode;
      document.querySelector('[name="coupon"]').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('[name="coupon"]').dispatchEvent(new Event('change'));
      document.querySelector('[name="applycoupon"] [value="Apply"]').click();
    },
    _applyCode: (code, callback) => {
      const url = $('[name="applycoupon"]').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('[name="applycoupon"]'));
      formData['coupon'] = code;
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: (response) => { 
          const elTotal = $(response).find('tr td:contains("Order Total")+ td, tr td:contains("* Order Total")+ td');
          const value = elTotal.length > 0 ? 
                convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });                
    }
  },

  eyeglasses: {
    id: 7474,
    preApplyCodes: function(callback) {
     const elTotal = $('#span-order-total');
     const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
     callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
      const url = location.href;
      $.get(url, (responseGet) => {
        const elTotal = $(responseGet).find('#span-order-total');
        const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
        callback(value);
      }).fail(function() { callback(Number.POSITIVE_INFINITY); });      
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();
     }.bind(this));
    },
    _applyCode: (code, callback) => {
      const url = $('#form-apply-coupon').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#form-apply-coupon'));
      formData['code'] = code;
      $.ajax({
        url: 'https://'+window.location.hostname+url,
        type: 'POST',
        data: formData,
        success: () => { callback(); },
        error: () => { callback(); },
        fail: () => { callback(); }
      });                
    }
  },

  als: {
    id: 30284,
    removePrevCode: (code, callback) => {
      const orderForm = JSON.parse(localStorage.getItem('orderform'));
      const orderId = orderForm.id
      const url = 'https://www.als.com/api/checkout/pub/orderForm/'+orderId+'/coupons';
      $.ajax({
        url: url,
        type: 'POST',
        headers:{
          'content-type': 'application/json; charset=UTF-8'
        },
        data: JSON.stringify({text:"", expectedOrderFormSections:["totalizers"] }),
        success: (response) => { callback(); },
        error: (error) => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('[data-bind="text: totalLabel"]');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue));
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
      this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload(); 
      }.bind(this));
    },
    _applyCode: (code, callback) => {
      const orderForm = JSON.parse(localStorage.getItem('orderform'));
      const orderId = orderForm.id;      
      const url = 'https://www.als.com/api/checkout/pub/orderForm/'+orderId+'/coupons';
      $.ajax({
        url: url,
        type: 'POST',
        headers:{
          'content-type': 'application/json; charset=UTF-8'
        },
        data: JSON.stringify({text:code, expectedOrderFormSections:["totalizers"] }),
        success: (response) => { 
          const value = (response.value)/100;
          callback(value); 
        },
        error: (error) => { callback(Number.POSITIVE_INFINITY); }
      });               
    }
  },

  opensky : {
    id: 13152,
    removePrevCode: (code, callback) => {
      const windowVariables = retrieveWindowVariables(["window.NREUM"]);
      const xpid = windowVariables["window.NREUM"].loader_config.xpid;
      const url = 'https://www.opensky.com/private-api/v5/carts/coupon';
      $.ajax({
        url: url,
        type: 'DELETE',
        headers:{
          'x-newrelic-id': xpid
        },
        success: (response) => { callback(); },
        error: (error) => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.order-total');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue));
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
      this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload(); 
      }.bind(this));
    },
    _applyCode: (code, callback) => {
      const windowVariables = retrieveWindowVariables(["window.NREUM"]);
      const xpid = windowVariables["window.NREUM"].loader_config.xpid;
      const url = 'https://www.opensky.com/private-api/v5/carts/coupon';
      $.ajax({
        url: url,
        type: 'PUT',
        headers:{
          'x-newrelic-id': xpid
        },
        data:{coupon : code},
        success: (response) => { 
          const value = response.properties.credit_card_amount;
          callback(value); },
        error: (error) => { callback(Number.POSITIVE_INFINITY); }
      });               
    }
  },

  atkins: {
    id: 17784,
    preApplyCodes: function(callback) {
     const elTotal = $('div:contains("Order Total:") + div');
     const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
     callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);      
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('[name="offer_code"]').value = bestCode;
      document.querySelector('[name="offer_code"]').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('[name="offer_code"]').dispatchEvent(new Event('change'));
      document.querySelector('#promo_code_apply').click();
    },
    _applyCode: (code, callback) => {
      const url = 'https://shop.atkins.com/Cart.aspx';
      $.ajax({
        url: url,
        type: 'POST',
        data: {formName: 'ApplyOrDeletePromotion', offer_code: code, promo_code_apply: 'apply'},
        success: (response) => { 
          const elTotal = $(response).find('div:contains("Order Total:") + div');
          const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
          callback(value);
         },
        error: () => { callback(Number.POSITIVE_INFINITY); },
        fail: () => { callback(Number.POSITIVE_INFINITY); }
      });                
    }
  },

  'parts-people': {
    id: 30290,
    preApplyCodes: function(callback) {
     const elTotal = $('#summaryTotal');
     const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
     callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
      const url = location.href;
      $.get(url, (responseGet) => {
        const elTotal = $(responseGet).find('#summaryTotal');
        const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
        callback(value);
      }).fail(function() { callback(Number.POSITIVE_INFINITY); });      
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();
     }.bind(this));
    },
    _applyCode: (code, callback) => {
      const url = 'https://www.parts-people.com/index.php?action=save_session&type=coupon&couponcode='+code;
      $.ajax({
        url: url,
        type: 'GET',
        success: () => { callback(); },
        error: () => { callback(); },
        fail: () => { callback(); }
      });                
    }
  },

  'electronicexpress': {
    id: 1945,
    preApplyCodes: function(callback) {
     const elTotal = $('.order-total .order-summary--value');
     const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
     callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);     
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.href = 'https://'+window.location.hostname+window.location.pathname;
     }.bind(this));
    },
    _applyCode: (code, callback) => {
      const url = 'https://www.electronicexpress.com/cart?promo='+code;
      $.ajax({
        url: url,
        type: 'GET',
        success: (responseGet) => { 
          const elTotal = $(responseGet).find('.order-total .order-summary--value');
          const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: () => { callback(Number.POSITIVE_INFINITY); },
        fail: () => { callback(Number.POSITIVE_INFINITY); }
      });                
    }
  },

  'onlinemetals': {
    id: 26911,
    preApplyCodes: function(callback) {
     const elTotal = $('#cartTotal');
     const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
     callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       const url = location.href;
       $.get(url, (responseGet) => {
        const elTotal = $(responseGet).find('#cartTotal');
        const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
        callback(value);
       }).fail(function() { callback(Number.POSITIVE_INFINITY); });      
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();
     }.bind(this));
    },
    _applyCode: (code, callback) => {
      const url = 'https://www.onlinemetals.com/en/cart/applyVoucher';
      const CSRFToken = $('[name="CSRFToken"]').val();
      $.ajax({
        url: url,
        type: 'POST',
        data:{voucherCode: code, CSRFToken : CSRFToken},
        success: () => { callback(); },
        error: () => { callback(); }
      });                
    }
  },

  'theapollobox': {
    id: 26911,
    preApplyCodes: function(callback) {
     const elTotal = $('.cart-summary__amount.total_price');
     const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
     callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       const url = location.href;
       $.get(url, (responseGet) => {
        const elTotal = $(responseGet).find('.cart-summary__amount.total_price');
        const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
        callback(value);
       }).fail(function() { callback(Number.POSITIVE_INFINITY); });      
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();
     }.bind(this));
    },
    _applyCode: (code, callback) => {
      const url = 'https://theapollobox.com/postUpdateCart';
      $.ajax({
        url: url,
        type: 'POST',
        data:{sku: 'couponCode', options : code, count:0},
        success: () => { callback(); },
        error: () => { callback(); }
      });                
    }
  },

  mottandbow: {
    id: 31277,
    removePrevCode: (code, callback) => {
      const url = 'https://www.mottandbow.com/checkout/cart/couponPost/';
      $.ajax({
        url: url,
        type: 'POST',
        data: {remove:"1", coupon_code:code },
        success: (response) => { callback(); },
        error: (error) => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.grand.totals .price');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('.discount.coupon').text();
      if(prevCode != ''){
        this.removePrevCode(prevCode, () => callback(prevValue,prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
      this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload(); 
      }.bind(this));
    },
    _applyCode: (code, callback) => {
      const url = 'https://www.mottandbow.com/checkout/cart/couponPost/';
      $.ajax({
        url: url,
        type: 'POST',
        data: {remove:"0", coupon_code:code },
        success: (response) => { 
          const value = response.grandTotalAmount;
          callback(value); },
        error: (error) => { callback(Number.POSITIVE_INFINITY); }
      });              
    }
  },

  '39dollarglasses': {
    id: 275,
    preApplyCodes: function(callback) {
     const elTotal = $('[data-qa="total-price"]');
     const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
     callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       const url = location.href;
       $.get(url, (responseGet) => {
        const elTotal = $(responseGet).find('[data-qa="total-price"]');
        const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
        callback(value);
       }).fail(function() { callback(Number.POSITIVE_INFINITY); });      
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
       this._applyCode(bestCode, function(value) {
        location.reload(); 
      }.bind(this));
    },
    _applyCode: (code, callback) => {
      const url = $('#coupon-apply-form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#coupon-apply-form'));
      formData['code'] = code;
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: (response) => { callback(); },
        error: () => { callback(); },
        fail: () => { callback(); }
      });                
    }
  },

  'lookhuman': {
    id: 23374,
    preApplyCodes: function(callback) {
     const elTotal = $('b:contains("Total") + span');
     const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
     callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       const url = location.href;
       $.get(url, (responseGet) => {
        const elTotal = $(responseGet).find('b:contains("Total") + span');
        const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
        callback(value);
       }).fail(function() { callback(Number.POSITIVE_INFINITY); });      
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
       this._applyCode(bestCode, function(value) {
        location.reload(); 
      }.bind(this));
    },
    _applyCode: (code, callback) => {
      const url = $('#couponGiftCardBox').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#couponGiftCardBox'));
      formData['code'] = code;
      $.ajax({
        url: 'https://www.lookhuman.com'+url,
        type: 'POST',
        data: formData,
        success: (response) => { callback(); },
        error: () => { callback(); },
        fail: () => { callback(); }
      });                
    }
  },

  blair: {
    id: 41577,
    removePrevCode: (code, callback) => {
      const windowVariables = retrieveWindowVariables(["__NEXT_DATA__"]);
      const brandName = windowVariables["__NEXT_DATA__"].props.store.configStore.config.brandName;
      const url = 'https://www.'+brandName+'.com/api/user-service/user/order/brand/'+brandName+'/promoCode/'+code;
      $.ajax({
        url: url,
        type: 'DELETE',
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('[data-testid="order-summary-order-total-value"]');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const windowVariables = retrieveWindowVariables(["__NEXT_DATA__"]);
      const prevCodeSelector = windowVariables["__NEXT_DATA__"].props.store.userStore.order.chosen.promoCodes;
      if(prevCodeSelector != ''){
        const prevCode = prevCodeSelector[0].value;
        console.log(prevCode);
        this.removePrevCode(prevCode, () => callback(prevValue,prevCode));
      }else{
        callback(prevValue);
      }        
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
      this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload(); 
      }.bind(this));
    },
    _applyCode: (code, callback) => {
      const windowVariables = retrieveWindowVariables(["__NEXT_DATA__"]);
      const brandName = windowVariables["__NEXT_DATA__"].props.store.configStore.config.brandName;
      const url = 'https://www.'+brandName+'.com/api/user-service/user/order/brand/'+brandName+'/promoCode/'+code;
      $.ajax({
        url: url,
        type: 'PUT',
        success: (response) => {
         const value = response.chosen.cart.price.total.amount;
         callback(value);
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });             
    }
  },

  'tirebuyer': {
    id: 26911,
    preApplyCodes: function(callback) {
     const elTotal = $('.orderTotal div.order-price');
     const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
     callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);     
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();
     }.bind(this));
    },
    _applyCode: (code, callback) => {
      const url = 'https://www.tirebuyer.com/tirebuyer/cart/ajax/coupon';
      $.ajax({
        url: url,
        type: 'POST',
        data:{couponcode : code},
        success: (response) => { 
          const elvalue = response.orderAmount;
          if(elvalue != null){
            const value = convertNumbers(elvalue.replace( /[^0-9.,]/g, '').trim());
            callback(value);
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
           },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });                
    }
  },

  'hamiltonbeach': {
    id: 17829,
    preApplyCodes: function(callback) {
     const elTotal = $('div:contains(Total:) + div:visible');
     const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
     const prevCode = $('#txtCheckoutCouponCode').val();
     if(prevCode != ''){
      callback(prevValue,prevCode);
     }else{
      callback(prevValue);
     }
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);     
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();
     }.bind(this));
    },
    _applyCode: (code, callback) => {
      const url = 'https://hamiltonbeach.com/services/shop/checkout/';
      $.ajax({
        url: url,
        type: 'POST',
        data:{action: 'change_shipping_coupon',couponCode : code},
        success: (data) => { 
          const response = JSON.parse(data);
          const value = response.order.total_amount;
          callback(value);
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });                
    }
  },

  'lifeextension': {
    id: 32064,
    preApplyCodes: function(callback) {
     const elTotal = $('div.order-summary table tbody tr:last span[data-bind="text: TotalOrder"], li:contains("Amount Due") + li:contains($)');
     const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
     callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);     
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));
    },
    _applyCode: (code, callback) => {
      const url = 'https://mycart-api.lifeextension.com/api/cart/ApplyMarketingCode?marketingCode='+code+'&force=true&includeShipments=false';
      $.ajax({
        url: url,
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        headers: {
          accept : 'application/json, text/plain, */*',
          cartroute: 'https://mycart.lifeextension.com/',
          clientreferer: 'https://mycart.lifeextension.com/'
        },
        success: (response) => {
          const value = response.amountDue;
          callback(value);
        },
        error: () => { callback(Number.POSITIVE_INFINITY); },
        fail: () => { callback(Number.POSITIVE_INFINITY); }
      });                
    }
  },


  raise: {
    id: 9797,
    removePrevCode: (code, callback) => {
      const locationUrl = 'https://www.raise.com/receipt-summary-totals';
      const csrfToken = $('meta[name="csrf-token"]').attr('content');
      $.ajax({
        url:  locationUrl,
        type: 'GET',
        headers :{ 'x-csrf-token' : csrfToken },
        success: (responseGet) => {
          const removeurl = $(responseGet).find('.remote-delete').attr('href');
          if(removeurl){
            $.ajax({
              url:  removeurl,
              type: 'DELETE',
              headers :{ 'x-csrf-token' : csrfToken },
              success: () => { callback(); },
              error: () => { callback(); }
            });
          }else{ callback(); } 
        },
        error: () => { callback(); }
      })
    },
    preApplyCodes: function(callback) {
      const elTotal = $('#checkout-total .summary .right');        
      const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      this.removePrevCode('code', () => callback(prevValue));     
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
      this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#order_coupon_code').value = bestCode;
      document.querySelector('#order_coupon_code').dispatchEvent(new MouseEvent('input', {bubbles: true}));
      document.querySelector('#checkout_apply_coupon_code input[name="commit"]').click();
    },
    _applyCode: (code, callback) => {
      const formData = getFormFieldsAsJson(document.querySelector('form#checkout_apply_coupon_code'));
      const url = 'https://www.raise.com/promotion_applications.json';
      formData['order[coupon_code]'] = code;
      const csrfToken = $('meta[name="csrf-token"]').attr('content');
      $.ajax({
        url:  url,
        type: 'POST',
        data: formData,
        headers :{ 'x-csrf-token' : csrfToken },
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: (response) => {           
          const locationUrl = 'https://www.raise.com/receipt-summary-totals';
          $.ajax({
            url:  locationUrl,
            type: 'GET',
            headers :{
              'x-csrf-token' : csrfToken
            },
            success: (responseGet) => {
              const elTotal = $(responseGet).find('.summary td.right');
              const value = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY; 
              callback(value);
            },
            error: () => { callback(Number.POSITIVE_INFINITY); }
          })
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });             
    }
  },

  gnc: {
    id: 190,
    removePrevCode: (code, callback) => {
      if(window.location.href.indexOf("cart") > -1){
        callback(); 
      }else{
        $.get('https://www.gnc.com/on/demandware.store/Sites-GNC2-Site/default/Cart-RemoveCouponJson?couponCode='+code+'&format=ajax', 
         (response) => { callback(); });
      }
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.checkout-order-totals tr.order-total td.order-value, #cart-order-summary .order-value');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('.remove-coupon');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.getAttribute('data-code');
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }           
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
      this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#dwfrm_billing_couponCode, #dwfrm_cart_couponCode').value = bestCode;
      document.querySelector('#dwfrm_billing_couponCode, #dwfrm_cart_couponCode').dispatchEvent(new MouseEvent('input', {bubbles: true}));
      document.querySelector('#add-coupon').click();
    },
    _applyCode: (code, callback) => {
      if(window.location.href.indexOf("cart") > -1){
        const url = $('#cart-items-form').attr('action');
        const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
        formData['dwfrm_cart_couponCode'] = code;
        formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
        $.post(url, formData, 
        (responsePost) => {
          $.get('https://'+window.location.hostname+'/cart', (response) => {
            const orderValueEl = $(response).find('.checkout-order-totals tr.order-total td.order-value, #cart-order-summary .order-value');
            const value = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;  
             callback(value);                 
          });
        }); 
      }else{
        const shipping_method_id = $('[name="dwfrm_singleshipping_shippingAddress_shippingMethodID"]:checked').val();
        $.get('https://www.gnc.com/on/demandware.store/Sites-GNC2-Site/default/Cart-AddCouponJson?couponCode='+code+'&format=ajax', 
         (response) => {
          $.get('https://www.gnc.com/on/demandware.store/Sites-GNC2-Site/default/COBilling-UpdateSummary?shipMethodId='+shipping_method_id, 
           (responseGet) => {
            const orderValueEl = $(responseGet).find('.checkout-order-totals tr.order-total td.order-value, #cart-order-summary .order-value');
            const value = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;  
             callback(value);   
          });
        });
      }            
    }
  },

  'designevo': {
    id: 34961,
    preApplyCodes: function(callback) {
     const elTotal = $('.c-payment__total span');
     const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.get(1).childNodes[0].nodeValue.replace(/[^0-9.,]/g,'').trim()) : 
                  Number.POSITIVE_INFINITY;
     callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        setTimeout(function(){
          const elTotal = $('.c-payment__total span');
          const prevValue = elTotal.length > 0 ? 
                      convertNumbers(elTotal.get(1).childNodes[0].nodeValue.replace(/[^0-9.,]/g,'').trim()) : 
                      Number.POSITIVE_INFINITY;
          callback(prevValue);
      }, 2000);    
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      // only one can be applied
    },
    _applyCode: (code, callback) => {
      try{  if(!document.querySelector('[placeholder="Coupon Code"]')){
        document.querySelector('.c-payment__coupon a').click();
      } }catch(e){}
      setTimeout(function(){
        document.querySelector('[placeholder="Coupon Code"]').value = code;
        document.querySelector('[placeholder="Coupon Code"]').dispatchEvent(new Event('input', { bubbles: true }));
        document.querySelector('[placeholder="Coupon Code"]').dispatchEvent(new Event('keyup'));
        document.querySelector('[placeholder="Coupon Code"]').dispatchEvent(new Event('blur'));
        document.querySelector('[placeholder="Coupon Code"]').dispatchEvent(new Event('focus'));
        document.querySelector('[placeholder="Coupon Code"]').dispatchEvent(new Event('change'));
        document.querySelector('.c-payment__coupon-content button').click();
        callback();
      }, 500);               
    }
  },

  emmiol: {
    id: 42994,
    removePrevCode: (code, callback) => {
      var ts = Math.round(new Date().getTime());
      const removeurl = 'https://cart.emmiol.com/co-cart-ac-handle.json?v='+ts;
      $.ajax({
        url:  removeurl,
        type: 'POST',
        headers :{ 'content-type' : 'application/json' },
        data:JSON.stringify({type: "clearCoupon"}),
        success: () => { callback(); }, error: () => { callback(); }
      })
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.my-shop-price.js-grantTotal');        
      const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      const prevCode = $('[name="code"]').val();
      if(prevCode != ''){
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }     
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
      this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));
    },
    _applyCode: (code, callback) => {
      var ts = Math.round(new Date().getTime());
      const addurl = 'https://cart.emmiol.com/co-cart-ac-info.json?v='+ts+'&pcode='+code;
      $.ajax({
        url:  addurl,
        type: 'GET',
        success: (response) => {
          const value = response.data.total.goods_price;
          callback(value);
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });             
    }
  },

  paintyourlife: {
    id: 7860,
    preApplyCodes: function(callback) {
      const elTotal = $('#grandtotal');        
      const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      const prevCode = $('[name="couponcode"]').val();
      if(prevCode != ''){
        callback(prevValue, prevCode)
      }else{
        callback(prevValue);
      }     
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
      callback(value)
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));
    },
    _applyCode: (code, callback) => {
      const subtotal  = $('[name="subtotal"]').val();
      const addurl = 'https://www.paintyourlife.com/validateCouponPainting.php?site=3&currancy=1&coupon='+code+'&subtot='+subtotal;
      $.ajax({
        url:  addurl,
        type: 'GET',
        success: (response) => {
          const locationUrl = location.href;
          $.ajax({
            url:  locationUrl,
            type: 'GET',
            success: (responseGet) => {
              const elTotal = $(responseGet).find('#grandtotal');
              const value = elTotal.length > 0 ? 
                      convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY; 
              callback(value);
            },
            error: () => { callback(Number.POSITIVE_INFINITY); }
          })
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });             
    }
  },

  'thewarmingstore' : {
    id: 24454,
    preApplyCodes: function(callback) {
      const elTotal = $('td:contains(Total) + td');
      const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      const form = document.querySelector('form[name="CheckoutForm"]');
      const url = $('form[name="CheckoutForm"]').attr('action');
      const formData = getFormFieldsAsJson(form);
      formData['gcPaymentDS.gcpayment_ROW0_redemptionCode'] = code;
      formData['eventName.updateGiftCertDataEvent'] = 'Apply';
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: (data, textStatus, request) => {
          const locationUrl = request.getResponseHeader('location');
           $.get(locationUrl, 
            (response) => {
              const elTotal = $(response).find('td:contains(Total) + td');
              const value = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
              callback(value);
          });
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#gc-redemption-code').value = bestCode;
      document.querySelector('#gc-redemption-code').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('#gc-redemption-code').dispatchEvent(new Event('keyup'));
      document.querySelector('#gc-redemption-code').dispatchEvent(new Event('blur')); 
      document.querySelector('#gc-redemption-code').dispatchEvent(new Event('focus'));        
      document.querySelector('#gc-redemption-code + input[value="Apply"]').click();
    }
  },

  chromeindustries: {
    removePrevCode: function(code, callback) {
      const url = $('#cart-items-form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
      formData['dwfrm_cart_coupons_i0_deleteCoupon'] = 'Remove';
      formData['dwfrm_cart_couponCode'] = '';
      $.get(url, formData, 
        (response) => {
          callback();
      }).fail(function() {
       callback();
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('div:contains("Estimated Total") + div');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue));
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      const url = $('#cart-items-form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
      formData['dwfrm_cart_couponCode'] = code;
      formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: (data, textStatus, request) => {
          const locationUrl = request.getResponseHeader('location');
           $.get(locationUrl, 
            (response) => {
              const elTotal = $(response).find('div:contains("Estimated Total") + div');
              const value = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
              callback(value);
          });
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  demandware1: {
    removePrevCode: function(code, uuid, callback) {
      const removeCouponUrl = $('.delete-coupon-confirmation-btn').attr('data-action');
      const url = 'https://'+window.location.hostname+removeCouponUrl + '?code=' + code + '&uuid=' + uuid; 
      $.ajax({
        url: url,
        type: 'GET',
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      console.log('demandware1');
      const elTotal = $('p.grand-total, span.grand-total-sum');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const el = $('button.remove-coupon');
      var url = null;
      if (el !== null && el !== undefined && el.length > 0) {
        const prevCode = el.attr('data-code');
        const uuid = el.attr('data-uuid');
        this.removePrevCode(prevCode,uuid, () => callback(prevValue, prevCode));
      } else {
        callback(prevValue);
      }     
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        $.get('https://'+window.location.hostname+window.location.pathname, (responseGet) => {
          const el = $(responseGet).find('button.remove-coupon');
          if (el !== null && el !== undefined && el.length > 0) {
            const uuid = el.attr('data-uuid');
            this.removePrevCode(code,uuid, () => callback(value));
          }else{
            callback(value);
          }      
        }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
        });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#couponCode').removeAttribute('disabled');
      document.querySelector('#couponCode').value = bestCode;
      document.querySelector('#couponCode').dispatchEvent(new MouseEvent('input', { bubbles: true } )); 
      document.querySelector('.promo-code-btn').removeAttribute('disabled');
      document.querySelector('.promo-code-btn').click();
    },
    _applyCode: (code, callback) => {      
      const csrf_token = $('input[name*="csrf_token"]').first().val();
      const addCouponUrl = $('.promo-code-form').attr('action');
      const url = 'https://'+window.location.hostname+addCouponUrl+'?couponCode=' + code +'&csrf_token=' + csrf_token;
      $.ajax({
        url: url,
        type: 'GET',
        success: (response, status, xhr) => {
          if (response !== null) {
            const totals = response.totals;
            if (totals !== null && totals !== undefined) {
              const value = totals.grandTotal !== null ? 
                  convertNumbers(totals.grandTotal.replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
              callback(value);                
              return;
            }
          }
          callback(Number.POSITIVE_INFINITY);
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });    
    },
  },

  demandware2: {
    removePrevCode: function(code, callback) {
      const url = $('form[name="dwfrm_cart"]').attr('action');
      const formData2 = getFormFieldsAsJson(document.querySelector('form[name="dwfrm_cart"]'));
      formData2['dwfrm_cart_coupons_i0_deleteCoupon'] = 'Remove';
      formData2['dwfrm_cart_updateCart'] = 'dwfrm_cart_updateCart';
      formData2['dwfrm_cart_couponCode'] = '';
      $.post(url, formData2,  (response) => { callback(); }).fail(function() {  callback(); });
    },
    preApplyCodes: function(callback) { 
      console.log('demandware2');
      const elTotal = $('.order-total td:last-child');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      this.removePrevCode('code', () => callback(prevValue)); 
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        if(window.location.href.indexOf("cart") > -1){
        this.removePrevCode(code, () => callback(value));
         }else{ callback(value); }
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#dwfrm_cart_couponCode, #dwfrm_billing_couponCode').value = bestCode;
      document.querySelector('#dwfrm_cart_couponCode, #dwfrm_billing_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('#add-coupon, #apply-coupon').click();   
    },
    _applyCode: function(code, callback) {
      const url = $('form[name="dwfrm_cart"]').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('form[name="dwfrm_cart"]'));
      formData['dwfrm_cart_couponCode'] = code;
      formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: (response, status, xhr) => {
          const elTotal = $(response).find('.order-total td:last-child');
          const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
          callback(value);              
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  onlinefabricstore: {
    id: 8230,
    removePrevCode: (code, callback) => {
     if(window.location.href.indexOf("shoppingcart") > -1){
      const removeurl = 'https://www.onlinefabricstore.com/shoppingcart/RemoveCouponCode';
      const roundedDownQuantity = $('#roundedDownQuantity').val();
      $.ajax({
        url:  removeurl,
        type: 'POST',
        data:{CouponCode: code, roundedDownQuantity : roundedDownQuantity},
        success: () => { callback(); }, error: () => { callback(); }
      })
     }else{
      const url = 'https://www.onlinefabricstore.com/ssl/shipping/GetTotals';
      const formData = getFormFieldsAsJson(document.querySelector('#shippingForm'));
      formData['CouponCode'] = '';
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: () => { callback(); },
        error: () => { callback(); }
      });
     }
    },
    preApplyCodes: function(callback) {
      const elTotal = $('#cartEstimatedTotal, #formatted_order_grandtotal');        
      const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      const prevCode = $('#CouponCode').val();
      if(prevCode != ''){
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }     
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
      this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));
    },
    _applyCode: (code, callback) => {
     if(window.location.href.indexOf("shoppingcart") > -1){
      const addurl = 'https://www.onlinefabricstore.com/shoppingcart/ApplyCouponCode';
      const roundedDownQuantity = $('#roundedDownQuantity').val();
      $.ajax({
        url:  addurl,
        type: 'POST',
        data:{CouponCode: code, roundedDownQuantity : roundedDownQuantity},
        success: (response) => {
          const value = response.OrderTotal.GrandTotal;
          callback(value);
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
     }else{
      const url = 'https://www.onlinefabricstore.com/ssl/shipping/GetTotals';
      const formData = getFormFieldsAsJson(document.querySelector('#shippingForm'));
      formData['CouponCode'] = code;
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: (response) => { 
          const value = response.OrderTotals.GrandTotal;
          callback(value); 
        },error: () => { callback(Number.POSITIVE_INFINITY); }
      });
     }     
    }
  },

  kipling: {
    removePrevCode: (code, callback) => {
     if(document.querySelector('#dwfrm_cart_couponCode')){
      const url = $('form[name="dwfrm_cart"]').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('form[name="dwfrm_cart"]'));
      formData['dwfrm_cart_coupons_i0_deleteCoupon'] = 'Remove';
      $.post(url, formData, 
        (response) => {
        callback();
      });
     }else{ callback(); }
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.bfx-total-grandtotal');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;     
      this.removePrevCode('code', () => callback(prevValue)); 
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
      this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('[name="dwfrm_cart_couponCode"], [name="dwfrm_billing_couponCode"]').value = bestCode;
      document.querySelector('[name="dwfrm_cart_couponCode"], [name="dwfrm_billing_couponCode"]').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('#add-coupon').click();
    },
    _applyCode: (code, callback) => {
     if(document.querySelector('#dwfrm_cart_couponCode')){
      const url = $('form[name="dwfrm_cart"]').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('form[name="dwfrm_cart"]'));
      formData['dwfrm_cart_couponCode'] = code;
      formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
      $.post(url, formData, 
      (responsePost) => {               
        const orderValueEl = $(responsePost).find('.bfx-total-grandtotal');
        const value = orderValueEl.length > 0 ? 
                  convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;  
        callback(value); 
      });
     }else{
      const addCouponUrl = 'https://www.kipling-usa.com/on/demandware.store/Sites-kip-Site/default/Cart-AddCoupon?couponCode='+code+'&format=ajax';
      const summaryRefreshURL = 'https://www.kipling-usa.com/on/demandware.store/Sites-kip-Site/default/COBilling-UpdateSummary';      
      $.get(addCouponUrl, () => {
        $.get(summaryRefreshURL, 
          (response) => {
            const orderValueEl = $(response).find('.bfx-total-grandtotal');
            const value = orderValueEl.length > 0 ? 
                  convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;  
            callback(value);
          });
      });
     }     
    }
  },

  decorplanet: {
    id: 13873,
    preApplyCodes: function(callback) {
      const elTotal = $('.grandTotal .price');        
      const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      callback(prevValue);    
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
      callback(value)
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));
    },
    _applyCode: (code, callback) => {
      const addurl = 'https://www.decorplanet.com/Includes/ShoppingCartService.aspx/SaveCoupon';
      $.ajax({
        url:  addurl,
        type: 'POST',
        headers: { 'content-type': 'application/json' },
        data:JSON.stringify({couponCode : code}),
        success: (response) => {
          const totalvalue = convertNumbers(response.d.GrandTotal);
          const taxValue = convertNumbers(response.d.TaxCost);
          const value = totalvalue - taxValue;
          callback(value);
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });             
    }
  },

  toolfarm: {
    removePrevCode: function(removeurl, callback) {
      const url = removeurl;
      $.get(url, (response) => { callback(); }).fail(function() { callback(); });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.panel-body div div:contains(Total) + div strong');
      const prevValue = elTotal.length > 0 ? 
                convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('.btn-delete[title="Remove Coupon From Cart"]');
      if(prevCodeSelector){
        const removeurl = prevCodeSelector.getAttribute('href');
        this.removePrevCode('https://www.toolfarm.com'+removeurl, () => callback(prevValue));
      }else{
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        const locationUrl = 'https://www.toolfarm.com/store/cart/index';
        $.get(locationUrl, 
        (response) => {
          const orderValueEl = $(response).find('.panel-body div div:contains(Total) + div strong');
          const value = orderValueEl.length > 0 ? 
                  convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
          const prevCodeSelector = $(response).find('.btn-delete[title="Remove Coupon From Cart"]');
          if(prevCodeSelector){
            const removeurl = prevCodeSelector[0].href;
            this.removePrevCode(removeurl, () => callback(value));
          }else{
            callback(value);
          }
        });       
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        const locationUrl = 'https://www.toolfarm.com/store/cart/index';
        location.href = locationUrl;
      });   
    },
    _applyCode: (code, callback) => {
      const url = '/store/cart/updateQuantity';
      $.ajax({
        url: 'https://www.toolfarm.com'+url,
        type: 'POST',
        data: {promo_code : code, yt0 : 'Apply'},
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
  },

  naturalizer: {
    preApplyCodes: function(callback) { 
      const elTotal = $('.bfx-total-grandtotal');
      const prevValue = elTotal.length > 0 ? 
                convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);   
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      const requestverificationtoken = $('[name="__RequestVerificationToken"]').val();
      const windowVariables = retrieveWindowVariables(["window.NREUM"]);
      const xpid = windowVariables["window.NREUM"].loader_config.xpid;
      const url = 'https://www.naturalizer.com/api/cxa/cart/ApplyDiscount?sc_site=Naturalizer';
      $.ajax({
        url: url,
        type: 'POST',
        headers:{
          '__requestverificationtoken' : requestverificationtoken,
          'x-newrelic-id' : xpid
        },
        data: {promotionCode: code, '__RequestVerificationToken': requestverificationtoken},
        success: (responsePost) => { 
          const value = responsePost.TotalAmount;
          callback(value);
         },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  precisionroller: {
    preApplyCodes: function(callback) { 
      const elTotal = $('#subtotal_display');
      const prevValue = elTotal.length > 0 ? 
                convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                Number.POSITIVE_INFINITY;
      const prevCode = $('input.coupon_code').val();
      if(prevCode != ''){
        callback(prevValue,prevCode);
      }else{
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);      
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        window.location = window.location.href.split("?")[0];
      });   
    },
    _applyCode: (code, callback) => {
      const form = document.querySelector('form#shopping-cart-form');
      const formData = getFormFieldsAsJson(form);
      formData['coupon_code'] = code;
      const url = form.getAttribute('action');
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: (response) => { 
          const orderValueEl = $(response).find('#subtotal_display');
          const value = orderValueEl.length > 0 ? 
                  convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  elitecme: {
    preApplyCodes: function(callback) { 
      const elTotal = $('.grandtotal:contains(Total) .row  span:not(:contains($0.00))');
      const prevValue = elTotal.length > 0 ? 
                convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);      
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        window.location = window.location.href.split("?")[0];
      });   
    },
    _applyCode: (code, callback) => {
      const form = document.querySelector('form#aspnetForm');
      const formData = getFormFieldsAsJson(form);
      formData['ctl00$ctl00$MasterContent$MasterContent$discountTextBox'] = code;
      formData['ctl00$ctl00$MasterContent$MasterContent$applyLink'] = 'Apply';
      formData['__ASYNCPOST'] = 'true';
      const url = form.getAttribute('action');
      $.ajax({
        url: 'https://checkout.elitecme.com'+url,
        type: 'POST',
        data: formData,
        success: (response) => { 
          const locationUrl = location.href;
          $.get(locationUrl, 
          (response) => {
            const orderValueEl = $(response).find('.grandtotal:contains(Total) .row  span:not(:contains($0.00))');
            const value = orderValueEl.length > 0 ? 
                    convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
            callback(value);
          });
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  mizunousa: {
    preApplyCodes: (callback) => {
      const orderValueEl = $('#EstTaxShipItemTable_estBasketTotal,.ml-summary-total .ml-accordion-summary-item-value, #mz-carttable-total, .mz-ordersummary-grandtotal');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        callback(value);      
     }.bind(this));
    },
    applyBestCode: (bestCode) => {
      try{
        document.querySelector('#coupon-code').value = bestCode;
        document.querySelector('#cart-coupon-code, [data-mz-action="addCoupon"]').removeAttribute('disabled'); 
        document.querySelector('#coupon-code').dispatchEvent(new Event('focus'));
        document.querySelector('#coupon-code').dispatchEvent(new Event('input', { bubbles: true }));
        document.querySelector('#coupon-code').dispatchEvent(new Event('keyup'));
        document.querySelector('#coupon-code').dispatchEvent(new Event('blur'));
        setTimeout(() => {  document.querySelector('#cart-coupon-code, [data-mz-action="addCoupon"]').click();  }, 2500);  
      }catch(e){
        document.querySelector('#sourceCode').value = bestCode;
        document.querySelector('#sourceCode').dispatchEvent(new Event('input', { bubbles: true }));
        document.querySelector('#sourceCode').dispatchEvent(new Event('keyup'));
        document.querySelector('#sourceCode').dispatchEvent(new Event('blur'));
        document.querySelector('#sourceCode').dispatchEvent(new Event('focus'));
        document.querySelector('#sourceCode').dispatchEvent(new Event('change'));
        document.querySelector('.sourceCodeApplyBtn, .ml-payment-source-code-apply div').click();
      }
    },
    _applyCode: (code, callback) => {
      var cartId, cartType;
      if(window.location.href.indexOf("cart") > -1){
        cartType = 'carts';
        cartId = $('[name="id"]').val();
      }else{
        const cartData = JSON.parse(document.getElementById("data-mz-preload-checkout").innerHTML);
        cartId = cartData.id;
        cartType = 'orders';
      }
      $.ajax({
        url: 'https://www.mizunousa.com/api/commerce/'+cartType+'/'+cartId+'/coupons/'+code,
        type: 'PUT',
        contentType: 'application/json',
        success: (response) => {
          if(response.discountedTotal){
            const value = response.discountedTotal;
            callback(value);
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        },error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });
    },
  },

  targetoptical: {
    id: 242, 
    preApplyCodes: function(callback) {
      const elTotal = $('#WC_SingleShipmentOrderTotalsSummary_td_13');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      const form = document.querySelector('#PromotionCodeForm');
      const formData = getFormFieldsAsJson(form);
      formData['promoCode'] = code;
      formData['requesttype'] = 'ajax';
      $.ajax({
        url: 'https://www.targetoptical.com/webapp/wcs/stores/servlet/AjaxPromotionCodeManage',
        type: 'POST',
        data: formData,
        success: (response, status, xhr) => {
          $.ajax({
            url: 'https://www.targetoptical.com/webapp/wcs/stores/servlet/AjaxOrderChangeServiceItemUpdate',
            type: 'POST',
            data: {
              orderId: '.',
              calculationUsage: '-1,-3,-4',
              requesttype: 'ajax'
            },
            success: (response, status, xhr) => {
              const url = `https://www.targetoptical.com/shop/ShopCartDisplayView?` + 
                `catalogId=${formData['catalogId']}&langId=${formData['langId']}&storeId=${formData['storeId']}`
              $.ajax({
                url: url,
                type: 'POST',
                data: {
                  objectId: '',
                  requesttype: 'ajax',
                  from_section: 'promocode'
                },
                success: (response, status, xhr) => {
                  const elTotal = $(response).find('#WC_SingleShipmentOrderTotalsSummary_td_13');
                  const value = elTotal.length > 0 ? 
                                convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                                Number.POSITIVE_INFINITY;
                  const formData2 = formData;
                  formData2['taskType'] = 'R';
                    $.ajax({
                      url: 'https://www.targetoptical.com/webapp/wcs/stores/servlet/AjaxPromotionCodeManage',
                      type: 'POST',
                      data: formData2,
                      success: () => { callback(value.toFixed(2)); },
                      error: () => { callback(value.toFixed(2)); }
                    });                    
                },
                error: (xhr, status, error) => {
                  callback(Number.POSITIVE_INFINITY);
                }
              });
            },
            error: (xhr, status, error) => {
              callback(Number.POSITIVE_INFINITY);
            }
          });
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });
    },
    applyBestCode: (bestCode) => {
      setTimeout(function(){
        document.querySelector('#promoCode').value = bestCode;
        document.querySelector('#promoCode').dispatchEvent(new Event('input', { bubbles: true }));
        document.querySelector('#promoCode').dispatchEvent(new Event('keyup'));
        document.querySelector('#promoCode').dispatchEvent(new Event('blur'));
        document.querySelector('#promoCode').dispatchEvent(new Event('focus'));
        document.querySelector('.to-add-promo-link').click();
      }, 500);
      
    }
  },

  supersmart: {
    removePrevCode: (code, callback) => {
      const url = 'https://us.supersmart.com/panier.pl?op=code_promo';
      $.get(url, 
        (response) => {
        callback();
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('#td_montant_total_2');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;     
      this.removePrevCode('code', () => callback(prevValue)); 
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
      this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        window.location = window.location.href.split("?")[0];
      });
    },
    _applyCode: (code, callback) => {
      const addCouponUrl = 'https://us.supersmart.com/panier.pl?op=code_promo&f=h&code_promo='+code;
      $.get(addCouponUrl, (response) => {
        const orderValueEl = $(response).find('#td_montant_total_2');
        const value = orderValueEl.length > 0 ? 
              convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
              Number.POSITIVE_INFINITY;  
        callback(value);
      });
    }
  },

  jeulia: {
    removePrevCode: function(code, callback) {
      const url = 'https://www.jeulia.com/checkout/cart/couponPost';
      $.post(url, { remove: 1, coupon_code: code }, 
      (response) => {  callback(); }).fail(function() { callback(); });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.amount strong .price, .total.grand .amount');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#discount-code').val();
      if(prevCode != ''){
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
        var url = 'https://www.jeulia.com/checkout/config/data';
        $.ajax({
          url: url,
          type: 'GET',
          success: (response) => {                  
            const value = response.totalsData.base_grand_total;
            this.removePrevCode(code, () => callback(value.toFixed(2)));
          },error: () => { 
            this.removePrevCode(code, () => callback(Number.POSITIVE_INFINITY));
          }
        });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
        location.reload();
      }) ;
    },
    _applyCode: (code, callback) => {
      const url = 'https://www.jeulia.com/checkout/cart/couponPost';
      $.ajax({
        url: url,
        type: 'POST',
        data: { remove: 0, coupon_code: code},
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
  },

  myka: {
    id: 29551, 
    preApplyCodes: function(callback) {
      const elTotal = $('.ShoppingCartTotalPriceCell');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      const url = document.querySelector('#test').getAttribute('action').substring('1')
      const formData = getFormFieldsAsJson(document.querySelector('#test'));
      formData['sourceCode'] = code;
      $.post('https://www.myka.com/'+url, formData, 
        (responsePost) => {
        $.get('https://www.myka.com/'+url, (response) => {
          const total = $(response).find('.ShoppingCartTotalPriceCell'); 
          const value = total.length > 0 ? 
                convertNumbers(total.text().replace( /[^0-9.,]/g, '').trim()) : 
                Number.POSITIVE_INFINITY;
          callback(value);                      
        });
      });       
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#MainContent_ShoppingCartCouponTextBox').value = bestCode;
      document.querySelector('#MainContent_ShoppingCartCouponTextBox').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('#MainContent_ShoppingCartCouponButton').click();  
    }
  },

  tanga: {
    id: 29551, 
    preApplyCodes: function(callback) {
      const elTotal = $('#grand_total');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       callback(value);
      }.bind(this));      
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function() {
        location.reload();
      }) ;
    },
    _applyCode: (code, callback) => {
      const url = document.querySelector('.coupon_code_container form').getAttribute('action');
      const formData = getFormFieldsAsJson(document.querySelector('.coupon_code_container form'));
      formData['code'] = code;
      $.post(url, formData, 
        (responsePost) => {
        $.get(location.href, (response) => {
          const total = $(response).find('#grand_total'); 
          const value = total.length > 0 ? 
                convertNumbers(total.text().replace( /[^0-9.,]/g, '').trim()) : 
                Number.POSITIVE_INFINITY;
          callback(value);                      
        });
      });
    },
  },

  kooding: {
    removePrevCode: function(code, callback) {
      const url = 'https://www.kooding.com/cart_removeCoupon';
      $.get(url, 
      (response) => { callback(); }).fail(function() { callback(); });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.order-total .number');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue));
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      const url = 'https://www.kooding.com/cart_applyCoupon?couponCode='+code;
      $.ajax({
        url: url,
        type: 'GET',
        success: (data) => {
          const response = JSON.parse(data);
          if(response.cartProductSku_total){
            const value = response.cartProductSku_total;
            callback(value);
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  dollardays: {
    id: 701,
    preApplyCodes: (callback) => {
      const orderValueEl = $('#checkout-affix table.table tbody tr  td.mobile-right, .order_histry h3 span');
      console.log(orderValueEl);
      const prevValue = orderValueEl.length > 0 ? 
                  convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) :
                  Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: (code, callback) => {
      const url = document.querySelector('#aspnetForm').getAttribute('action');
      const formData = getFormFieldsAsJson(document.querySelector('#aspnetForm'));
      formData['ctl00$cphContent$txtCouponCode'] = code;
      formData['__EVENTTARGET'] = 'ctl00$cphContent$btnApplyCode';
      $.post(url, formData, 
        (response) => {
          const orderValueEl = $(response).find('#checkout-affix table.table tbody tr  td.mobile-right, .order_histry h3 span');
          const value = orderValueEl.length > 0 ? 
                  convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
          callback(value);
        });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('input[name="ctl00$cphContent$txtCouponCode"]').value = bestCode;
      document.querySelector('input[name="ctl00$cphContent$txtCouponCode"]').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('input[name="ctl00$cphContent$btnApplyCode"]').click();
    }
  },

  rubberflooringinc: {
    preApplyCodes: function(callback) {
      const elTotal = $('#order-preview .lcr.sale-price div:contains("Total:") + div');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('#promo-code').val();;
      if(prevCode != ''){
        callback(prevValue, prevCode);
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
     this._applyCode(code, function(value) {
        const url = 'https://www.rubberflooringinc.com/oya/Cart/GetCart';
        $.ajax({
          url: url,
          type: 'POST',
          success: (response) => {                  
            const value = response.OrderSummary.OrderTotal;
            callback(value);
          },error: () => { 
            callback(Number.POSITIVE_INFINITY)
          }
        });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#promo-code-container input#promo-code').value = bestCode;
      document.querySelector('#promo-code-container input#promo-code').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('#promo-code-container input#promo-code').dispatchEvent(new Event('change'));
      document.querySelector('#submit-promo-code-link a.large.brand-color.button').click();
    },
    _applyCode: (code, callback) => {
      const url = 'https://www.rubberflooringinc.com/oya/Cart/ApplyPromo';
      $.ajax({
        url: url,
        type: 'POST',
        data: { promoCode: code},
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
  },

  threadsmenswear: {
    removePrevCode: function(code, callback) {
      const url = 'https://www.threadsmenswear.com/checkout/remove_discount/0';
      $.get(url, 
      (response) => { callback(); }).fail(function() { callback(); });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('#shipping_estimate_basket_total .product-content__price--inc, li.sub_total_ex_vat:contains("Total:") span.product-content__price--inc');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       const url = location.href;
       $.get(url, (responseGet) => {
        const elTotal = $(responseGet).find('#shipping_estimate_basket_total .product-content__price--inc, li.sub_total_ex_vat:contains("Total:") span.product-content__price--inc');
        const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
        callback(value)
       }).fail(function() { callback(Number.POSITIVE_INFINITY); });      
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      location.reload();  
    },
    _applyCode: (code, callback) => {
      const url = 'https://www.threadsmenswear.com/checkout/apply_discount_code/mybag';
      const formData = getFormFieldsAsJson(document.querySelector('#discount_code_form'));
      formData['discount_code'] = code;
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
  },

  zazzle: {
    removePrevCode: function(code, callback) {
      const windowVariables = retrieveWindowVariables(["ZENV"]);
      const csrf = windowVariables["ZENV"].csrf;
      $.ajax({
        url: 'https://www.zazzle.com/svc/z3/promotion/removePromo',
        type: 'POST',
        data: JSON.stringify({ client: "js", csrf: csrf, promoCode: code, returnCart: 'false', returnCheckoutData: 'true' }),
        xhr: function() {
          var xhr = jQuery.ajaxSettings.xhr();
          var setRequestHeader = xhr.setRequestHeader;
          xhr.setRequestHeader = function(name, value) {
              if (name == 'X-Requested-With') return;
              setRequestHeader.call(this, name, value);
          }
          return xhr;
        },
        contentType: 'application/json',
        headers: {
          'x-csrf-token': csrf
          },
        success: function() { callback(); },
        error: function() { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.Cart-subtotal, .CartPage_subtotal , .OrderTotal_totalLabel > span:contains(Order Total:) + span');
      const prevValue = elTotal.length > 0 ? 
              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
              Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('.PromoCode-promoLabel');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.innerText;
        this.removePrevCode(prevCode, () => callback(prevValue));
      }else{
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('.PromoCode .Input-input').value = bestCode;
      document.querySelector('.PromoCode .Input-input').dispatchEvent(new MouseEvent('input', {bubbles: true}));
      document.querySelector('.PromoCode button[type="submit"]').click();
    },
    _applyCode: (code, callback) => {
      var cartStatus = false;
      var checkoutStatus = true;
      if(window.location.href.indexOf("cart") > -1){
        cartStatus = true;
        checkoutStatus = false;
      }
      const windowVariables = retrieveWindowVariables(["ZENV"]);
      const csrf = windowVariables["ZENV"].csrf;
      $.ajax({
        url: 'https://www.zazzle.com/svc/z3/promotion/applyPromo',
        type: 'POST',
        data: JSON.stringify({ client: "js", csrf: csrf, promoCode: code, returnCart: cartStatus, returnCheckoutData: checkoutStatus }),
        xhr: function() {
          var xhr = jQuery.ajaxSettings.xhr();
          var setRequestHeader = xhr.setRequestHeader;
          xhr.setRequestHeader = function(name, value) {
              if (name == 'X-Requested-With') return;
              setRequestHeader.call(this, name, value);
          }
          return xhr;
        },
        contentType: 'application/json',
        headers: { 'x-csrf-token': csrf },
        success: function(data) {
          if(window.location.href.indexOf("cart") > -1){
            const value = data.data.cart ? data.data.cart.orderTotal : Number.POSITIVE_INFINITY;
            callback(value);
          }else{
            const value = data.data.orderTotal ? data.data.orderTotal.total : Number.POSITIVE_INFINITY;
            callback(value);
          }          
        },
        error: () => {
          callback(Number.POSITIVE_INFINITY);
        }
      });
    },
    getCSRF: function(callback) {
      $.ajax({
        url: 'https://www.zazzle.com/co/cart',
        type: 'GET',
        success: function(data) {
          callback(data.substr(data.indexOf("csrf") + 7, 17));
        }
      });
    }
  },

  keurig: {
    id: 5545,
    removePrevCode: function(code, callback) {
      const formData = getFormFieldsAsJson(document.querySelector('#applyCouponForm'));        
      formData['couponCode'] = code;
      $.ajax({
        url: 'https://www.keurig.com/coupons/removeCoupon',
        type: 'POST',
        data: formData,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: (responseGet) => {  callback(); },
        error: (responseGet) => {  callback(); }
      });
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.order-total span.right');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const prevCode = $('.remove_coupon_form [name="couponCode"]').val();
      if(prevCode != ''){
       this.removePrevCode(prevCode, () => callback(prevValue,prevCode)); 
      }else{
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {
      const formData = getFormFieldsAsJson(document.querySelector('#applyCouponForm'));        
      formData['couponCode'] = code;
        $.ajax({
          url: 'https://www.keurig.com/coupons/applyCoupon',
          type: 'POST',
          data: formData,
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          success: (responseGet) => {
            const elTotal = $(responseGet).find('.order-total span.right');
            const value = elTotal.length > 0 ? 
                    convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
            this.removePrevCode(code, () => callback(value));              
          },
          error: (xhr, status, error) => {
             callback(Number.POSITIVE_INFINITY);
          }
      });       
    },
    applyBestCode: (bestCode) => {
      document.querySelector('input[name="couponCode"]').value = bestCode;
      document.querySelector('input[name="couponCode"]').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('#couponCodeApply').click(); 
    }
  },

  kohls: {
    removePrevCode: function(code, callback) {
      var pageName = 'shopping_cart';
      if(window.location.href.indexOf("cart") > -1){
        pageName = 'cart';
      }
      $.ajax({
        url: 'https://'+window.location.hostname+'/cnc/removeCoupons?pageName='+pageName,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify([{ promoCode: code, couponType: "promo" }]),
        success: function() { callback(); },
        error: function() { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('#totalcharges, h4:contains(Total:) +, .cart-total-item-value');
      const value   = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      try  {  document.querySelector('.ordersummary_kohlscash .kohlscashapplylink, .kohlscashapplylink.tr_phase2_discount_a, .kohls-cash-promo-code a[href="javascript:void(0);"]').click();} catch(e) {}
      callback(value);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      var pageName = 'shopping_cart';
      if(window.location.href.indexOf("cart") > -1){
        pageName = 'cart';
      }
      $.ajax({
        url: 'https://'+window.location.hostname+'/cnc/applyCoupons?pageName='+pageName,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify([{ promoCode: code, couponType: "promo" }]),
        success: function(data) {
          if(data.cartJsonData){
            const value = data.cartJsonData.orderSummary.total;
            callback(value);
          }else{
            callback(Number.POSITIVE_INFINITY);
          }          
        },
        error: function() {
          callback(Number.POSITIVE_INFINITY);
        }
      });
    },
  },

  glassesusa: {
    id: 865,
    removePrevCode: function(code, callback) {
      const visitorId = getCookie('visitorId');
      $.ajax({
        url: 'https://'+window.location.hostname+'/backend/optimaxcart/react/removeCoupon?couponCode='+code,
        type: 'POST',
        headers: {
          'x-visitor-id': visitorId
        },
        success: () => { callback(); },
        error: () => { callback(); }
      })
    },
    preApplyCodes: function(callback) {
      const elTotal = $('#summary_grand_total, [title="Grand Total Price"]');
      const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      const prevCodeSelector  = $('[data-test-name="couponRemove"], span:contains("Codes applied") + span');
      if(prevCodeSelector.length > 0){
        if(window.location.hostname = 'm.glassesusa.com'){     
          var prevCode = prevCodeSelector.first().text();
        }else{
          var prevCode = prevCodeSelector.attr('data-test-value');
        }
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {      
      const visitorId = getCookie('visitorId');
      $.ajax({
        url: 'https://'+window.location.hostname+'/backend/optimaxcart/react/applyCoupon?couponCode='+code,
        type: 'POST',
        headers: {
          'x-visitor-id': visitorId
        },
        success: (response) => {
         if(response.total){
            const orderValueEl = response.total; 
            const value = convertNumbers(orderValueEl.replace( /[^0-9.,]/g, '').trim());
            this.removePrevCode(code, () => callback(value));
          }else{
            callback(Number.POSITIVE_INFINITY);
          }       
        },
        error: (xhr, status, error) => {
           callback(Number.POSITIVE_INFINITY);
        }
      });   
    },
    applyBestCode: (bestCode) => {
      document.querySelector('input[name="couponField"], [placeholder="Enter Coupon Code"]').value = bestCode;
      document.querySelector('input[name="couponField"], [placeholder="Enter Coupon Code"]').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('[data-test-name="couponSubmitButton"], [placeholder="Enter Coupon Code"] + div button').click();
    }
  },

  zaful_mob: {
    removePrevCode: function(code, callback) {
      $.ajax({
        url: 'https://cartm.zaful.com/m-flow-a-update_cart.html?operate=clearCoupon&pipeline=zf',
        success: function() { callback(); },
        error: function() { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.js_totalPrice');
      const prevValue   = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      this.removePrevCode('code', () => callback(prevValue));
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       const url = location.href;
       $.get(url, (responseGet) => {
        const elTotal = $(responseGet).find('.js_totalPrice');
        const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
        this.removePrevCode(code, () => callback(value));
       }).fail(function() { this.removePrevCode(code, () => callback(Number.POSITIVE_INFINITY)); });      
      }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      $.ajax({
        url: 'https://cartm.zaful.com/ajax/?cmd=cartPcodeApply&pipeline=&pcode='+code+'&pipeline=zf',
        type: 'GET',
        success: function() { callback(); },
        error: function() {  callback(); }
      });
    },
  },

  mytheresa: {
    preApplyCodes: function(callback) { 
      const elTotal = $('#shopping-cart-totals-table tfoot tr:last-child td:last-child .price');
      const prevValue   = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       const url = location.href;
       $.get(url, (responseGet) => {
        const elTotal = $(responseGet).find('#shopping-cart-totals-table tfoot tr:last-child td:last-child .price');
        const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
        callback(value);
       }).fail(function() { callback(Number.POSITIVE_INFINITY); });      
      }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      const url = $('#giftcard-form').attr('action');
      $.ajax({
        url: url,
        type: 'POST',
        data:{ redirectToCheckout: 0, coupon: code },
        success: function() { callback(); },
        error: function() {  callback(); }
      });
    },
  },

  babyshop: {
    removePrevCode: function(code, callback) {
      $.ajax({
        url: 'https://www.babyshop.com/cart/setcheckoutcode?checkoutcode=&partial=ajax-cart',
        type: 'POST',
        success: function() { callback(); },
        error: function() { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.cart-totals__value--grand-total.strong');
      const prevValue   = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      const prevCode = $('#checkout-code__input').val();
      if(prevCode!= ''){
        this.removePrevCode('code', () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));     
      }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      $.ajax({
        url: 'https://www.babyshop.com/cart/setcheckoutcode?checkoutcode='+code+'&partial=ajax-cart',
        type: 'POST',
        success: function(response) { 
         const elTotal = $(response).find('.cart-totals__value--grand-total.strong');
         const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
         callback(value);
        },
        error: function() {  callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  uksoccershop: {
    removePrevCode: function(code, callback) {
     callback();
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('#basket_order_total .cart-summary-value');
      const prevValue   = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      callback(prevValue);      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));     
      }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#couponinput').value = bestCode;
      document.querySelector('#couponinput').dispatchEvent(new Event('input', {bubbles: true}));
      $('#apply_promo').submit();
    },
    _applyCode: (code, callback) => {
      const url = $('#apply_promo').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#apply_promo'));
      formData['dc_redeem_code'] = code;
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: function(response) {
          const elTotal = $(response).find('#basket_order_total .cart-summary-value');
          const value = elTotal.length > 0 ? 
              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
              Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: function() {  callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  leam: {
    removePrevCode: function(code, callback) {
     if(window.location.href.indexOf("cart") > -1){
      var url = $('#discount-coupon-form').attr('action');
      var formData = getFormFieldsAsJson(document.querySelector('#discount-coupon-form'));
      formData['coupon_code'] = code;
      formData['remove'] = '1';      
     }else{
      var url = 'https://www.leam.com/en_en/firecheckout/index/saveCoupon/';
      var formData = getFormFieldsAsJson(document.querySelector('#firecheckout-form'));
      formData['coupon[code]'] = code;
      formData['coupon[remove]'] = '1';      
     }
     $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: function() { callback(); },
        error: function() { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('#shopping-cart-table > tfoot > tr.carrello-sotto.last > th:nth-child(6) > span,  #checkout-review-table > tfoot > tr.last > td.a-right.last > strong > span');
      const prevValue   = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      const prevCode = $('input#coupon_code, input#coupon-code').val();
      if(prevCode != ''){
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
       callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      if(window.location.href.indexOf("cart") > -1){
      var priceSelector = 'span.price';   
     }else{
      var priceSelector = 'strong span.price';     
     }
      this._applyCode(code, function(value) {
       const url = location.href;
       $.get(url, (responseGet) => {
        const elTotal = $(responseGet).find(priceSelector);
        const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.last().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
        this.removePrevCode(code, () => callback(value));
       }).fail(function() { this.removePrevCode(code, () => callback(Number.POSITIVE_INFINITY)); });      
      }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();    
      }.bind(this));
    },
    _applyCode: (code, callback) => {
     if(window.location.href.indexOf("cart") > -1){
      var url = $('#discount-coupon-form').attr('action');
      var formData = getFormFieldsAsJson(document.querySelector('#discount-coupon-form'));
      formData['coupon_code'] = code;
      formData['remove'] = '0';      
     }else{
      var url = 'https://www.leam.com/en_en/firecheckout/index/saveCoupon/';
      var formData = getFormFieldsAsJson(document.querySelector('#firecheckout-form'));
      formData['coupon[code]'] = code;
      formData['coupon[remove]'] = '0';      
     }
     $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: function() { callback(); },
        error: function() { callback(); }
      });
    },
  },

  partsgeek: {
    preApplyCodes: function(callback) { 
      const elTotal = $('div > .cart-total-value');
      const prevValue   = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      callback(prevValue);      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       const url = location.href;
       $.get(url, (responseGet) => {
        const elTotal = $(responseGet).find('div > .cart-total-value');
        const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.last().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
        callback(value)
       }).fail(function() {  callback(Number.POSITIVE_INFINITY) });      
      }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();    
      }.bind(this));
    },
    _applyCode: (code, callback) => {
      const url = 'https://www.partsgeek.com/cart/';
      $.ajax({
        url: url,
        type: 'POST',
        data: {coupon_code : code},
        success: function(response) { callback(); },
        error: function() { callback(); }
      });
    },
  },

  build: {
    removePrevCode: function(code, callback) {     
      const windowVariables = retrieveWindowVariables(["window.__AUTHTOKEN__"]);
      const auth_token = windowVariables["window.__AUTHTOKEN__"];
      $.ajax({
        url: 'https://'+window.location.hostname+'/graphql',
        type: 'POST',
        contentType: 'application/json',
        headers: {
                  'x-fergy-client-name': 'react-build-store',
                  'x-fergy-client-version' : '1547',
                  'authorization' : 'Bearer '+ auth_token
                },
        data: JSON.stringify([{
          operationName: 'RemoveCoupon',
          query: 'mutation RemoveCoupon($couponCode: String!) {  removeCoupon(couponCode: $couponCode) {    ... on Cart {      ...CartFields      __typename    }    ... on Error {      ...ErrorFields      __typename    }    __typename  }}fragment ErrorFields on Error {  code  message  __typename}fragment CartFields on Cart {  id  quantity   cartTotals {    subtotal    grandTotal    discountTotal    taxTotal    shippingTotal    hasProSavings    __typename  }  priceOverrideDetails {    hasPriceOverrides    couponMessage    __typename  }  __typename}',
          variables : {couponCode: code }
        }]),
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      console.log('build'); 
      const elTotal = $('#grandTotalVal, .grandTotalVal, #cart-grand-total, [data-automation="cart-grand-total"]');
      const prevValue = elTotal.length > 0 ? 
                convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                Number.POSITIVE_INFINITY;
      if(document.querySelector('[data-automation="remove-coupon-button"]')){
        var prevCode = document.querySelector('[data-automation="remove-coupon-button"]').textContent;
        this.removePrevCode('prevCode', () => callback(prevValue,prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();    
      }.bind(this));
    },
    _applyCode: (code, callback) => {
      const windowVariables = retrieveWindowVariables(["window.__AUTHTOKEN__"]);
      const auth_token = windowVariables["window.__AUTHTOKEN__"];
      $.ajax({
        url: 'https://'+window.location.hostname+'/graphql',
        type: 'POST',
        contentType: 'application/json',
        headers: {
                  'x-fergy-client-name': 'react-build-store',
                  'x-fergy-client-version' : '1547',
                  'authorization' : 'Bearer '+ auth_token
                },
        data: JSON.stringify([{
          operationName: 'ApplyCoupon',
          query: 'mutation ApplyCoupon($couponCode: String!) {  applyCoupon(couponCode: $couponCode) {    ... on Cart {      ...CartFields      __typename    }    ... on Error {      ...ErrorFields      __typename    }    __typename  }}fragment ErrorFields on Error {  code  message  __typename}fragment CartFields on Cart {  id  quantity   cartTotals {    subtotal    grandTotal    discountTotal    taxTotal    shippingTotal    hasProSavings    __typename  }  priceOverrideDetails {    hasPriceOverrides    couponMessage    __typename  }  __typename}',
          variables : {couponCode: code }
        }]),
        success: (response) => {
          if(response[0].data.applyCoupon.cartTotals){
            const value = response[0].data.applyCoupon.cartTotals.grandTotal;
            callback(value);
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        },
        error: (xhr, status, error) => {
           callback(Number.POSITIVE_INFINITY);
        }
      });
    },
  },

  rotita: {
    removePrevCode: function(code, callback) {
      const ts = Math.round(new Date().getTime());
      if(window.location.href.indexOf("cart") > -1){
        var step = 'cart';
      }else{
        var step = 'checkout';
      }
      const url = 'https://www.rotita.com/flow.php?step=check_hongbao&hb_sn=&js_step='+step+'&'+ts;
      $.ajax({
        url: url,
        type: 'GET',
        success: (response) => { callback(Number.POSITIVE_INFINITY); },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('#ot_total');
      const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      const prevCode = $('input[placeholder*="Enter code"], input[name="hb_sn"]').val();
      if(prevCode != ''){
        this.removePrevCode(prevCode, () => callback(prevValue,prevCode));
      }else{
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();    
      }.bind(this));  
    },
    _applyCode: (code, callback) => {
      if(window.location.href.indexOf("cart") > -1){
        var step = 'cart';
      }else{
        var step = 'checkout';
      }
      const ts = Math.round(new Date().getTime());
      const url = 'https://www.rotita.com/flow.php?step=check_hongbao&hb_sn='+code+'&js_step='+step+'&'+ts;
      $.ajax({
        url: url,
        type: 'GET',
        success: (data) => {const response = JSON.parse(data);
          const value = response.total.amount_formated;
          callback(value); 
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  arteza: {
    removePrevCode: function(code, callback) {
      var url = 'https://arteza.com/api/v1/cart/remove-discount-code';
      const windowVariables = retrieveWindowVariables(["app"]);
      const csrf_token = windowVariables["app"].csrf_token;
      const token = windowVariables["app"].state.cart.token;
      if(window.location.href.indexOf("checkout") > -1){
        url = 'https://arteza.com/api/v1/checkout/'+token+'/remove-discount-code';
      }      
      $.ajax({
        url: url,
        type: 'DELETE',
        headers:{
          'x-csrf-token' : csrf_token
        },
        success: function() { callback(); },
        error: function() { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.total__descr--est-total .price__new, .checkout .totals__item:last-child .item__value');
      const prevValue   = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('.total__discount-code .discount-code__chips, .sidebar__promo .promo__item .item__text');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.innerText;
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      var url = 'https://arteza.com/api/v1/cart/apply-discount-code';
      var formData = JSON.stringify({ code: code});
      const windowVariables = retrieveWindowVariables(["app"]);
      const csrf_token = windowVariables["app"].csrf_token;
      const token = windowVariables["app"].state.cart.token;
      if(window.location.href.indexOf("checkout") > -1){
        url = 'https://arteza.com/api/v1/checkout/'+token+'/apply-discount-code';
        formData = JSON.stringify({ discount: {code: code}});
      }
      $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        headers:{
          'x-csrf-token' : csrf_token
        },
        data: formData,
        success: function(data) {
          if(window.location.href.indexOf("checkout") > -1){
            const value = data.checkout.totals.total;
            callback(value);
          }else{
           if(data.total){
            const value = data.total;
            callback(value);
           }else{
              callback(Number.POSITIVE_INFINITY);
           }  
          }                  
        },
        error: function() {
          callback(Number.POSITIVE_INFINITY);
        }
      });
    },
  },

  galls: {
    removePrevCode: function(code, callback) {
      callback();
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.subtotal td:contains(Order Total) + td, .cart__pricing div:nth-child(3) strong, .row.checkout__subtotal--total:visible');
      const prevValue   = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      const prevCode = document.querySelector('.discount-form .input-text, #SISRCEI, #SISRCE').value;
      if(prevCode != ''){
        callback(prevValue, prevCode);
      }else{
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      const promobox = '.discount-form .input-text, #SISRCE, #SISRCEI';
      $(promobox)[0] && $(promobox).val(bestCode);
      setTimeout(function(){
       try{document.querySelector('#apply_source').click()}catch(e){}
       try{document.querySelector('.input__group--btn a').click()}catch(e){}
       try{document.querySelector('.step__payment .col-md-12 .input__flex--btn a').click()}catch(e){}   
      }, 1000);
    },
    _applyCode: (code, callback) => {
      var url = 'https://www.galls.com/'+$('form[name="f"]').attr('action');
      var formData = getFormFieldsAsJson(document.querySelector('form[name="f"]'));
      formData['SIACTN'] = 'APPLYSRCE';
      formData['SISRCEI'] = code;
      formData['SISRCE'] = code;
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: function(data) {
          const elTotal = $(data).find('.subtotal td:contains(Order Total) + td, .cart__pricing div:nth-child(3) strong, .row.checkout__subtotal--total');
          const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.last().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
          callback(value);               
        },
        error: function() {
          callback(Number.POSITIVE_INFINITY);
        }
      });
    },
  },

  tous: {
    removePrevCode: function(code, callback) {
      const windowVariables = retrieveWindowVariables(["window.__NUXT__"]);
      const hybris_code = windowVariables["window.__NUXT__"].state.site.hybris_code;
      const API_HYBRIS_KEY = windowVariables["window.__NUXT__"].env.API_HYBRIS_KEY;
      const API_AUTH = windowVariables["window.__NUXT__"].env.API_AUTH;
      const cartId = getCookie(hybris_code+'-cart');
      var url = 'https://www.tous.com/rest/v2/'+hybris_code+'/users/anonymous/carts/'+cartId+'/vouchers?voucherId='+code;
      $.ajax({
        url: API_AUTH,
        type: 'POST',
        headers:{
          'accept': 'application/json, text/plain, */*',
          'authorization': 'Basic d2ViX2V5OnNlY3JldA==',
          'rest-api-id' : API_HYBRIS_KEY,
          'x-tous-channel': 'WEB'
        },
        data:{grant_type: 'client_credentials'},
        success: function(response) { 
          const token = response.access_token;
          $.ajax({
            url: url,
            type: 'DELETE',
            headers:{
              'accept': 'application/json, text/plain, */*',
              'authorization': 'Bearer '+token,
              'rest-api-id' : API_HYBRIS_KEY,
              'x-tous-channel': 'WEB'
            },
            success: function() { callback();},
            error: function() { callback(); }
          });
        },
        error: function() { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('span:contains(Total):last + span');
      const prevValue   = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      const prevCode = document.querySelector('#promotional-code-form').value;
      if(prevCode != ''){
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
      const windowVariables = retrieveWindowVariables(["window.__NUXT__"]);
      const hybris_code = windowVariables["window.__NUXT__"].state.site.hybris_code;
      const API_HYBRIS_KEY = windowVariables["window.__NUXT__"].env.API_HYBRIS_KEY;
      const API_AUTH = windowVariables["window.__NUXT__"].env.API_AUTH;
      const cartId = getCookie(hybris_code+'-cart');
      var url = 'https://www.tous.com/rest/v2/'+hybris_code+'/users/anonymous/carts/'+cartId+'/vouchers?voucherId='+code;
      $.ajax({
        url: API_AUTH,
        type: 'POST',
        headers:{
          'accept': 'application/json, text/plain, */*',
          'authorization': 'Basic d2ViX2V5OnNlY3JldA==',
          'rest-api-id' : API_HYBRIS_KEY,
          'x-tous-channel': 'WEB'
        },
        data:{grant_type: 'client_credentials'},
        success: function(response) { 
          const token = response.access_token;
          $.ajax({
            url: url,
            type: 'POST',
            headers:{
              'accept': 'application/json, text/plain, */*',
              'authorization': 'Bearer '+token,
              'rest-api-id' : API_HYBRIS_KEY,
              'x-tous-channel': 'WEB'
            },
            success: function() {
              $.ajax({
                url: 'https://www.tous.com/rest/v2/'+hybris_code+'/users/anonymous/carts/'+cartId+'?fields=FULL&checkout=false&refreshCart=true',
                type: 'GET',
                headers:{
                  'accept': 'application/json, text/plain, */*',
                  'Rest-API-id' : API_HYBRIS_KEY,
                  'X-TOUS-CHANNEL': 'WEB'
                },
                success: function(response) { 
                  const value = response.totalPrice.value
                  callback(value);
                },
                error: function() { callback(Number.POSITIVE_INFINITY); }
              });
            },
            error: function() { callback(Number.POSITIVE_INFINITY); }
          });
        },
        error: function() { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  bitdefender: {
    preApplyCodes: function(callback) { 
      const elTotal = $('.totalPrice');
      const prevValue   = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      callback(prevValue);      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
          callback(value);
      }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.href = $('form[name="frmCheckout"]').attr('action').split('&')[0];
      }.bind(this));
    },
    _applyCode: (code, callback) => {
      var url = $('form[name="frmCheckout"]').attr('action').split('&')[0];
      var formData = getFormFieldsAsJson(document.querySelector('form[name="frmCheckout"]'));
      formData['Update'] = 'true';
      formData['coupon'] = code;
      formData['coupon_fake'] = code;
      for (var key in formData) {
        if (key.startsWith('rmv')) {
          delete formData[key];
        }
      }
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: function() {
         $.get(url, (responseGet) => {
          const elTotal = $(responseGet).find('#order__totals .order__total');
          const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.last().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
          callback(value);
         }).fail(function() { callback(Number.POSITIVE_INFINITY); });  
        },
        error: function() { callback(Number.POSITIVE_INFINITY);  }
      });
    },
  },

  lightology: {
    removePrevCode: function(code, callback) {
      callback();
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('#amt_payable_total');
      const prevValue   = elTotal.length > 0 ? 
                convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();
     }.bind(this));
    },
    _applyCode: (code, callback) => {
      var url = 'https://www.lightology.com/index.php?module=dispatcher';
      $.ajax({
        url: url,
        type: 'POST',
        data: {action:'apply_discount', discount_code : code},
        success: function(data) {
          const response = JSON.parse(data);
          const value = response.total;
          callback(value);               
        },
        error: function() {
          callback(Number.POSITIVE_INFINITY);
        }
      });
    },
  },

  burtsbees: {
    preApplyCodes: (callback) => {
      const orderValueEl = $('#cart-table .order-total .value span');
      const prevValue = orderValueEl.length > 0 ? 
                    convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: (code, callback) => {
      const url = $('#cart-items-form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
      formData['dwfrm_cart_couponCode'] = code;
      formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
      $.post(url, formData, 
        (response) => {
          const orderValueEl = $(response).find('#cart-table .order-total .value span');
          const value = orderValueEl.length > 0 ? 
                      convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                      Number.POSITIVE_INFINITY;
          callback(value);
        });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#dwfrm_cart_couponCode').value = bestCode;
      document.querySelector('#dwfrm_cart_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('#add-coupon').click();
    }
  },

  '1800lighting': {
    id: 3480,
    preApplyCodes: (callback) => {
      const orderValueEl = $('.order-total .order-value');
      const prevValue = orderValueEl.length > 0 ? 
                        convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                        Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: (code, callback) => {
      const url = $('#cart-items-form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#cart-items-form'));
      formData['dwfrm_cart_couponCode'] = code;
      formData['dwfrm_cart_addCoupon'] = 'dwfrm_cart_addCoupon';
      $.post(url, formData, 
        (response) => {
          const orderValueEl = $(response).find('.order-total .order-value');
          const value = orderValueEl.length > 0 ? 
                    convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
          callback(value);
        });
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#dwfrm_cart_couponCode').value = bestCode;
      document.querySelector('#dwfrm_cart_couponCode').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('#add-coupon').click();
    }
  },

  containerstore: {
    removePrevCode: function(code, callback) {
      callback();
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.bem-title-regular:contains("Subtotal") .float-right');
      const prevValue   = elTotal.length > 0 ? 
                convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
       location.reload();
     }.bind(this));
    },
    _applyCode: (code, callback) => {
      var url = $('#promo-code-form').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#promo-code-form'));
      formData['claimCode'] = code;
      formData['addPromotionCode'] = '';
      $.ajax({
        url: 'https://www.containerstore.com'+url,
        type: 'POST',
        data: formData,
        success: function(response) {
          const orderValueEl = $(response).find('.bem-title-regular:contains("Subtotal") .float-right');
          const value = orderValueEl.length > 0 ? 
                  convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
          callback(value);           
        },
        error: function() { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  smartpress: {
    id: 27770,
    removePrevCode: function(code, callback) {
      try{
        document.querySelector('.js-promoInputRemove').click();
        setTimeout(()=>{          
          callback();
        }, 2000); 
      }catch(e){}
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('span:contains("Subtotal:") + span');
      const elTotal_Value = elTotal.length > 0 ? 
               convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
               Number.POSITIVE_INFINITY;
      var discount_value = 0;
      const discount = $('.project-ft-totals-tally-promo  span:last');
      discount_value = discount.length > 0 ? 
             convertNumbers(discount.first().text().replace( /[^0-9.,]/g, '').trim()) : 
             0;
      const prevValue = elTotal_Value - discount_value;
      if(document.querySelector('.js-promoInputRemove')){
       this.removePrevCode('code', () => callback(prevValue));
      }else{        
        callback(prevValue);
      }
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        if(document.querySelector('.js-promoInputRemove')){
         this.removePrevCode('code', () => callback(value));
        }else{        
          callback(value);
        }
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#js-promoCodeInput').value = bestCode;
      try{   
        setTimeout(()=>{
          document.querySelector('#js-promoCodeInput').dispatchEvent(new Event('input', { bubbles: true }));
          document.querySelector('#js-promoCodeInput').dispatchEvent(new Event('keyup'));
          document.querySelector('#js-promoCodeInput').dispatchEvent(new Event('blur'));
          document.querySelector('#js-promoCodeInput').dispatchEvent(new Event('focus'));
          document.querySelector('.js-promoInputSubmit').click();   
        }, 1000); 
      }catch(e){}
    },
    _applyCode: (code, callback) => {
      document.querySelector('#js-promoCodeInput').value = code;      
      try{   
        setTimeout(()=>{
          document.querySelector('#js-promoCodeInput').dispatchEvent(new Event('input', { bubbles: true }));
          document.querySelector('#js-promoCodeInput').dispatchEvent(new Event('keyup'));
          document.querySelector('#js-promoCodeInput').dispatchEvent(new Event('blur'));
          document.querySelector('#js-promoCodeInput').dispatchEvent(new Event('focus'));
          document.querySelector('.js-promoInputSubmit').click();   
        }, 1000); 
      }catch(e){}
      setTimeout(function(){
        const subTotal = $('span:contains("Subtotal:") + span');
        const subTotal_value = subTotal.length > 0 ? 
               convertNumbers(subTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
               Number.POSITIVE_INFINITY;
        var discount_value = 0;
        const discount = $('.project-ft-totals-tally-promo  span:last');
        discount_value = discount.length > 0 ? 
               convertNumbers(discount.first().text().replace( /[^0-9.,]/g, '').trim()) : 
               0;
        const total = subTotal_value - discount_value;
        callback(total);
       }, 3000);
    },
  },

  halfpricedrapes: {
    removePrevCode: function(code, callback) {
      callback();
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.side-cart-total .side-cart-right');
      const prevValue   = elTotal.length > 0 ? 
                convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      var promobox = document.querySelector('input#txtPromoCode');
      var sbmbtn = document.querySelector('button.coupon-code-Apply');
      promobox.value = bestCode;
      promobox.dispatchEvent(new Event('input', {bubbles: true}));
      promobox.dispatchEvent(new Event('change'));sbmbtn.click();
    },
    _applyCode: (code, callback) => {
      var checkoutPage = 'Checkout';
      if(window.location.href.indexOf("cart") > -1){
        checkoutPage = 'AddToCart';
      }
      var url = 'https://www.halfpricedrapes.com/'+checkoutPage+'/ApplyPromoCode';
      $.ajax({
        url: url,
        type: 'POST',
        headers:{
          'content-type': 'application/json; charset=UTF-8'
        },
        data: JSON.stringify({txtPromoCode : code}),
        success: function(data) {
          const response = data.Summary;
          const orderValueEl = $(response).find('.side-cart-total .side-cart-right');
          const value = orderValueEl.length > 0 ? 
                  convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
          callback(value);           
        },
        error: function() { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  epson: {
    removePrevCode: function(code, callback) {
      const csrf_token = $('[name="CSRFToken"]').val();
      $.ajax({
        url: 'https://epson.com/checkout/multi/coupon/release',
        type: 'POST',
        data:{couponCode: code, CSRFToken : csrf_token},
        success: function() { callback(); },
        error: function() { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.totals');
      const prevValue   = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      const prevCodeSelector = document.querySelector('.coupon-code.at_coupon .code');
      if(prevCodeSelector){
        const prevCode = prevCodeSelector.innerText;
        this.removePrevCode(prevCode, () => callback(prevValue, prevCode));
      }else{
        callback(prevValue);
      }      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       const url = location.href;
       $.get(url, (responseGet) => {
        const elTotal = $(responseGet).find('.totals');
        const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
        this.removePrevCode(code, () => callback(value));
       }).fail(function() { this.removePrevCode(code, () => callback(Number.POSITIVE_INFINITY)); });      
      }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
      });   
    },
    _applyCode: (code, callback) => {
       const csrf_token = $('[name="CSRFToken"]').val();
      $.ajax({
        url: 'https://epson.com/checkout/multi/coupon/apply',
        type: 'POST',
        data:{couponCode: code, CSRFToken : csrf_token},
        success: function() { callback(); },
        error: function() { callback(); }
      });
    },
  },

  'ebonyline': {
    id : 27283,
    removePrevCode: function(code, callback) {
      const addCouponUrl = 'https://www.ebonyline.com/onestepcheckout/ajax/applyCoupon/';
      $.ajax({
        url: addCouponUrl,
        type: 'POST',
        data: {coupon_code : ''},
        success: (response) => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('#aw-onestepcheckout-review-table-cart-wrapper .a-right strong .price');
      const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue));      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        this.removePrevCode(code, () => callback(value));
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));   
    },
    _applyCode: (code, callback) => {
      const addCouponUrl = 'https://www.ebonyline.com/onestepcheckout/ajax/applyCoupon/';
      $.ajax({
        url: addCouponUrl,
        type: 'POST',
        data: {coupon_code :code},
        success: (response) => {
          const data = JSON.parse(response);
          const elTotal = data.grand_total; 
          if(elTotal && elTotal != ''){
            const value = convertNumbers(elTotal.replace( /[^0-9.,]/g, '').trim());
            callback(value);            
          }else{
            callback(Number.POSITIVE_INFINITY);
          }
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  'maxwarehouse_ac': {
    id: 42991, 
    preApplyCodes: function(callback) {
      const elTotal = $('.docapp-cart-subtotal span');
      const elTotal_Value = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      var shipping_Value = 0;
      const shippingText = $('.asm-shipping-method-selected .asm-cart-method-rate');
      shipping_Value = shippingText.length > 0 ? 
                    Number(shippingText.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    0;
      var discount_value = 0;
      const discount = $('.docapp-cart-discount span');
      discount_value = discount.length > 0 ? 
             convertNumbers(discount.first().text().replace( /[^0-9.,]/g, '').trim()) : 
             0;
      const prevValue = (elTotal_Value + shipping_Value ) - discount_value;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      const promobox = document.querySelector('[name="discount"], [name="temp-discount"]');
      promobox.value = code;      
      try{   
        setTimeout(()=>{
          promobox.dispatchEvent(new Event('input', { bubbles: true }));
          promobox.dispatchEvent(new Event('keyup'));
          promobox.dispatchEvent(new Event('blur'));
          promobox.dispatchEvent(new Event('focus'));
          document.querySelector('.docapp-coupon-input--button-text').click();
        }, 500); 
      }catch(e){}
      setTimeout(function(){
        const subTotal = $('.docapp-cart-subtotal span');
        const subTotal_value = subTotal.length > 0 ? 
               convertNumbers(subTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
               Number.POSITIVE_INFINITY;
        var shipping_Value = 0;
        const shippingText = $('.asm-shipping-method-selected .asm-cart-method-rate');
        shipping_Value = shippingText.length > 0 ? 
                    Number(shippingText.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    0;
        var discount_value = 0;
        const discount = $('.docapp-cart-discount span');
        discount_value = discount.length > 0 ? 
               convertNumbers(discount.first().text().replace( /[^0-9.,]/g, '').trim()) : 
               0;
        const total = (subTotal_value + shipping_Value ) - discount_value;
        callback(total);
       }, 4000);     
    },
    applyBestCode: (bestCode) => {
      document.querySelector('[name="discount"], [name="temp-discount"]').value = bestCode;
      document.querySelector('[name="discount"], [name="temp-discount"]').dispatchEvent(new Event('input', { bubbles: true } ));
      document.querySelector('.docapp-coupon-input--button-text').click();  
    }
  },

  'cheapcaribbean': {
    id : 547,
    removePrevCode: function(code, callback) {
      callback();
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('#siteContainer .cart-price tbody tr:contains(Total Price) th +td');
      const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue));      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       $.ajax({
        url: location.href,
        type: 'GET',
        success: (response) => {
          const orderValueEl = $(response).find('.cart-price tbody tr:contains(Total Price) th +td');
          const value = orderValueEl.length > 0 ? 
              convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
              Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));   
    },
    _applyCode: (code, callback) => {
      const url = 'https://book.cheapcaribbean.com'+$('#aspnetForm').attr('action');
      const formData = getFormFieldsAsJson(document.querySelector('#aspnetForm'));
      formData['__EVENTTARGET'] = '__ACTAP';
      formData['__ACTAP'] = 'APPLYPROMOTION';
      formData['ctl00$ctl01$ContentPlaceHolder$ContentPlaceHolder$ctl02$ctl02$ctl09$ApplyPromotionComponent$promocode'] = code;
      formData['ctl00$ctl01$ContentPlaceHolder$ContentPlaceHolder$ctl02$ctl02$ctl09$ApplyPromotionComponent$summaryCartApplyPromoBtn'] = 'Apply';
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: (response) => { callback(); },
        error: () => { callback(); }
      });
    },
  },

  'simplivlearning': {
    id: 34927,
    removePrevCode: function(code, callback) {
      callback();
    },
    preApplyCodes: function(callback) {
      const elTotal = $('.control-checkout-panel .total-block');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      var div_list = document.querySelectorAll('.table-row'); // returns NodeList      
      // converts NodeList to Array
      var div_array = [...div_list];
      var i=1;
      div_array.forEach((div, i) => {        
         setTimeout(function(){
          document.querySelector('.apply-coupon').click();
          setTimeout(function(){
            const promobox = document.querySelector('[name="coupon"]');
            promobox.value = code;      
            promobox.dispatchEvent(new Event('input', { bubbles: true }));
            promobox.dispatchEvent(new Event('keyup'));
            promobox.dispatchEvent(new Event('blur'));
            promobox.dispatchEvent(new Event('focus'));
            document.querySelector('.coupon-apply').click();
          }, 1000);   
        }, i*3000);  
      });
      var countDiv = div_array.length;
      setTimeout(function(){
        const subTotal = $('.control-checkout-panel .total-block');
        const total = subTotal.length > 0 ? 
               convertNumbers(subTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
               Number.POSITIVE_INFINITY;
        callback(total);
      }, countDiv*4000);      
    },
    applyBestCode: (bestCode) => {
     // do nothing all coupon applied     
    }
  },

  'shopify_cora': {
    id: 39774,
    preApplyCodes: function(callback) {
     const elTotal = $('.payment-due__price');
     const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
     const prevCode = $('.applied-discount__code').first().text();
     callback(prevValue,prevCode);
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       callback(value)      
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#checkout_discount_code').value = bestCode;
      document.querySelector('#checkout_discount_code').dispatchEvent(new MouseEvent('input', { bubbles: true } ));
      setTimeout(function(){
        document.querySelector('[data-trekkie-id="apply_discount_button"],#apply-discount,#apply_discount').click(); 
      }, 500);
    },
    _applyCode: (code, callback) => {
      const windowVariables = retrieveWindowVariables(["window.store_id"]);
      const store_id = windowVariables["window.store_id"];
      const cart_token = $('input[name="cart_token"]:last').val();
      const email = $('#checkout_email').val();
      const customer_email = email?email:'abcd@gmail.com';
      const url = 'https://'+window.location.hostname+'/shippingamount_responsive?store_id='+store_id+'&cart_token='+cart_token+'&discount_code='+code+'&customer_email='+customer_email;
      $.ajax({
        url: url,
        type: 'GET',
        success: (responseGet) => {
          const value = responseGet.total_amount;
          callback(value);
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        },
        fail: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });                
    }
  },

  'apexgamingpcs': {
    id: 46513,
    removePrevCode: function(code, callback) {
      callback();
    },
    preApplyCodes: function(callback) {
      var elTotal = $('.grid__item.one-half .cart__subtotal:last');
      if($('.grid__item.one-half .cart__subtotal:last .af_new_price').length > 0){
        elTotal = $('.grid__item.one-half .cart__subtotal:last .af_new_price');
      }
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      document.querySelector('#af_custom_coupon_text').value = code;
      document.querySelector('#af_custom_coupon_text').dispatchEvent(new MouseEvent('input', {bubbles: true}));
      document.querySelector('#af_custom_apply_coupon_trigger').click();
      setTimeout(function(){              
        var elTotal = $('.grid__item.one-half .cart__subtotal:last');
        if($('.grid__item.one-half .cart__subtotal:last .af_new_price').length > 0){
          elTotal = $('.grid__item.one-half .cart__subtotal:last .af_new_price');
        }
        const value = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
        callback(value);
      }, 2000);      
    },
    applyBestCode: (bestCode) => {
      document.querySelector('#af_custom_coupon_text').value = bestCode;
      document.querySelector('#af_custom_coupon_text').dispatchEvent(new MouseEvent('input', {bubbles: true}));
      document.querySelector('#af_custom_apply_coupon_trigger').click();   
    }
  },

  'springer': {
    id : 10186,
    removePrevCode: function(code, callback) {
      callback();
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('.prices-total .price, .order-details .total');
      const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue));      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       $.ajax({
        url: location.href,
        type: 'GET',
        success: (response) => {
          const orderValueEl = $(response).find('.prices-total .price, .order-details .total');
          const value = orderValueEl.length > 0 ? 
              convertNumbers(orderValueEl.first().text().replace( /[^0-9.,]/g, '').trim()) : 
              Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));   
    },
    _applyCode: (code, callback) => {
      const url = 'https://order.springer.com/public/coupon';
      $.ajax({
        url: url,
        type: 'POST',
        data: {coupon: code},
        success: (response) => { callback(); },
        error: () => { callback(); }
      });
    },
  },

  'farmandfleet': {
    id : 3470,
    removePrevCode: function(code, callback) {
      callback();
    },
    preApplyCodes: function(callback) { 
      const elTotal = $('#orderTotal div.order-total');
      const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      this.removePrevCode('prevCode', () => callback(prevValue));      
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
       callback(value);
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      this._applyCode(bestCode, function(value) {
        location.reload();
     }.bind(this));   
    },
    _applyCode: (code, callback) => {
      const url = 'https://www.farmandfleet.com/checkout/payment/apply-promo-code/';
      $.ajax({
        url: url,
        type: 'POST',
        data: {promoCode: code},
        success: (response) => { 
          const value = response.session.orderInfo.orderSummary.grandTotal;
          callback(value);
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
  },

  campingworld: {
    removePrevCode: function(code, uuid, callback) {
      const removeCouponUrl = $('.delete-coupon-confirmation-btn').attr('data-action');
      const url = 'https://'+window.location.hostname+removeCouponUrl + '?code=' + code + '&uuid=' + uuid; 
      $.ajax({
        url: url,
        type: 'GET',
        success: () => { callback(); },
        error: () => { callback(); }
      });
    },
    preApplyCodes: function(callback) {
      console.log('campingworld');
      const elTotal = $('p.grand-total, span.grand-total-sum');
      const prevValue = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
      const el = $('button.remove-coupon');
      var url = null;
      if (el !== null && el !== undefined && el.length > 0) {
        const prevCode = el.attr('data-code');
        const uuid = el.attr('data-uuid');
        this.removePrevCode(prevCode,uuid, () => callback(prevValue, prevCode));
      } else {
        callback(prevValue);
      }     
    },
    applyCode: function(code, callback) {
      this._applyCode(code, function(value) {
        $.get('https://'+window.location.hostname+window.location.pathname, (responseGet) => {
          const el = $(responseGet).find('button.remove-coupon');
          if (el !== null && el !== undefined && el.length > 0) {
            const uuid = el.attr('data-uuid');
            this.removePrevCode(code,uuid, () => callback(value));
          }else{
            callback(value);
          }      
        }).fail(function() {
            callback(Number.POSITIVE_INFINITY);
        });
     }.bind(this));
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#couponCode').removeAttribute('disabled');
      document.querySelector('#couponCode').value = bestCode;
      document.querySelector('#couponCode').dispatchEvent(new MouseEvent('input', { bubbles: true } )); 
      document.querySelector('.promo-code-btn').removeAttribute('disabled');
      document.querySelector('.promo-code-btn').click();
    },
    _applyCode: (code, callback) => {      
      const csrf_token = $('input[name*="csrf_token"]').first().val();
      const addCouponUrl = $('.promo-code-form').attr('action');
      const url = 'https://'+window.location.hostname+addCouponUrl+'?couponCode=' + code +'&csrf_token=' + csrf_token;
      $.ajax({
        url: url,
        type: 'GET',
        success: (response, status, xhr) => {
          if (response !== null) {
            const totals = response.totals;
            if (totals !== null && totals !== undefined) {
              const value = totals.grandTotalValueOrNull !== null ? 
                  convertNumbers(totals.grandTotalValueOrNull) : 
                  Number.POSITIVE_INFINITY;
              callback(value);                
              return;
            }
          }
          callback(Number.POSITIVE_INFINITY);
        },
        error: (xhr, status, error) => {
          callback(Number.POSITIVE_INFINITY);
        }
      });    
    },
  },

  'buydig' : {
    id: 34,
    preApplyCodes: function(callback) {
      const elTotal = $('#spOrderTotal');
      const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      const form = document.querySelector('form#Basket');
      const url = $('form#Basket').attr('action');
      const formData = getFormFieldsAsJson(form);
      formData['hCouponUpd'] = code;
      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: (data, textStatus, request) => {
          const locationUrl = request.getResponseHeader('location');
           $.get(locationUrl, 
            (response) => {
              const elTotal = $(response).find('#spOrderTotal');
              const value = elTotal.length > 0 ? 
                    convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                    Number.POSITIVE_INFINITY;
              callback(value);
          });
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
    applyBestCode: function(bestCode) {
      try{
        document.querySelector('#txtCoupon').value = bestCode;
        document.querySelector('#txtCoupon').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('#txtCoupon').dispatchEvent(new Event('change'));
        document.querySelector('div.form-inline button.btn02').click() 
      }catch{
        document.querySelector('input#c-promo-code__input').value = bestCode;
        document.querySelector('input#c-promo-code__input').dispatchEvent(new Event('input', {bubbles: true}));
        document.querySelector('input#c-promo-code__input').dispatchEvent(new Event('change'));
        document.querySelector('button#c-promo-code__submit').click();
      }
    }
  },

  'jomalone' : {
    id: 14421,
    preApplyCodes: function(callback) {
      const elTotal = $('#order-summary-panel th:contains(Estimated Total) + .price');
      const prevValue = elTotal.length > 0 ? 
                  convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
                  Number.POSITIVE_INFINITY;
      callback(prevValue);
    },
    applyCode: function(code, callback) {
      const form = document.querySelector('form#offer_code');
      const url = $('form#offer_code').attr('action');
      const formData = getFormFieldsAsJson(form);
      formData['OFFER_CODE'] = code;
      $.ajax({
        url: 'https://www.jomalone.com'+url,
        type: 'POST',
        data: formData,
        success: (response) => {
          const elTotal = $(response).find('#order-summary-panel th:contains(Estimated Total) + .price');
          const value = elTotal.length > 0 ? 
              convertNumbers(elTotal.first().text().replace( /[^0-9.,]/g, '').trim()) : 
              Number.POSITIVE_INFINITY;
          callback(value);
        },
        error: () => { callback(Number.POSITIVE_INFINITY); }
      });
    },
    applyBestCode: function(bestCode) {
      document.querySelector('#form--offer_code--field--OFFER_CODE').value = bestCode;
      document.querySelector('#form--offer_code--field--OFFER_CODE').dispatchEvent(new Event('input', {bubbles: true}));
      document.querySelector('#form--offer_code--field--OFFER_CODE').dispatchEvent(new Event('change'));
      document.querySelector('.offer_submit').click();
    }
  },


}


function extractFormValues(formSelector) {
    var formEl = document.querySelector(formSelector);
    var formFields = getFormFields(formEl);
    var requestData = new URLSearchParams('?' + formFields);
    requestData.action = formEl.action;
    return requestData;
}
  
function getFormFields(formEl) {
    var nodeNameRegexp = /^(?:input|select|textarea|keygen)/i;
    var nodeTypeRegexp = /^(?:submit|button|image|reset|file)$/i;
    var formFields = '';
  
    for (var i = 0; i < formEl.elements.length; i++) {
      var el = formEl.elements[i];
      if (nodeNameRegexp.test(el.nodeName) && !nodeTypeRegexp.test(el.type)) {
        if (el.type !== 'radio' && el.type !== 'select-multiple') {
          formFields = addFormField(formFields, el.name, el.value);
        } else if (el.type === 'radio' && el.checked) {
          formFields = addFormField(formFields, el.name, el.value);
        }
        el.type === 'select-multiple' && multipleCount++
      }
    }
    return formFields;
}

function getFormFieldsAsJson(formEl) {
  if (formEl === null || formEl === undefined) {
    return {};
  }

  var nodeNameRegexp = /^(?:input|select|textarea|keygen)/i;
  var nodeTypeRegexp = /^(?:submit|button|image|reset|file)$/i;
  var formFields = {};

  for (var i = 0; i < formEl.elements.length; i++) {
    var el = formEl.elements[i];
    if (nodeNameRegexp.test(el.nodeName) && !nodeTypeRegexp.test(el.type)) {
      if (el.name === null || el.name === undefined || el.length === 0) { continue; }
      if (el.type !== 'radio' && el.type !== 'select-multiple') {
        formFields[el.name] = el.value;
      } else if (el.type === 'radio' && el.checked) {
        formFields[el.name] = el.value;
      }
      el.type === 'select-multiple' && multipleCount++
    }
  }
  return formFields;
}

function addFormField(uri, name, value) {
    value = value.replace(/(\r)?\n/g, '\r\n');
    value = encodeURIComponent(value);
    value = value.replace(/%20/g, '+');
    return uri + (uri ? '&' : '') + encodeURIComponent(name) + '=' + value;
}
  
function sameOriginRequest(request, callback) {
    var headers = Object.keys(request.headers).map(function(header) {
      return `xhr.setRequestHeader('${header}', '${request.headers[header]}');`
    }).join('\n');
    var open = `xhr.open('${request.method}', '${request.url}');`
    var withCredentials = request.withCredentials ?
      `xhr.withCredentials = true;` : '';
    var send = `xhr.send('${request.body || ''}');`;
  
    var result = document.createElement('div');
    result.id = 'pb-autocoupons-eval-result';
    document.body.appendChild(result);
  
    var mutationCallback = function(mutationsList) {
      for(var mutation of mutationsList) {
        if (mutation.attributeName === 'result') {
          callback(document.getElementById(result.id).getAttribute('result'));
          observer.disconnect();
          result.remove();
          script.remove();
          break;
        }
      }
    };
  
    var observer = new MutationObserver(mutationCallback);
    observer.observe(result, { attributes: true });
  
    var script = document.createElement('script');
    script.type = 'text/javascript';
    code = `
      (function () {
        try {
          var xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
              document.getElementById('pb-autocoupons-eval-result').setAttribute('result', xhr.response);
            }
          };
          ${open}
          ${headers}
          ${withCredentials}
          ${send}
        } catch(e) {
          e.error = true;
          document.getElementById('pb-autocoupons-eval-result')
            .setAttribute('result', JSON.stringify(e, ['message', 'name', 'error']));
        }
      }())`;
    script.text = code;
    document.getElementsByTagName('head').item(0).appendChild(script);
}
  
function log(name, value) {
    console.log('!!! ' + name, value);
}
  
function HTMLParser(aHTMLString){
    var html = document.implementation.createDocument("http://www.w3.org/1999/xhtml", "html", null);
    var body = document.createElementNS("http://www.w3.org/1999/xhtml", "body");
    html.documentElement.appendChild(body);

    body.appendChild(Components.classes["@mozilla.org/feed-unescapehtml;1"]
        .getService(Components.interfaces.nsIScriptableUnescapeHTML)
        .parseFragment(aHTMLString, false, null, body));

    return body;
}
  
function getParam(parameter, url) {
    url = new URL(url || location.href);
    return url.searchParams.get(parameter);
}


function retrieveWindowVariables(variables) {
    var ret = {};

    var scriptContent = "";
    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        scriptContent += "if (typeof " + currVariable + " !== 'undefined') document.body.setAttribute('tmp_" + currVariable + "', JSON.stringify(" + currVariable + "));\n"
    }

    var script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(scriptContent));
    (document.body || document.head || document.documentElement).appendChild(script);

    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        ret[currVariable] = $.parseJSON($("body").attr("tmp_" + currVariable));
        $("body").removeAttr("tmp_" + currVariable);
    }

     $("#tmpScript").remove();

    return ret;
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function convertNumbers(totalData){
  var regexComma = new RegExp(/[,]\d{2}$/g,"i");
  var regexDecimal = new RegExp(/[.]\d{3}$/g,"i");
  if(totalData == Number.POSITIVE_INFINITY){
    totalData = Number.POSITIVE_INFINITY;
  }else if (String(totalData).match(regexComma)) {
    totalData = Number.parseFloat(String(totalData).replace(/[^0-9]/g, '').trim()/100);
  }else if(String(totalData).match(regexDecimal)){
    totalData = Number.parseFloat(String(totalData).replace(/[^0-9]/g, '').trim());
  }else{
    totalData = Number.parseFloat(String(totalData).replace(/[^0-9.]/g, '').trim());
  }
  return totalData;
}