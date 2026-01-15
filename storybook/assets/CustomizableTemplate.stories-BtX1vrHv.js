import{j as t,T as i,c as m,C as a}from"./iframe-CDMGjht1.js";import{w as n}from"./appWrappers-CeVFb9Sb.js";import{s as p,H as s}from"./plugin-SeTjYHS5.js";import{c as d}from"./api-Ck3rMLFV.js";import{c}from"./catalogApiMock-Bs_t7miK.js";import{M as g}from"./MockStarredEntitiesApi-BU81cdpU.js";import{s as l}from"./api-CShczd-4.js";import{C as h}from"./CustomHomepageGrid-BPDEwqcM.js";import{H as f,a as u}from"./plugin-CiOtfWWm.js";import{e as y}from"./routes-2vKu9Amb.js";import{s as w}from"./StarredEntitiesApi-D_3jwwBV.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-BMqS9uye.js";import"./useIsomorphicLayoutEffect-BOxOOV-6.js";import"./useAnalytics-DNi1LI_h.js";import"./useAsync-F2seOW-M.js";import"./useMountedState-BCg_GyJl.js";import"./componentData-BhfXY_7K.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-K4DNRamS.js";import"./useApp-DP3Hy8Yt.js";import"./index-BYk3LR2S.js";import"./Plugin-CfrHLNSO.js";import"./useRouteRef-BKp3R5P0.js";import"./ref-C0VTUPuL.js";import"./lodash-DLuUt6m8.js";import"./Add-B5vGUU3n.js";import"./Grid-BgC6P4wx.js";import"./Box-Dh0DgXaN.js";import"./styled-BhiXTegV.js";import"./TextField-D427viBv.js";import"./Select-BCla9daD.js";import"./index-B9sM2jn7.js";import"./Popover-DdPwRKDV.js";import"./Modal-DiZS-g1t.js";import"./Portal-Dv12doci.js";import"./List-BZ3qqjn-.js";import"./ListContext-ak2gE-qF.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BRa3ION0.js";import"./FormLabel-BT7ooOKX.js";import"./InputLabel-83Pog1NA.js";import"./ListItem-CGpakNnt.js";import"./ListItemIcon-DccZo1Co.js";import"./ListItemText-DadlRFVX.js";import"./Remove-tyq_A_iH.js";import"./useCopyToClipboard-Dpkpx4yl.js";import"./Button-CJM2mVMw.js";import"./Divider-BQTEKmhn.js";import"./FormControlLabel-9XhxK0Cg.js";import"./Checkbox-B7u2X2cu.js";import"./SwitchBase-DoZWNQU_.js";import"./RadioGroup-Cs_lOyYP.js";import"./MenuItem-Dp_K5hqc.js";import"./translation-Lv_KD6D0.js";import"./DialogTitle-BcD20zOV.js";import"./Backdrop-CYAcd77J.js";import"./Tooltip-CrUID85L.js";import"./Popper-CnWXkGYE.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-e3kBGd93.js";import"./Edit-Kpyu1pGW.js";import"./Cancel-BauSuEUA.js";import"./Progress-BhTUHcYp.js";import"./LinearProgress-CDuMq2Wy.js";import"./ContentHeader-DKQ5RRY_.js";import"./Helmet-CgN7KOz-.js";import"./ErrorBoundary-DXFxbn_q.js";import"./ErrorPanel-CHa0fGo8.js";import"./WarningPanel-DI2PepE0.js";import"./ExpandMore-BW8Ytfi4.js";import"./AccordionDetails-xoWWWHy1.js";import"./Collapse-T-NVxaZE.js";import"./MarkdownContent-Cqhsm4_s.js";import"./CodeSnippet-CLIpVCVn.js";import"./CopyTextButton-BUSczag8.js";import"./LinkButton-Bm0UAYAk.js";import"./Link-D_ooISTq.js";import"./useElementFilter-BxLt-OO3.js";import"./InfoCard-BUwu9wAu.js";import"./CardContent-C3OBeIV7.js";import"./CardHeader-CXqhzRgw.js";import"./CardActions-5HkeXWm_.js";import"./BottomLink-B7jTzdbr.js";import"./ArrowForward-BtyH-PNr.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
