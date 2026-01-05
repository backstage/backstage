import{j as t,T as i,c as m,C as a}from"./iframe-BuVoE93N.js";import{w as n}from"./appWrappers-Dzyg-wjZ.js";import{s as p,H as s}from"./plugin-Cr3YeEvO.js";import{c as d}from"./api-Bs073Bhx.js";import{c}from"./catalogApiMock-CWZpLnV0.js";import{M as g}from"./MockStarredEntitiesApi-DY6dF5yD.js";import{s as l}from"./api-DsOWsteJ.js";import{C as h}from"./CustomHomepageGrid-Dqyq-Qmy.js";import{H as f,a as u}from"./plugin-DCfphdNv.js";import{e as y}from"./routes-0QPjtr2_.js";import{s as w}from"./StarredEntitiesApi-bIZVC_O8.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-C2sfq9NY.js";import"./useIsomorphicLayoutEffect-JJ8yQdtm.js";import"./useAnalytics-CGq4Uj37.js";import"./useAsync-Wgi4dREP.js";import"./useMountedState-CTJrFvSG.js";import"./componentData-C8D74Psm.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CLOs8FQP.js";import"./useApp-CzP5PYac.js";import"./index-DPjuYX3H.js";import"./Plugin-TD5MgFlM.js";import"./useRouteRef-D1da1nJw.js";import"./ref-C0VTUPuL.js";import"./lodash-Y_-RFQgK.js";import"./Add-BtGpCzCp.js";import"./Grid-BS_RmjCI.js";import"./Box-EG9f0Y8u.js";import"./styled-GwDWktgy.js";import"./TextField-CbjShM1F.js";import"./Select-RzLO2HvX.js";import"./index-B9sM2jn7.js";import"./Popover-BXpMyGs6.js";import"./Modal-DyZkcIsp.js";import"./Portal-C8Go-sfs.js";import"./List-p0FQAnkV.js";import"./ListContext-ChBBEYBX.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BJIgSq-Y.js";import"./FormLabel-DhWhQW_c.js";import"./InputLabel-DaEQzIA4.js";import"./ListItem-DWhn9oWM.js";import"./ListItemIcon-D6OIKSgI.js";import"./ListItemText-BhWjqHFt.js";import"./Remove-DlBV8605.js";import"./useCopyToClipboard-B1o0Tb_t.js";import"./Button-DitSkek8.js";import"./Divider-Ccs-DDu6.js";import"./FormControlLabel-B-d_Amco.js";import"./Checkbox-Bek1DRBf.js";import"./SwitchBase-CNM0OcZT.js";import"./RadioGroup-CTLpWyeR.js";import"./MenuItem-BO8r2Ugw.js";import"./translation-Bml-wnV7.js";import"./DialogTitle-BbPlvqCJ.js";import"./Backdrop-BgdB2kxh.js";import"./Tooltip-DeALkc8i.js";import"./Popper-CiIf8Skg.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar--5TKBDrP.js";import"./Edit-CcNbLGVu.js";import"./Cancel-BdL4iMSR.js";import"./Progress-CUeAKEGx.js";import"./LinearProgress-BrFBm3VB.js";import"./ContentHeader-NMGSrXZo.js";import"./Helmet-CwcBeG8Q.js";import"./ErrorBoundary-dEIU-zi8.js";import"./ErrorPanel-Ds2_o_Gr.js";import"./WarningPanel-Bli1S96p.js";import"./ExpandMore-DhETGfMT.js";import"./AccordionDetails-hMDXQ06y.js";import"./Collapse-1RctBr9q.js";import"./MarkdownContent-Bml6DDvX.js";import"./CodeSnippet-Djqp3Beh.js";import"./CopyTextButton-DpoFWtPj.js";import"./LinkButton-Dl9Eyitm.js";import"./Link-2efb-DF8.js";import"./useElementFilter-B07OWHL7.js";import"./InfoCard-CO5lDwDN.js";import"./CardContent-Cwgf28Tz.js";import"./CardHeader-BtQ1V3nY.js";import"./CardActions-DpYNDgHW.js";import"./BottomLink-B49jvA2-.js";import"./ArrowForward-DmYv927b.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
