# LRGeoChart

Liferay GeoChart has been created to show an example of a complex web component which accepts slots to pass content and configuration.

The default component HTML Tag Structure is the following:
```
<lr-geo-chart>
  <config country="AE,SA" paddingX="50" paddingY="50" map-color="#000000" border-color="#FF0000" height="70vh" zoomControls="True" wheelZoom="true"></config>
  <point name="point 1" lat="23.875260" lng="52.501620" color="#0000FF" description="" href="123"></point>
  <point name="point 2" lat="25.0524372" lng="55.4755801" color="#000000" description="" href="aS"></point>
  <point name="point 3" lat="24.1680221" lng="55.5239997" color="#001111" description="" href=""></point>
</lr-geo-chart>
```
Inorder to use LRGeoChart please do the following:
1. Navigate to Global Menu -> Remote Apps
2. Click on add JS
3. Provide LRGeoChart built JS URL "Hosted on Liferay or on a remote server"
4. Navigate to Pages Configuration -> Advanced
5. Add JavaScript Client Extension and Select LRGeoChart
6. Create A new Fragment and add the Element Tag

Example Fragment Code:

```aidl

[#assign isEdit=false]
            [#if themeDisplay.isSignedIn()]
            [#assign req = request.getRequest()]
            [#assign originalRequest = portalUtil.getOriginalServletRequest(req)]
            [#if originalRequest.getParameter("p_l_mode")??]
            [#assign isEdit=true]
            [/#if]
            [/#if]

[#if !isEdit]
<lr-geo-chart>
	<config country="AE" map-color="#fFffff" border-color="#FF0000" height="60vh" paddingX="50" paddingY="75"></config>
[/#if]
	<lfr-drop-zone>
		
	</lfr-drop-zone>
[#if !isEdit]
</lr-geo-chart>
[/#if]
```
