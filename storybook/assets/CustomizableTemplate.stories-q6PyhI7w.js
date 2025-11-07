import{j as t,T as i,c as m,C as a}from"./iframe-BpYUhtQT.js";import{w as n}from"./appWrappers-peGXwDQa.js";import{s as p,H as s}from"./plugin-BBIbsTCY.js";import{c as d}from"./api-AYinOtzd.js";import{c}from"./catalogApiMock-OVkx0OA7.js";import{M as g}from"./MockStarredEntitiesApi-DG7qrkME.js";import{s as l}from"./api-CGdsmrDM.js";import{C as h}from"./CustomHomepageGrid-Ddn9WI4G.js";import{H as f,a as u}from"./plugin-CvKOWj6E.js";import{e as y}from"./routes-CFxPnSi1.js";import{s as w}from"./StarredEntitiesApi-PKBQ39Ld.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-3jB7UW4m.js";import"./useIsomorphicLayoutEffect-1EIRTIdR.js";import"./useAnalytics-Bh2pk9PK.js";import"./useAsync-BpYeyvGz.js";import"./useMountedState-DBGgrpWA.js";import"./componentData-BaoDxexO.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-Ce36-Nje.js";import"./useApp-DvIsmpbF.js";import"./index-Oo4mrAWG.js";import"./Plugin-DowXY3sc.js";import"./useRouteRef-l3dtiGOV.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-Dps4c5dR.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-BtBTwwOx.js";import"./Grid-BSBIJVeD.js";import"./Box-DFzIAW_k.js";import"./styled-CvmEiBn0.js";import"./TextField-CISKLtrm.js";import"./Select-Bll_j_Zk.js";import"./index-DnL3XN75.js";import"./Popover-BGVNopjx.js";import"./Modal-0XcuTVfd.js";import"./Portal-OHyZAVgE.js";import"./List-CSZ53dK9.js";import"./ListContext-MOdDfATV.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-AOp6HVrP.js";import"./FormLabel-CpvPMx-l.js";import"./InputLabel-BMr4kJZH.js";import"./ListItem-DoWEcNrm.js";import"./ListItemIcon-LOr9dyWJ.js";import"./ListItemText-CJKnCLsZ.js";import"./Remove-Cq4pJk6L.js";import"./useCopyToClipboard-shAo73Yc.js";import"./Button-BY1Og1vF.js";import"./Divider-C5hfIyuI.js";import"./FormControlLabel-BdO7RH2Q.js";import"./Checkbox-DFFHda2d.js";import"./SwitchBase-DHDHzWjp.js";import"./RadioGroup-C2qrIEEs.js";import"./MenuItem-DGez6lGh.js";import"./translation-CnlEaKTw.js";import"./DialogTitle-CB5Y5dHf.js";import"./Backdrop-RvGqs8Vm.js";import"./Tooltip-CKt0VlQr.js";import"./Popper-mZ76pVB3.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-JyZaaxk6.js";import"./Edit-B3YwZDlT.js";import"./Cancel-DjmszhfM.js";import"./Progress-BCP_Cj2v.js";import"./LinearProgress-BdfIs5bH.js";import"./ContentHeader-BIEmGWoC.js";import"./Helmet-jkWHKPLj.js";import"./ErrorBoundary-DzqamQ5F.js";import"./ErrorPanel-DX0kqAsP.js";import"./WarningPanel-8zkHCnj8.js";import"./ExpandMore-CeSJ010X.js";import"./AccordionDetails-fjjprATf.js";import"./Collapse-CmnpFYn4.js";import"./MarkdownContent-BWS4BjxZ.js";import"./CodeSnippet-C2KdpqrO.js";import"./CopyTextButton-DC1eYg7O.js";import"./LinkButton-PBhijShz.js";import"./Link-CMqafiV1.js";import"./useElementFilter-DvqkU95I.js";import"./InfoCard-BU1H8Nsz.js";import"./CardContent-BIK6qFXi.js";import"./CardHeader-arrMMvmZ.js";import"./CardActions-CtZbu5K_.js";import"./BottomLink-DlULM6Ak.js";import"./ArrowForward-BIypQajv.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
