import{j as t,T as i,c as m,C as a}from"./iframe-BOihsBca.js";import{w as n}from"./appWrappers-DK15oPID.js";import{s as p,H as s}from"./plugin-DVI0L5DQ.js";import{c as d}from"./api-CAW-lG_c.js";import{c}from"./catalogApiMock-CZ505LPm.js";import{M as g}from"./MockStarredEntitiesApi-DHTcj97S.js";import{s as l}from"./api-B8E2_pqy.js";import{C as h}from"./CustomHomepageGrid-BAUCAsb7.js";import{H as f,a as u}from"./plugin-BOMnHvz4.js";import{e as y}from"./routes-Ccf-Xkvl.js";import{s as w}from"./StarredEntitiesApi-ZGBVMM_G.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-C0lzDriu.js";import"./useIsomorphicLayoutEffect-DIFcbIH0.js";import"./useAnalytics-DhOW7dTn.js";import"./useAsync-DYwiSXoB.js";import"./useMountedState-BkgXJbA1.js";import"./componentData-TxEje_0q.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-D4IyxNBc.js";import"./useApp-BZBzLwEw.js";import"./index-Cu1cAzrK.js";import"./Plugin-BAjUdbN7.js";import"./useRouteRef-C2F4nlr5.js";import"./ref-C0VTUPuL.js";import"./lodash-DLuUt6m8.js";import"./Add-sKZEEEH8.js";import"./Grid-1tirjwRV.js";import"./Box-CI5GVXvc.js";import"./styled-DdU_wQet.js";import"./TextField-_x_WHclT.js";import"./Select-BGx56pdw.js";import"./index-B9sM2jn7.js";import"./Popover-CPfwLRxB.js";import"./Modal-jgY3Cn8t.js";import"./Portal-B8qEj_11.js";import"./List-CJIQS_VF.js";import"./ListContext-CI2CUWLZ.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-UT0bHK26.js";import"./FormLabel-CtoEs5yM.js";import"./InputLabel-DiVENNqm.js";import"./ListItem-CxNFHnwj.js";import"./ListItemIcon-4JRPC9BS.js";import"./ListItemText-7EMyhNXk.js";import"./Remove-Cjj3WK99.js";import"./useCopyToClipboard-VRQ5LG6h.js";import"./Button-GN2E3NYf.js";import"./Divider-YwFpIHuT.js";import"./FormControlLabel-BVjY6Ya2.js";import"./Checkbox-DCpZ8Q5P.js";import"./SwitchBase-BtaSuWPr.js";import"./RadioGroup-CYZL7OIZ.js";import"./MenuItem-kMoeRuwU.js";import"./translation-V-fQQy9n.js";import"./DialogTitle-CjKWEdsz.js";import"./Backdrop-Cv_Xkr3N.js";import"./Tooltip-DjL5rC5A.js";import"./Popper-CtKIk3Qw.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-DmrMd_R_.js";import"./Edit-CiQAqrW8.js";import"./Cancel-Bgex0xAn.js";import"./Progress-BI6VaihQ.js";import"./LinearProgress-hovusI2Q.js";import"./ContentHeader-qRU7_bBy.js";import"./Helmet-COgbvbMo.js";import"./ErrorBoundary-CUIgcsCK.js";import"./ErrorPanel-NVtD5Fmz.js";import"./WarningPanel-CphllhCv.js";import"./ExpandMore-CS5zzKrc.js";import"./AccordionDetails-22y-25Aw.js";import"./Collapse-I_wLTjeF.js";import"./MarkdownContent-UpORQ4pi.js";import"./CodeSnippet-KsTffiAQ.js";import"./CopyTextButton-D9S96eUG.js";import"./LinkButton-B1OFknhl.js";import"./Link-Cl4hSzOR.js";import"./useElementFilter-CfQpq50X.js";import"./InfoCard-CjT_VVPA.js";import"./CardContent-B5NTKqYg.js";import"./CardHeader-BfS5-4YN.js";import"./CardActions-Bs5c7L4W.js";import"./BottomLink-CXH5t2pM.js";import"./ArrowForward-DCIpWazW.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
