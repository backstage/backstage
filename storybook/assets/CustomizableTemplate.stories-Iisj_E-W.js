import{j as t,T as i,c as m,C as a}from"./iframe-DQwDoo1H.js";import{w as n}from"./appWrappers-DVOHFJoQ.js";import{s as p,H as s}from"./plugin-BapKG4_G.js";import{c as d}from"./api-BcrwAov6.js";import{c}from"./catalogApiMock-BEmnr2Op.js";import{M as g}from"./MockStarredEntitiesApi-DDoVR1jP.js";import{s as l}from"./api-C4Z_JmYp.js";import{C as h}from"./CustomHomepageGrid-DoA5U5Hq.js";import{H as f,a as u}from"./plugin-dmErilqI.js";import{e as y}from"./routes-CoelaV8m.js";import{s as w}from"./StarredEntitiesApi-CHa0Az8W.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-BprdzNtB.js";import"./useIsomorphicLayoutEffect-DKvvtE9T.js";import"./useAnalytics-CM26OCnx.js";import"./useAsync-NIOp2rsC.js";import"./useMountedState-nYgtVuR7.js";import"./componentData-CtVPpLvp.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-HojQYYpO.js";import"./useApp-DwlOIlXY.js";import"./index-BSAtJ84z.js";import"./Plugin-CD-n_nwk.js";import"./useRouteRef-ygb9ecnn.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-kJxrC07O.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-b8ie0u6I.js";import"./Grid-C1mkfO-A.js";import"./Box-8SFFKrct.js";import"./styled-B2hRU9Pw.js";import"./TextField-CYtj2hWr.js";import"./Select-uHHpJ4Uy.js";import"./index-DnL3XN75.js";import"./Popover-B_JVK-ll.js";import"./Modal-BBquywqf.js";import"./Portal-0E-kgImq.js";import"./List-mWa-4ocl.js";import"./ListContext-Cn7bnyCl.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DOzzInoz.js";import"./FormLabel-DNqh8cN2.js";import"./InputLabel-DfiOL0Uz.js";import"./ListItem-Dwvy6ya2.js";import"./ListItemIcon-C2FYgWxD.js";import"./ListItemText-BtoENYOw.js";import"./Remove-yK00nDae.js";import"./useCopyToClipboard-DsqKZmF6.js";import"./Button-DxB0Mkn2.js";import"./Divider-DgNlfm7L.js";import"./FormControlLabel-CLWoWNTy.js";import"./Checkbox-SWQwsXQI.js";import"./SwitchBase-BozatXfv.js";import"./RadioGroup-Dfo7C1YE.js";import"./MenuItem-CdIULn-8.js";import"./translation-CjU_LU7c.js";import"./DialogTitle-BfXc2ZX9.js";import"./Backdrop-BnvfdWzz.js";import"./Tooltip-BrI2VFSp.js";import"./Popper-CDaXhOQ8.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-BQ6VOHsY.js";import"./Edit-GafahYn6.js";import"./Cancel-DmA9nHYQ.js";import"./Progress-DTHiseEy.js";import"./LinearProgress-dVzfCjZ1.js";import"./ContentHeader-BF-Md5Nf.js";import"./Helmet-CfTezaAF.js";import"./ErrorBoundary-m70byrMj.js";import"./ErrorPanel-BmTSQtWv.js";import"./WarningPanel-DrLC6u8B.js";import"./ExpandMore-fAUa6rkR.js";import"./AccordionDetails-DSyZkU1w.js";import"./Collapse-BgsL6NY8.js";import"./MarkdownContent-u_spSNfd.js";import"./CodeSnippet-D0jouXxL.js";import"./CopyTextButton-CpIDND41.js";import"./LinkButton-yeg5JieK.js";import"./Link-Cd-y_3kz.js";import"./useElementFilter-D96IJ0zE.js";import"./InfoCard-BtXgYcU_.js";import"./CardContent-BD09Z7SB.js";import"./CardHeader-BqO5cyWU.js";import"./CardActions-BUmLQ9hm.js";import"./BottomLink-DsmJq7Bq.js";import"./ArrowForward-BWgfYpnj.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
