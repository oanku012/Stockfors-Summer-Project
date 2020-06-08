function InitializeCamera()
{
    var camera = this.cameras.main;

    var maxZoom = 3;
    var minZoom = 1;

    camera.startFollow(player, true, 0.08, 0.08);

    this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ){
        
        //Zooms camera in and out when using scroll wheel, zoom is stopped at min and max values
        if((camera.zoom - deltaY*0.05) > minZoom)
        {
            if((camera.zoom - deltaY*0.05) < maxZoom)
            {
                camera.setZoom(camera.zoom - deltaY*0.05); 
                debugText.setScale(1 /camera.zoom, 1/camera.zoom);
            }
            
        }
        else
        {
            camera.setZoom(minZoom);
            debugText.setScale(1 /camera.zoom, 1/camera.zoom);

        }        

        

        
    });
}