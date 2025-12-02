import{j as t,T as i,c as m,C as a}from"./iframe-C773ayyW.js";import{w as n}from"./appWrappers-DrF6lruE.js";import{s as p,H as s}from"./plugin-DPT5L4ox.js";import{c as d}from"./api-CfglKS02.js";import{c}from"./catalogApiMock-DfecX1Qz.js";import{M as g}from"./MockStarredEntitiesApi-DtoE5pVQ.js";import{s as l}from"./api-CDEXucDH.js";import{C as h}from"./CustomHomepageGrid-BTf4OkCB.js";import{H as f,a as u}from"./plugin-gEzBmSkr.js";import{e as y}from"./routes-cPfQklBb.js";import{s as w}from"./StarredEntitiesApi-D0cugF7v.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-BD2eLMSd.js";import"./useIsomorphicLayoutEffect-fSTRkWZD.js";import"./useAnalytics-BUXUfjUP.js";import"./useAsync-Dnv3cfj8.js";import"./useMountedState-BaRlQShP.js";import"./componentData-Bdgmno7t.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-B7-NdQX-.js";import"./useApp-p5rHYLk0.js";import"./index-ilx6tCZY.js";import"./Plugin-DgheCK0L.js";import"./useRouteRef-BO68tLin.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-R24TRMAM.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-DTTbtiP-.js";import"./Grid-oO_1iSro.js";import"./Box-c_uSXZkq.js";import"./styled-EjF9N2BZ.js";import"./TextField-DkQMGmRa.js";import"./Select-BlqkwCO1.js";import"./index-DnL3XN75.js";import"./Popover-BpAOnTzO.js";import"./Modal-t1QUaF78.js";import"./Portal-CQJvHB_7.js";import"./List-BAYQ25-v.js";import"./ListContext-BwXeXg0F.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-xPXTvgal.js";import"./FormLabel-ydHejLi2.js";import"./InputLabel-DbIYSzoW.js";import"./ListItem-ByJ_H4o2.js";import"./ListItemIcon-Dh3Gi0ic.js";import"./ListItemText-DjaDs-4M.js";import"./Remove-BtnZR2mJ.js";import"./useCopyToClipboard-CtMXT3me.js";import"./Button-gX2CQaIh.js";import"./Divider-DsftiJpK.js";import"./FormControlLabel-B6ZkVc7X.js";import"./Checkbox-DmYcTblD.js";import"./SwitchBase-CBsenC9D.js";import"./RadioGroup-K-Ogf91a.js";import"./MenuItem-BKoal5yo.js";import"./translation-B-abMGEN.js";import"./DialogTitle-C7AhKUgT.js";import"./Backdrop-CZK56ZrR.js";import"./Tooltip-BuBe4fE-.js";import"./Popper-C-ZRE_0u.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-Bt_3HpSw.js";import"./Edit-710VVOUD.js";import"./Cancel-BbQjuTgY.js";import"./Progress-BYa0Wco5.js";import"./LinearProgress-DyMFBSmI.js";import"./ContentHeader-DfPuDhbJ.js";import"./Helmet-Chu21SiF.js";import"./ErrorBoundary-84N5Onnv.js";import"./ErrorPanel-DHXJzEMk.js";import"./WarningPanel-CSA5ach2.js";import"./ExpandMore-Dc64qUSO.js";import"./AccordionDetails-CDPX87gH.js";import"./Collapse-CHxej2af.js";import"./MarkdownContent-ebJNHJdy.js";import"./CodeSnippet-C_E6kwNC.js";import"./CopyTextButton-DKZ84MGL.js";import"./LinkButton-BhVCLyOG.js";import"./Link-88zF7xCS.js";import"./useElementFilter-YP4KIN5q.js";import"./InfoCard-DpchVZYW.js";import"./CardContent-0uyrcITt.js";import"./CardHeader-BR9PWCtj.js";import"./CardActions-BW9rpFHQ.js";import"./BottomLink-C-ywMqKi.js";import"./ArrowForward-DJtOLu8h.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  // This is the default configuration that is shown to the user
  // when first arriving to the homepage.
  const defaultConfig = [{
    component: 'HomePageSearchBar',
    x: 0,
    y: 0,
    width: 12,
    height: 5
  }, {
    component: 'HomePageRandomJoke',
    x: 0,
    y: 2,
    width: 6,
    height: 16
  }, {
    component: 'HomePageStarredEntities',
    x: 6,
    y: 2,
    width: 6,
    height: 12
  }];
  return <CustomHomepageGrid config={defaultConfig} rowHeight={10}>
      // Insert the allowed widgets inside the grid. User can add, organize and
      // remove the widgets as they want.
      <HomePageSearchBar />
      <HomePageRandomJoke />
      <HomePageStarredEntities />
    </CustomHomepageGrid>;
}`,...e.parameters?.docs?.source}}};const ae=["CustomizableTemplate"];export{e as CustomizableTemplate,ae as __namedExportsOrder,me as default};
