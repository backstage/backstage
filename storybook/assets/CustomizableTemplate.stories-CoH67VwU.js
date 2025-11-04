import{j as t,T as i,c as m,C as a}from"./iframe-CuO26Rmv.js";import{w as n}from"./appWrappers-CqMB6nNx.js";import{s as p,H as s}from"./plugin-STdCG4P5.js";import{c as d}from"./api-CDhPeDux.js";import{c}from"./catalogApiMock-BnCEn_Vb.js";import{M as g}from"./MockStarredEntitiesApi-D9RDfR_j.js";import{s as l}from"./api-CB8z8LCt.js";import{C as h}from"./CustomHomepageGrid-DpKnzGsD.js";import{H as f,a as u}from"./plugin-Bq6hyHXs.js";import{e as y}from"./routes-BWtPA_UE.js";import{s as w}from"./StarredEntitiesApi-CMxGVoXH.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-CW3YJiyR.js";import"./useIsomorphicLayoutEffect-B9jQ_lJC.js";import"./useAnalytics-CdEHywY9.js";import"./useAsync-CNdJisKf.js";import"./useMountedState-Cwi1zouP.js";import"./componentData-jPnjY360.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-CA92LH--.js";import"./useApp-BYLVa0iu.js";import"./index-CstkzreT.js";import"./Plugin-BYJQvkSS.js";import"./useRouteRef-DasU4rh5.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-BHjaFDXU.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-ChP5nffx.js";import"./Grid-BfYuvVEF.js";import"./Box-CU-U4ibu.js";import"./styled-C8K_EIFt.js";import"./TextField-BEz1rSAB.js";import"./Select-B1wLy_1E.js";import"./index-DnL3XN75.js";import"./Popover-qvG1tW29.js";import"./Modal-6Ajkd_zG.js";import"./Portal-BcfglCa0.js";import"./List-BAIPzTEx.js";import"./ListContext-0ULPV768.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-4cz9UsBa.js";import"./FormLabel-BPUD3WYf.js";import"./InputLabel-C2uVXjpH.js";import"./ListItem-D5_amKXt.js";import"./ListItemIcon-AqQKWWgx.js";import"./ListItemText-CSVSzb3y.js";import"./Remove-C1AMRH4L.js";import"./useCopyToClipboard-BtizGtOb.js";import"./Button-DlZ0BBap.js";import"./Divider-vqslFKyv.js";import"./FormControlLabel-W7ofhxCd.js";import"./Checkbox-4kToOhkw.js";import"./SwitchBase-BwvdzWWy.js";import"./RadioGroup-DySockLZ.js";import"./MenuItem-BoCgrpVQ.js";import"./translation-CsTKhPuX.js";import"./DialogTitle-HF8aA2AY.js";import"./Backdrop-BlG2t9Br.js";import"./Tooltip-DqE-hoU6.js";import"./Popper-DfJjIkwB.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-CvvaeNE-.js";import"./Edit-CPR92gqd.js";import"./Cancel-D4imcTJf.js";import"./Progress-CFwsUMPR.js";import"./LinearProgress-CNTdMoKg.js";import"./ContentHeader-DnEqsab_.js";import"./Helmet-DHs2JXTs.js";import"./ErrorBoundary-CFcBk-1U.js";import"./ErrorPanel-CDwA38MB.js";import"./WarningPanel-DSWSSSeS.js";import"./ExpandMore-BXwwuksY.js";import"./AccordionDetails-C3hb9ppk.js";import"./Collapse-BQbZuamb.js";import"./MarkdownContent-Dnni9t_T.js";import"./CodeSnippet-jcNnShuM.js";import"./CopyTextButton-BNZ4H3Xn.js";import"./LinkButton-5IaBbqVW.js";import"./Link-DPuqs8WZ.js";import"./useElementFilter-DUH5wCei.js";import"./InfoCard-ChGG-MHI.js";import"./CardContent-r0f801Ql.js";import"./CardHeader-v7Sk4_UR.js";import"./CardActions-NkzIkcmB.js";import"./BottomLink-DZSMcwn-.js";import"./ArrowForward-BT_Xitdy.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
