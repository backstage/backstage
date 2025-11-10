import{j as t,T as i,c as m,C as a}from"./iframe-cIBAsfTm.js";import{w as n}from"./appWrappers-C9lQTpTI.js";import{s as p,H as s}from"./plugin-JnCPotEe.js";import{c as d}from"./api-1bsaAGlB.js";import{c}from"./catalogApiMock-DCbMYPgY.js";import{M as g}from"./MockStarredEntitiesApi-Civ2zrbc.js";import{s as l}from"./api-FGhT9qVs.js";import{C as h}from"./CustomHomepageGrid-DCTAkxQl.js";import{H as f,a as u}from"./plugin-Cb3_xcRa.js";import{e as y}from"./routes-Cl-e1kIm.js";import{s as w}from"./StarredEntitiesApi-BkEdwCdX.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-5q0VJedC.js";import"./useIsomorphicLayoutEffect-nJ3cOO7G.js";import"./useAnalytics-Cn11G-Da.js";import"./useAsync-DPpw4t_L.js";import"./useMountedState-DDQ1veKw.js";import"./componentData-DBqEb6G1.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-BkxQC8j2.js";import"./useApp-BnMckP-G.js";import"./index-CX3Nd5GQ.js";import"./Plugin-CWbQlcVn.js";import"./useRouteRef-tsZqa-xk.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-BMcONaVM.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-C_WVYJ8U.js";import"./Grid-Dgo5ACik.js";import"./Box-5_AhqNAq.js";import"./styled-6iTZXECK.js";import"./TextField-D0FZ420g.js";import"./Select-BfkLSqHW.js";import"./index-DnL3XN75.js";import"./Popover-BkYTo63x.js";import"./Modal-BGf4XJgV.js";import"./Portal-C3RNSs6Y.js";import"./List-BJcgiIVB.js";import"./ListContext-CvDEkeuW.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DpGllqyr.js";import"./FormLabel-DmnX46Bz.js";import"./InputLabel-C0VpW_02.js";import"./ListItem-DDKzfBu6.js";import"./ListItemIcon-MZjq3RFx.js";import"./ListItemText-CP0ZRpAu.js";import"./Remove-Lle5toWb.js";import"./useCopyToClipboard-B_-Fejqp.js";import"./Button-D8Pwv3bO.js";import"./Divider-Cpot2Ubt.js";import"./FormControlLabel-DiwDlRvq.js";import"./Checkbox-DFnPJHFV.js";import"./SwitchBase-DuMfNZYh.js";import"./RadioGroup-EeALZsK5.js";import"./MenuItem-C7RX92pZ.js";import"./translation-Ca8F6rmg.js";import"./DialogTitle-DpcONI-S.js";import"./Backdrop-BVSi2zmG.js";import"./Tooltip-BlfO5nii.js";import"./Popper-BYAfl6Ks.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-C_6P6P-y.js";import"./Edit-Dr0zk1hH.js";import"./Cancel-BhPwlZeP.js";import"./Progress-CjkEnN9C.js";import"./LinearProgress-BCefwoaA.js";import"./ContentHeader-C-i5ZEk-.js";import"./Helmet-C18ZB1WV.js";import"./ErrorBoundary-CqfBeslE.js";import"./ErrorPanel-BVO-icJS.js";import"./WarningPanel-DCLMi1dI.js";import"./ExpandMore-Fefrqwki.js";import"./AccordionDetails-DeQbQa7K.js";import"./Collapse-BkfRpfT3.js";import"./MarkdownContent-CaLyrJfC.js";import"./CodeSnippet-kFMDpIw3.js";import"./CopyTextButton-Dc9zjtfe.js";import"./LinkButton-Di3tjDC2.js";import"./Link-BTtSeEzC.js";import"./useElementFilter-B-xdHB-z.js";import"./InfoCard-BL8MQepQ.js";import"./CardContent-BgcXPZYc.js";import"./CardHeader-DpWbaMe6.js";import"./CardActions-C3tcN7S7.js";import"./BottomLink-U2EHDAiC.js";import"./ArrowForward-Hao0JHUH.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
