import{j as t,T as i,c as m,C as a}from"./iframe-CMoZkI_V.js";import{w as n}from"./appWrappers-CwLdvgVt.js";import{s as p,H as s}from"./plugin-CrYADn4T.js";import{c as d}from"./api-BErYSGYP.js";import{c}from"./catalogApiMock-Dg21zjsY.js";import{M as g}from"./MockStarredEntitiesApi-CApd12C0.js";import{s as l}from"./api-BfofgL2m.js";import{C as h}from"./CustomHomepageGrid-Cp2cNwXW.js";import{H as f,a as u}from"./plugin-Bm43qfKP.js";import{e as y}from"./routes-DSa0lLCp.js";import{s as w}from"./StarredEntitiesApi-CQ4NzV4m.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-f8TZQGuk.js";import"./useIsomorphicLayoutEffect-DTydLypZ.js";import"./useAnalytics-aVKC-y-x.js";import"./useAsync-nuZztPgy.js";import"./useMountedState-DXAXWcHb.js";import"./componentData-C1GpKGWH.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Dl6v8jff.js";import"./useApp-Cq0FwDqI.js";import"./index-DEPSeTYd.js";import"./Plugin-Cw-agZnT.js";import"./useRouteRef-BKopQGJE.js";import"./ref-C0VTUPuL.js";import"./lodash-DLuUt6m8.js";import"./Add-Dkgp7HBs.js";import"./Grid-Cc5u-Kft.js";import"./Box-DDWlRNcc.js";import"./styled-BPnpuM9w.js";import"./TextField-CzAvqVqZ.js";import"./Select-Du7ISKFa.js";import"./index-B9sM2jn7.js";import"./Popover-uKAOvxlN.js";import"./Modal-JpNI_f-q.js";import"./Portal-BsEe4NVr.js";import"./List-mLBkoS87.js";import"./ListContext-DCW7FG4X.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CYLNnuhF.js";import"./FormLabel-puaj9Kks.js";import"./InputLabel-h0iWwr6w.js";import"./ListItem-DQ5raIpn.js";import"./ListItemIcon-BOmBm_9e.js";import"./ListItemText-CMPMNvTt.js";import"./Remove-CJwgyqdG.js";import"./useCopyToClipboard-LW0UmRxQ.js";import"./Button-CMlJ_q4q.js";import"./Divider-DAPmlDv6.js";import"./FormControlLabel-DBAHQjKY.js";import"./Checkbox-BOa8MHJS.js";import"./SwitchBase-CEsz--IP.js";import"./RadioGroup-CZz_Tyi1.js";import"./MenuItem-D3VGx5Fo.js";import"./translation-CcmMaJlL.js";import"./DialogTitle-D9NQ_O8G.js";import"./Backdrop-t6uNU6s-.js";import"./Tooltip-DqsRLJKa.js";import"./Popper-p2DZK6W8.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-BtRArxrM.js";import"./Edit-BfQwhq4E.js";import"./Cancel-C4W-BwLh.js";import"./Progress-DioH0JJa.js";import"./LinearProgress-DQ7NJi3Y.js";import"./ContentHeader-4ETlCKGG.js";import"./Helmet-F1ZVjyJn.js";import"./ErrorBoundary-p7Vx4hun.js";import"./ErrorPanel-4fnCiNRY.js";import"./WarningPanel-CrW_vej9.js";import"./ExpandMore-RbVyUBOe.js";import"./AccordionDetails-BpZtQ7qf.js";import"./Collapse-CttgXTbY.js";import"./MarkdownContent-BAnHPybQ.js";import"./CodeSnippet-CC5elSQb.js";import"./CopyTextButton-D_szYgc0.js";import"./LinkButton-Br-4b2Az.js";import"./Link-_YMea8vG.js";import"./useElementFilter-CaevaYu7.js";import"./InfoCard-B7VpOy60.js";import"./CardContent-DxGlUsBp.js";import"./CardHeader-CDcSzNkn.js";import"./CardActions-DJqB9_Ii.js";import"./BottomLink-Cy-SqU1H.js";import"./ArrowForward-CYQeWInn.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
