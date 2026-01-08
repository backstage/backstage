import{j as t,T as i,c as m,C as a}from"./iframe-CIdfBUNc.js";import{w as n}from"./appWrappers-AgrnuiEj.js";import{s as p,H as s}from"./plugin-DYWiNART.js";import{c as d}from"./api-BjmP88h0.js";import{c}from"./catalogApiMock-SdvGNYzM.js";import{M as g}from"./MockStarredEntitiesApi-fJ6WkRvx.js";import{s as l}from"./api-DPo6etgd.js";import{C as h}from"./CustomHomepageGrid-Biqipsmt.js";import{H as f,a as u}from"./plugin-Ce5LEohf.js";import{e as y}from"./routes-glrX_FjV.js";import{s as w}from"./StarredEntitiesApi-DWkK6j6N.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-DS2HW8Ao.js";import"./useIsomorphicLayoutEffect-BNA5FOYt.js";import"./useAnalytics-DK0dZYSI.js";import"./useAsync-Cop8mLj-.js";import"./useMountedState-CxwBQu50.js";import"./componentData-CJ11DeEU.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-6Q4r393t.js";import"./useApp-DNuP2PYf.js";import"./index-D6HVU49s.js";import"./Plugin-Cal27Rxh.js";import"./useRouteRef-BtzOE2h6.js";import"./ref-C0VTUPuL.js";import"./lodash-Y_-RFQgK.js";import"./Add-XxbLzkS3.js";import"./Grid-CNMGd53o.js";import"./Box-2FUA-1uv.js";import"./styled-D6NhFGBl.js";import"./TextField-D895QToS.js";import"./Select-CQPO1yO8.js";import"./index-B9sM2jn7.js";import"./Popover--nM83zpc.js";import"./Modal-BoVNQ_gf.js";import"./Portal-CzMBs-js.js";import"./List-CWTfe060.js";import"./ListContext-BIMkaxMd.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DK88pbWk.js";import"./FormLabel-D0_abTgZ.js";import"./InputLabel-BDbJCZI4.js";import"./ListItem-Dfr179My.js";import"./ListItemIcon-ibuIbQe5.js";import"./ListItemText-CPW3cjiy.js";import"./Remove-MH9xywmj.js";import"./useCopyToClipboard-C5xquscJ.js";import"./Button-Ckh3f-JS.js";import"./Divider-DSMvF0Rh.js";import"./FormControlLabel-9JLnwXq4.js";import"./Checkbox-DqQv84BN.js";import"./SwitchBase-By9uE2rk.js";import"./RadioGroup-ChGqOCTG.js";import"./MenuItem-C8xqJzBa.js";import"./translation-FtOTboPc.js";import"./DialogTitle-D9_Z1_7w.js";import"./Backdrop-CX0eMuCq.js";import"./Tooltip-CiUyWjSw.js";import"./Popper-zpN6QrBD.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-B5-ZK_mY.js";import"./Edit-Cv3EajTm.js";import"./Cancel-CtQVc8hp.js";import"./Progress-Dn06jhVt.js";import"./LinearProgress-CDSuPOQP.js";import"./ContentHeader-Cl1MqUij.js";import"./Helmet-Cs0aJT-S.js";import"./ErrorBoundary-5twXAJLu.js";import"./ErrorPanel-BxCVrdam.js";import"./WarningPanel-CssXi-zs.js";import"./ExpandMore-CVq5yZzR.js";import"./AccordionDetails-Db8RrwKQ.js";import"./Collapse-C667vUQ9.js";import"./MarkdownContent-DeGRTh9e.js";import"./CodeSnippet-yQ1UvqA7.js";import"./CopyTextButton-B2Os4u3r.js";import"./LinkButton-DENdbCNl.js";import"./Link-BiOJGlt4.js";import"./useElementFilter-DWkD4G57.js";import"./InfoCard-JJieDDHR.js";import"./CardContent-DkWk2PaR.js";import"./CardHeader-CYD6avdX.js";import"./CardActions-DAFfhJ8c.js";import"./BottomLink-Wb3zLKXo.js";import"./ArrowForward-DWvoUq3l.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...e.parameters?.docs?.source}}};const oe=["CustomizableTemplate"];export{e as CustomizableTemplate,oe as __namedExportsOrder,ee as default};
