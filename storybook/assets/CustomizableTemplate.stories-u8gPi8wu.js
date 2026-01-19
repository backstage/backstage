import{j as t,T as i,c as m,C as a}from"./iframe-BooBp-Po.js";import{w as n}from"./appWrappers-CTUrCtOx.js";import{s as p,H as s}from"./plugin-BF6HMdmX.js";import{c as d}from"./api-BCU6vb-_.js";import{c}from"./catalogApiMock-DcfB-I0H.js";import{M as g}from"./MockStarredEntitiesApi-DoO8XfTT.js";import{s as l}from"./api-Dw2e48Gs.js";import{C as h}from"./CustomHomepageGrid-BGBpxOzt.js";import{H as f,a as u}from"./plugin-CCaDKLYY.js";import{e as y}from"./routes-Cva62O9U.js";import{s as w}from"./StarredEntitiesApi-g7zVy5_Z.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-NJCYJyLg.js";import"./useIsomorphicLayoutEffect-BOg_mT4I.js";import"./useAnalytics-B6NIIYQR.js";import"./useAsync-BkydaeDo.js";import"./useMountedState-BZIVYzWq.js";import"./componentData-UC---0ba.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-uVUaDJuf.js";import"./useApp-BELQ6JvB.js";import"./index-yX-uEimB.js";import"./Plugin-B6z4Q4HB.js";import"./useRouteRef-C16BXt-W.js";import"./ref-C0VTUPuL.js";import"./lodash-DLuUt6m8.js";import"./Add-B3KbvyOH.js";import"./Grid-DyVJyHQ5.js";import"./Box-obs2E8MU.js";import"./styled-DJvGKcz3.js";import"./TextField-BV6xhwxI.js";import"./Select-DhfCFh64.js";import"./index-B9sM2jn7.js";import"./Popover-CRZn-eII.js";import"./Modal-cDnVm_jG.js";import"./Portal-TbQYoDFY.js";import"./List-Cb7k0m_f.js";import"./ListContext-5jNT-Bcm.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C2yL_7QZ.js";import"./FormLabel-D8h2TUSm.js";import"./InputLabel-BQxf5fw8.js";import"./ListItem-CUDBczQT.js";import"./ListItemIcon-DSUOg4pW.js";import"./ListItemText-Bjf3smxb.js";import"./Remove-D1P9kZ0h.js";import"./useCopyToClipboard-B64G66d9.js";import"./Button-Cv3OLp_n.js";import"./Divider-k2YJ45XN.js";import"./FormControlLabel-CnAwLpUe.js";import"./Checkbox-ChL8T88p.js";import"./SwitchBase-ChxTQuc4.js";import"./RadioGroup-CjpxgRpf.js";import"./MenuItem-CE19aExV.js";import"./translation-DnArgxTv.js";import"./DialogTitle-CrfKXT0M.js";import"./Backdrop-B9Tcq6ce.js";import"./Tooltip-C6PmnGP2.js";import"./Popper-m5liQdCd.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-BqFJZYql.js";import"./Edit-BTF8Nk01.js";import"./Cancel-CBkFAUIx.js";import"./Progress-ZYZqfLBt.js";import"./LinearProgress-B9g18yY7.js";import"./ContentHeader-BLsj_OlI.js";import"./Helmet-kFcV6r9V.js";import"./ErrorBoundary-D5Pk8kNF.js";import"./ErrorPanel-J8VMJBUn.js";import"./WarningPanel-Df9ZONi2.js";import"./ExpandMore-Bspz5IQW.js";import"./AccordionDetails-DxggSv3D.js";import"./Collapse-CmSq19t6.js";import"./MarkdownContent-BDjlG_JM.js";import"./CodeSnippet-L6pub6pc.js";import"./CopyTextButton-CtUqznh5.js";import"./LinkButton-DpHtnVgU.js";import"./Link-6ZJtYR0w.js";import"./useElementFilter-CLfhEfrq.js";import"./InfoCard-DIPvFOR7.js";import"./CardContent-C0i9nHGG.js";import"./CardHeader-DbBll6nT.js";import"./CardActions-CisRazDZ.js";import"./BottomLink-fNgaEPxJ.js";import"./ArrowForward-B0hk3RK2.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
