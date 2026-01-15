import{j as t,T as i,c as m,C as a}from"./iframe-C9MahRWh.js";import{w as n}from"./appWrappers-CVRFJ8fS.js";import{s as p,H as s}from"./plugin-wSPBrfkM.js";import{c as d}from"./api-CjTM7GNV.js";import{c}from"./catalogApiMock-BNgw5pKy.js";import{M as g}from"./MockStarredEntitiesApi-CyXzFbR5.js";import{s as l}from"./api-Dv1FYIKi.js";import{C as h}from"./CustomHomepageGrid-BNI1ctDl.js";import{H as f,a as u}from"./plugin-s8_OUas1.js";import{e as y}from"./routes-Cam7p8ZX.js";import{s as w}from"./StarredEntitiesApi-CTCsxK94.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-s32LqZTU.js";import"./useIsomorphicLayoutEffect-DEny9FEg.js";import"./useAnalytics-BziQWZJs.js";import"./useAsync-BWwk_eba.js";import"./useMountedState-Dn_kttD3.js";import"./componentData-BjbrQk5D.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Y3I5MZ_O.js";import"./useApp-jr5Pcjzr.js";import"./index-CjPvPLb3.js";import"./Plugin-COyD8Ape.js";import"./useRouteRef-C79sp_qC.js";import"./ref-C0VTUPuL.js";import"./lodash-DLuUt6m8.js";import"./Add-G20WIfLu.js";import"./Grid-Bq14PCTk.js";import"./Box-CYNkyMDT.js";import"./styled-DiHiiZIS.js";import"./TextField-BKJ8Bm5J.js";import"./Select-CUd0a1W1.js";import"./index-B9sM2jn7.js";import"./Popover-CAIBXgWq.js";import"./Modal-C6HnS9UY.js";import"./Portal-CaSAJtdX.js";import"./List-Bf1QAwLS.js";import"./ListContext-C4u9JBBU.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DNC6bluv.js";import"./FormLabel-a44giEza.js";import"./InputLabel-BrkX1vkj.js";import"./ListItem-CEqAAvo8.js";import"./ListItemIcon-C2o04ExQ.js";import"./ListItemText-ULNmgNfA.js";import"./Remove-DxavTUbc.js";import"./useCopyToClipboard-CMkmug0-.js";import"./Button-Dzp_nJek.js";import"./Divider-BPY2Btf9.js";import"./FormControlLabel-BS7JqOQR.js";import"./Checkbox-BD7KCmoE.js";import"./SwitchBase-g-Oud5Bi.js";import"./RadioGroup-BvblX8pv.js";import"./MenuItem-Dv2xrnoS.js";import"./translation-Bkm6wMi4.js";import"./DialogTitle-XE_ReIcx.js";import"./Backdrop-B07gdzN9.js";import"./Tooltip-BxZhHFnO.js";import"./Popper-BxhcTIEV.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-BjhaET8R.js";import"./Edit-DHWsPJAc.js";import"./Cancel-D9zhALWQ.js";import"./Progress-DlrTiw-B.js";import"./LinearProgress-Yzi8SXqF.js";import"./ContentHeader-4E1kZLtU.js";import"./Helmet-B4pf13t1.js";import"./ErrorBoundary-DViLc_vS.js";import"./ErrorPanel-Cd_NhFA3.js";import"./WarningPanel-NX0KfHXh.js";import"./ExpandMore-C29ppj5F.js";import"./AccordionDetails-DeCV1Glt.js";import"./Collapse-COZrbk8h.js";import"./MarkdownContent-D9IOtBE8.js";import"./CodeSnippet-n_l-Y6Rc.js";import"./CopyTextButton-6HBTp066.js";import"./LinkButton-LGqlLhF5.js";import"./Link-hmIS8MxR.js";import"./useElementFilter-BkKLtY7e.js";import"./InfoCard-C-Ku1r86.js";import"./CardContent-oIyv0kn_.js";import"./CardHeader-DlTILyHC.js";import"./CardActions-DJNyFBXf.js";import"./BottomLink-B7oZiutG.js";import"./ArrowForward-DNeec2hd.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
