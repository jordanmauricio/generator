(function($) {

    var params = {
        prop: "name",
        input: null,
        reset: null,
        preview: null,
    };

    var images = {};
    var methods = {
        init: function(args) {
            params = $.extend(params, args);
            if (params.input) {
                methods.input(params.input, params.preview);
            }
            if (params.reset) {
                methods.reset(params.input, params.reset, params.preview);
            }
        },
        getImage: function(input) {
            var image;
            var name = $(input).prop(params.prop);
            image = $(input).prop('files')[0];
            if (image) {
                images[name] = image;
                return image;
            }
            var image = images[name];
            if (image) {
                return image;
            }
            return null;
        },
        clearImage: function(inputDom) {
            delete images[$(inputDom).prop(params.prop)];
        },
        input: function(input, preview) {
            $(input).on('change', function() {
                var file = methods.getImage(this);
                if (!file) {
                    return;
                }
                methods.clearImage(input);
                var fr = new FileReader();
                fr.readAsDataURL(file);
                fr.onload = function() {

                    var cnv = $('<canvas id="leCanvas" width="1200" height="1000"></canvas>');
                    $(preview).empty().append(cnv);

                        var canvas = document.getElementById("leCanvas");
                        var context = canvas.getContext("2d");
                        context.globalCompositeOperation = "source-over";

                        var image = new Image();
                        image.src = this.result;

                    image.onload = function() {

                        var imgWidth = image.width;
                        var screenWidth  = $(window).width() - 20; 
                        var scaleX = 1;

                        if (imgWidth > screenWidth)
                            scaleX = screenWidth/imgWidth;

                        var imgHeight = image.naturalHeight;
                        var screenHeight = $(window).height() - canvas.offsetTop-10;
                        var scaleY = 1;

                        if (imgHeight > screenHeight)
                            scaleY = screenHeight/imgHeight;

                        var scale = scaleY;

                        if(scaleX < scaleY)
                            scale = scaleX;
                        if(scale < 1){
                            imgHeight = imgHeight*scale;
                            imgWidth = imgWidth*scale; 
                        }

                        canvas.height = imgHeight;
                        canvas.width = imgWidth;

                        context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0,0, imgWidth, imgHeight); 

                        var cityImage = new Image();
                        cityImage.src = "img/logo.png";
                        cityImage.onload = function() {
                            context.globalCompositeOperation = "source-over";
                            context.drawImage(cityImage, canvas.width*0.75, canvas.height*0.75, cityImage.width, cityImage.height);
                        };
                    };
                };
                
                images[$(input).prop(params.prop)] = file;
            });
        },
        reset: function(input, reset, preview) {
            $(reset).on('click', function() {
                $(input).val('');
                methods.clearImage(input);
                $(preview).empty();
            });
        }
    };
    
    $.fn.imagepreview = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.imagepreview');
        }
  };
})(jQuery);