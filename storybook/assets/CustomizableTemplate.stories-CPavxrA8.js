import{j as t,T as i,c as m,C as a}from"./iframe-DEXNC9RX.js";import{w as n}from"./appWrappers-ZgtTfHmd.js";import{s as p,H as s}from"./plugin-Ba6MFlQU.js";import{c as d}from"./api-C1FjDT_g.js";import{c}from"./catalogApiMock-jUzm9IM-.js";import{M as g}from"./MockStarredEntitiesApi-Bytp7tBa.js";import{s as l}from"./api-CHBY8DA5.js";import{C as h}from"./CustomHomepageGrid-BHQOanYj.js";import{H as f,a as u}from"./plugin-CLlU_Cp6.js";import{e as y}from"./routes-C4P7bv7U.js";import{s as w}from"./StarredEntitiesApi-un6zqluA.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-pijbHhQ1.js";import"./useIsomorphicLayoutEffect-RgkXVcsu.js";import"./useAnalytics-DzYvNwaC.js";import"./useAsync-BAn5CjI7.js";import"./useMountedState-DIp_Aeij.js";import"./componentData-CWUzWtHA.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BlCxWptt.js";import"./useApp-CPRzbwsy.js";import"./index-Dt0Qv5kz.js";import"./Plugin-C9BoD7po.js";import"./useRouteRef-ZxZLNpb-.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./Add-Glef1XAs.js";import"./Grid-DwntcsAr.js";import"./Box-BngrI2dT.js";import"./styled-B4iJQM5t.js";import"./TextField-yZdrxO-c.js";import"./Select-BneXbUnN.js";import"./index-B9sM2jn7.js";import"./Popover-Deo6ztQs.js";import"./Modal-qxnLeQlM.js";import"./Portal-O6zOHTQ9.js";import"./List-861P7w9f.js";import"./ListContext-CuQ6sOnh.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-20wdBt-x.js";import"./FormLabel-Bsn6tYTR.js";import"./InputLabel-C-60XYv7.js";import"./ListItem-BsFeXcoa.js";import"./ListItemIcon-Dp4eEMxb.js";import"./ListItemText-SZBW9x2i.js";import"./Remove-BKL339cZ.js";import"./useCopyToClipboard-DLmeDm8w.js";import"./Button-F3mebnqD.js";import"./Divider-DNnZbvf9.js";import"./FormControlLabel-Dl8wtRn8.js";import"./Checkbox-jiWQCXd3.js";import"./SwitchBase-jHklRqhg.js";import"./RadioGroup-BpasChtK.js";import"./MenuItem-5cijl-Ac.js";import"./translation-B4Ln-hC2.js";import"./DialogTitle-Cdw2QC1n.js";import"./Backdrop-DWlQwWtV.js";import"./Tooltip-B5JVDv03.js";import"./Popper-Dtp4XQPR.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-DpAERUcn.js";import"./Edit-3_eUqQqB.js";import"./Cancel-B1TjmEUT.js";import"./Progress-pkY770fm.js";import"./LinearProgress-B1mWueke.js";import"./ContentHeader-CBOelM1Q.js";import"./Helmet-AdRZ9yrT.js";import"./ErrorBoundary-BM8aEPeZ.js";import"./ErrorPanel-NRnP58h1.js";import"./WarningPanel-C7DL1AdG.js";import"./ExpandMore-Df24YjII.js";import"./AccordionDetails-K4eNqGeL.js";import"./Collapse-DklbiL-j.js";import"./MarkdownContent-yMYvzVpl.js";import"./CodeSnippet-D4GvPAYc.js";import"./CopyTextButton-DdSDl_l7.js";import"./LinkButton-CVg2ID4w.js";import"./Link-7jnzHmir.js";import"./useElementFilter-CX7yGh-5.js";import"./InfoCard-BW4VKxa5.js";import"./CardContent-Dv0KIfNv.js";import"./CardHeader-D25g89XU.js";import"./CardActions-BRmKXnBD.js";import"./BottomLink-Bps-KGLO.js";import"./ArrowForward-epoaBmEz.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
