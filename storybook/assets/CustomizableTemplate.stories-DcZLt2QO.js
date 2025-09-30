import{j as t,T as i,c as m,C as a}from"./iframe-Bqhsa6Sh.js";import{w as n}from"./appWrappers-DpSGCgYr.js";import{s as p,H as s}from"./plugin-ByQXhup_.js";import{c as d}from"./api-SiahGf3H.js";import{c}from"./catalogApiMock-_sVZHe7_.js";import{M as g}from"./MockStarredEntitiesApi-bfT3GO7_.js";import{s as l}from"./api-D4PYsrzF.js";import{C as h}from"./CustomHomepageGrid-D-TQeHcs.js";import{H as f,a as u}from"./plugin-BBZXZmo4.js";import{e as y}from"./routes-D30BmTjH.js";import{s as w}from"./StarredEntitiesApi-DlnonxWH.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-CtpiA3_D.js";import"./useIsomorphicLayoutEffect-BBofhakA.js";import"./useAnalytics-V0sqNxHK.js";import"./useAsync-CZ1-XOrU.js";import"./useMountedState-By8QTQnS.js";import"./componentData-BjQGtouP.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-C3od-xDV.js";import"./useApp-DjjYoyBR.js";import"./index-BnR6moq1.js";import"./Plugin-ChbcFySR.js";import"./useRouteRef-D2qGziGj.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-jLLYJ9ir.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-CqXJ_RLA.js";import"./Grid-B6o2V4N5.js";import"./Box-7oeyrs_b.js";import"./styled-PHRrol5o.js";import"./TextField-ckbFLGKy.js";import"./Select-DTWqy7D7.js";import"./index-DnL3XN75.js";import"./Popover-CV1Qmkiv.js";import"./Modal-Bj_JGdVD.js";import"./Portal-C0qyniir.js";import"./List-DhlESJBF.js";import"./ListContext-42q0jwAr.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-kpRDOPzl.js";import"./FormLabel-BImBqquF.js";import"./InputLabel-BgWhd402.js";import"./ListItem-BUcGiLuR.js";import"./ListItemIcon-BhW7GlzU.js";import"./ListItemText-CHn-6MvY.js";import"./Remove-C6NWHkUQ.js";import"./useCopyToClipboard-Cacc49O7.js";import"./Button-BIWqIjhL.js";import"./Divider-dXncAHZ6.js";import"./FormControlLabel-B0vlsYDr.js";import"./Checkbox-bSiraUkG.js";import"./SwitchBase-BtaiWWHu.js";import"./RadioGroup-DyTxB_BG.js";import"./MenuItem-Cleq8U4u.js";import"./translation-BBVha38b.js";import"./DialogTitle-CWvQ0e48.js";import"./Backdrop-jgSEnQhj.js";import"./Tooltip-BcEgbTA-.js";import"./Popper-CVY8x9L-.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-CXHcQ9I1.js";import"./Edit-BYzndzas.js";import"./Cancel-KZJniPHp.js";import"./Progress-7e6Cpbjg.js";import"./LinearProgress-DIlkpeqy.js";import"./ContentHeader-WklUfR3k.js";import"./Helmet-CedEavMf.js";import"./ErrorBoundary-qLv6qWws.js";import"./ErrorPanel-DjMQdfdJ.js";import"./WarningPanel-ChwZGoqa.js";import"./ExpandMore-DtBTikql.js";import"./AccordionDetails-TLAxJNrY.js";import"./Collapse-BmcxTB9C.js";import"./MarkdownContent-NPwWt_6a.js";import"./CodeSnippet-668TY6_y.js";import"./CopyTextButton-BbR5f8cw.js";import"./LinkButton-xQ2OFSZK.js";import"./Link-BYO-u9Rv.js";import"./useElementFilter-CLYkkZuN.js";import"./InfoCard-DqQrAMvM.js";import"./CardContent-eJLTlWrs.js";import"./CardHeader-YTE5ohdi.js";import"./CardActions-CaoKmzIe.js";import"./BottomLink-Cq7vEnTL.js";import"./ArrowForward-o-fAnTPb.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
