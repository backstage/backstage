import{j as t,T as i,c as m,C as a}from"./iframe-QBX5Mcuo.js";import{w as n}from"./appWrappers-357IU-cP.js";import{s as p,H as s}from"./plugin-bJWcIHXu.js";import{c as d}from"./api-B5MZnkeh.js";import{c}from"./catalogApiMock-DvDFDFxj.js";import{M as g}from"./MockStarredEntitiesApi-CKUkCn_q.js";import{s as l}from"./api-DRjUYJBX.js";import{C as h}from"./CustomHomepageGrid-DjWE72UW.js";import{H as f,a as u}from"./plugin-DLAShKum.js";import{e as y}from"./routes-BFuSrePD.js";import{s as w}from"./StarredEntitiesApi-DyJW51GS.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-BTlRHWB4.js";import"./useIsomorphicLayoutEffect-BYNl4sdH.js";import"./useAnalytics-Pg_QG9Iq.js";import"./useAsync-DruiAlTJ.js";import"./useMountedState-ByMBzLYV.js";import"./componentData-DHgvWv9V.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-CDF8GVFg.js";import"./useApp-B1pSEwwD.js";import"./index-BWOdk6pr.js";import"./Plugin-BpVAfwk3.js";import"./useRouteRef-Bc19hZiH.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-CSQ-BCiB.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-BHJdFUGI.js";import"./Grid-Q_BfCJNG.js";import"./Box-DE6c26DR.js";import"./styled-BjXftXcZ.js";import"./TextField-M2_UqjpF.js";import"./Select-Bgn_iEo1.js";import"./index-DnL3XN75.js";import"./Popover-B8q1n2QL.js";import"./Modal-B7uRaYS1.js";import"./Portal-D97HJh_z.js";import"./List-CwkTxoFK.js";import"./ListContext-BfMtnPb8.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C8j1xMaB.js";import"./FormLabel-CnwY8pkP.js";import"./InputLabel-uMDJwPrA.js";import"./ListItem-CcSyfWmu.js";import"./ListItemIcon-C59ouvwB.js";import"./ListItemText-BayZFfOR.js";import"./Remove-BsOlE_SD.js";import"./useCopyToClipboard-B79QevPK.js";import"./Button-CVwDhsqF.js";import"./Divider-DLQMODSR.js";import"./FormControlLabel-R8cQBIxa.js";import"./Checkbox-hb8VnpDR.js";import"./SwitchBase-erfIXrjN.js";import"./RadioGroup-SK-p2M6O.js";import"./MenuItem-rzPQj8Ni.js";import"./translation-CiYtxF84.js";import"./DialogTitle-BSYcyeQj.js";import"./Backdrop-DUF8g36-.js";import"./Tooltip-DOW7o-0E.js";import"./Popper-BpKCcSKx.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-DdHN3J17.js";import"./Edit-DRkFg0mu.js";import"./Cancel-CL-2mhQE.js";import"./Progress-Cvrx13rE.js";import"./LinearProgress-w2JYBnWb.js";import"./ContentHeader-kKwNo1eg.js";import"./Helmet-C7Wh8K2R.js";import"./ErrorBoundary-DDmUM-RT.js";import"./ErrorPanel-Bnda3tGm.js";import"./WarningPanel-Ct6Y8Ijr.js";import"./ExpandMore-j96Z6uWc.js";import"./AccordionDetails-D8gh-z9a.js";import"./Collapse-vSwdBrKa.js";import"./MarkdownContent-CGXvyksG.js";import"./CodeSnippet-Kn9vBnai.js";import"./CopyTextButton-CQwOrqNE.js";import"./LinkButton-CSuChLvM.js";import"./Link-C2fIupIe.js";import"./useElementFilter-CVthae2L.js";import"./InfoCard-DyGnoqeb.js";import"./CardContent-BGq9ULfl.js";import"./CardHeader-kma2G_Yg.js";import"./CardActions-BO1Jtm9a.js";import"./BottomLink-BnuP6Yck.js";import"./ArrowForward-C05mkkQp.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
