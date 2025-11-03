import{j as t,T as i,c as m,C as a}from"./iframe-D-w6RxGv.js";import{w as n}from"./appWrappers-BDndsqAl.js";import{s as p,H as s}from"./plugin-DkCkdPDp.js";import{c as d}from"./api-CWkSQ_sf.js";import{c}from"./catalogApiMock-CB6O2X-S.js";import{M as g}from"./MockStarredEntitiesApi-tmhRmzB9.js";import{s as l}from"./api-bH4IsLhq.js";import{C as h}from"./CustomHomepageGrid-BEr9aBMJ.js";import{H as f,a as u}from"./plugin-DpTs2s3G.js";import{e as y}from"./routes-D-3W244b.js";import{s as w}from"./StarredEntitiesApi-DUZ8HdKI.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-CKEb6xrB.js";import"./useIsomorphicLayoutEffect-BdbRXj_e.js";import"./useAnalytics-DPlXbgxY.js";import"./useAsync-BGWO1dGB.js";import"./useMountedState-CFUXa8RM.js";import"./componentData-BrNCABFb.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-BY4RoNki.js";import"./useApp-CFgLl9KI.js";import"./index-7uD0Pgum.js";import"./Plugin-CWxA29pF.js";import"./useRouteRef-DKWFMIlX.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-CTYViexQ.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-D1QSZkq9.js";import"./Grid-Dts7GzWa.js";import"./Box-PhnhPtmh.js";import"./styled-n-xY2yaY.js";import"./TextField-CBbSa-wt.js";import"./Select-5w4N0jKM.js";import"./index-DnL3XN75.js";import"./Popover-DFIQSwlD.js";import"./Modal-Ds0hJkbL.js";import"./Portal-DWcyIRvv.js";import"./List-CujjVc52.js";import"./ListContext-yRQd_P0Y.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DhGzy3_m.js";import"./FormLabel-BrWJM9yC.js";import"./InputLabel-B_AnQ5Zi.js";import"./ListItem-DC_Q_Qo-.js";import"./ListItemIcon-2J984Gth.js";import"./ListItemText-SKgMyQts.js";import"./Remove-BTRS8t2r.js";import"./useCopyToClipboard-D_vXHP6Q.js";import"./Button-BFjkR3wc.js";import"./Divider-CtO0jY8z.js";import"./FormControlLabel-5rjV6FGk.js";import"./Checkbox-CU4-4Stb.js";import"./SwitchBase-DYKa4YGj.js";import"./RadioGroup-BX7Qmp2_.js";import"./MenuItem-BJBqXcYr.js";import"./translation-DHqBwJJa.js";import"./DialogTitle-D3Q4uAmB.js";import"./Backdrop-D0MNdkqU.js";import"./Tooltip-D4tR_jXC.js";import"./Popper-Dx-ZWhUD.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-D-Boz1dO.js";import"./Edit-CzEhvnNI.js";import"./Cancel-Bcn43NM0.js";import"./Progress-yvjmVcSM.js";import"./LinearProgress-BPxQlr3u.js";import"./ContentHeader-1LppfHdc.js";import"./Helmet-CyhEo7Zh.js";import"./ErrorBoundary-DBPwAXOm.js";import"./ErrorPanel-BqOBprFq.js";import"./WarningPanel-8DIVHb20.js";import"./ExpandMore-BTmXorSC.js";import"./AccordionDetails-B5XR2THz.js";import"./Collapse-efa4O20L.js";import"./MarkdownContent---Ocrjn1.js";import"./CodeSnippet-CVxT4o4G.js";import"./CopyTextButton-CDPhBR-t.js";import"./LinkButton-cpdTg8QR.js";import"./Link-Dhe_VRcU.js";import"./useElementFilter-C_2RenGl.js";import"./InfoCard-9JWpIulp.js";import"./CardContent-Daj9kNFa.js";import"./CardHeader-BkE3ViQm.js";import"./CardActions-BCtx-_t5.js";import"./BottomLink-mVcObROK.js";import"./ArrowForward-D69vUWDI.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
