import{j as t,T as i,c as m,C as a}from"./iframe-D4YkWMPd.js";import{w as n}from"./appWrappers-BdS3ZXd0.js";import{s as p,H as s}from"./plugin-DbSWKguG.js";import{c as d}from"./api-CHa4E_yJ.js";import{c}from"./catalogApiMock-iR8sMwec.js";import{M as g}from"./MockStarredEntitiesApi-CM4bYYSs.js";import{s as l}from"./api-DzNVbBJY.js";import{C as h}from"./CustomHomepageGrid-ChBmonOG.js";import{H as f,a as u}from"./plugin-seGdHiiS.js";import{e as y}from"./routes-Cexw77UQ.js";import{s as w}from"./StarredEntitiesApi-chuiYc2p.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-DbwS_JUV.js";import"./useIsomorphicLayoutEffect-CKq4zRUd.js";import"./useAnalytics--ii2Xnv1.js";import"./useAsync-DFwDLbfT.js";import"./useMountedState-BZeJdOiH.js";import"./componentData-C4oKpH_t.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-Cb5ApCX3.js";import"./useApp-BYOY4yJv.js";import"./index-DcRSVOOI.js";import"./Plugin-CS5_JnCA.js";import"./useRouteRef-Dr-zIQ4_.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-CTc4VaHi.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-9OaCxchL.js";import"./Grid-3dbGowTG.js";import"./Box-CrXhOgBb.js";import"./styled-dYo-GhGI.js";import"./TextField-CBSTYjvN.js";import"./Select-BhFottL8.js";import"./index-DnL3XN75.js";import"./Popover-Dw74DHDI.js";import"./Modal-BPzxcCH2.js";import"./Portal-GmGr81qv.js";import"./List-DbiJVjlG.js";import"./ListContext-C8PRUhDY.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-B7C4jEin.js";import"./FormLabel-BYcqQo28.js";import"./InputLabel-CzOloBn8.js";import"./ListItem-C4617hHA.js";import"./ListItemIcon-Ce9KgSHe.js";import"./ListItemText-C8w1SX_U.js";import"./Remove-CChnKvRT.js";import"./useCopyToClipboard-CXAMfyh-.js";import"./Button-bLTRgJ4c.js";import"./Divider-DoiUQK47.js";import"./FormControlLabel-BgF-Cn3_.js";import"./Checkbox-BeoC-0jR.js";import"./SwitchBase-CuC476wl.js";import"./RadioGroup-Di8wGPJ7.js";import"./MenuItem-v5Mx3ggq.js";import"./translation-CqtaOUVa.js";import"./DialogTitle-ikIQGFRt.js";import"./Backdrop-BWtXXt1T.js";import"./Tooltip-BBJrGxop.js";import"./Popper-BtazmgWL.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-CXv5yPTl.js";import"./Edit-DwWgEK3W.js";import"./Cancel-B8GYwD0B.js";import"./Progress-DWM47Cgj.js";import"./LinearProgress-zeJch42r.js";import"./ContentHeader-DWlkZy0J.js";import"./Helmet-Y12WVmhv.js";import"./ErrorBoundary-Dj_BdtLc.js";import"./ErrorPanel-geXzwKYb.js";import"./WarningPanel-CPZUUyuU.js";import"./ExpandMore-Bpioo4yy.js";import"./AccordionDetails-DKrusFPL.js";import"./Collapse-CyHojAhw.js";import"./MarkdownContent-DNug9PDQ.js";import"./CodeSnippet-Dl0gP_YZ.js";import"./CopyTextButton-GQ6DbX_U.js";import"./LinkButton-bYk9cqtO.js";import"./Link-Cg_HU4j2.js";import"./useElementFilter-BajLCaw4.js";import"./InfoCard-DekS9cui.js";import"./CardContent-CH-NP11H.js";import"./CardHeader-B1-VM8pp.js";import"./CardActions-CBi48CeD.js";import"./BottomLink-Ckmh1WY3.js";import"./ArrowForward-ZRQV-YG0.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
