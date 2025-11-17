import{j as t,T as i,c as m,C as a}from"./iframe-CIM5duhm.js";import{w as n}from"./appWrappers-C9XZWfKp.js";import{s as p,H as s}from"./plugin-CLcfz4RH.js";import{c as d}from"./api-BmCfVvZO.js";import{c}from"./catalogApiMock-CIRNQYDs.js";import{M as g}from"./MockStarredEntitiesApi-BNLfpqG6.js";import{s as l}from"./api-Bslp_G49.js";import{C as h}from"./CustomHomepageGrid-BtIG2vtf.js";import{H as f,a as u}from"./plugin-D9ar44j_.js";import{e as y}from"./routes-fWmMgHE5.js";import{s as w}from"./StarredEntitiesApi-l5I_mQ35.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-phC6TcCN.js";import"./useIsomorphicLayoutEffect-CFVY4_Ue.js";import"./useAnalytics-BRyHidSV.js";import"./useAsync-BVaj5mJ5.js";import"./useMountedState-BMP6C5TD.js";import"./componentData-CysmgvuR.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-eXSQF74E.js";import"./useApp-DECMHJKF.js";import"./index-DgwYc68S.js";import"./Plugin-BahgJ1_U.js";import"./useRouteRef-BRIN7ftV.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-BTVWq9x2.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-WyT8rCBK.js";import"./Grid-Duc3jmgA.js";import"./Box-BD8Uu_7H.js";import"./styled-Co6KhZ4u.js";import"./TextField-BQnj7Vet.js";import"./Select-Ba1SeKF4.js";import"./index-DnL3XN75.js";import"./Popover-B59RL4fp.js";import"./Modal-CTawIxqI.js";import"./Portal-6z5sMs7a.js";import"./List-CGOBvW-t.js";import"./ListContext-BKDMM4_S.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CqwH1Vk0.js";import"./FormLabel-CuaxJ3_s.js";import"./InputLabel-CFyjP1Jo.js";import"./ListItem-C8QkAD_t.js";import"./ListItemIcon-DLWEhI4p.js";import"./ListItemText-BZPfuyb-.js";import"./Remove-Bwk2-F6r.js";import"./useCopyToClipboard-CcN5gAoC.js";import"./Button-qnzTC3D6.js";import"./Divider-DA-kCS2y.js";import"./FormControlLabel-CyWp6pp8.js";import"./Checkbox-DiGgPqcE.js";import"./SwitchBase-CCvWjkg4.js";import"./RadioGroup-CNj7H43J.js";import"./MenuItem-CDmTRL41.js";import"./translation-CBPUenjq.js";import"./DialogTitle-C7x4V4Yo.js";import"./Backdrop-ktCLmDIR.js";import"./Tooltip-DHuqselR.js";import"./Popper-Bdhv-Ri7.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-Ji0C7gsR.js";import"./Edit-CB7oib4A.js";import"./Cancel-BCY7Jb9E.js";import"./Progress-ClQKxc2a.js";import"./LinearProgress-CI_prkB1.js";import"./ContentHeader-CBYg8fTl.js";import"./Helmet-BqBBnQbG.js";import"./ErrorBoundary-DW2AFmmD.js";import"./ErrorPanel-CfBA3Rnk.js";import"./WarningPanel-4pT00iVw.js";import"./ExpandMore-D2DOioK9.js";import"./AccordionDetails-D4PSfG9Y.js";import"./Collapse-BWkOwJIQ.js";import"./MarkdownContent-C54rNlBp.js";import"./CodeSnippet-C2ptadrL.js";import"./CopyTextButton-DEGdjETq.js";import"./LinkButton-c10FrtBS.js";import"./Link-DCWBCw0R.js";import"./useElementFilter-BYCU1PRW.js";import"./InfoCard-DYfoP3uw.js";import"./CardContent-Y_6Qe422.js";import"./CardHeader-AaChVV2H.js";import"./CardActions-LQToxJMs.js";import"./BottomLink-B0RwdjBb.js";import"./ArrowForward-Di3FBZA_.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
