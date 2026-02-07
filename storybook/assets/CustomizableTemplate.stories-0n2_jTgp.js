import{j as t,U as i,V as m,W as a}from"./iframe-Cih9KYts.js";import{s as n,H as p}from"./plugin-AlTbBZ5j.js";import{c as s}from"./api-BjPxMDDu.js";import{c as d}from"./catalogApiMock-A_oRiiPo.js";import{M as c}from"./MockStarredEntitiesApi-DSVN7IWQ.js";import{s as g}from"./api-C9Cc-uCq.js";import{C as l}from"./CustomHomepageGrid-r9OAlwuH.js";import{H as h,a as f}from"./plugin-3Q6LhQe7.js";import{e as u}from"./routes-Bm_ATbEb.js";import{w as y}from"./appWrappers-C7AQtpTy.js";import{s as w}from"./StarredEntitiesApi-Cjd_KRl3.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CmBl_uuR.js";import"./Plugin-C_qaKzy-.js";import"./componentData-DlgYE3l_.js";import"./useAnalytics-Cmhz127l.js";import"./useApp-sV2xt9cM.js";import"./useRouteRef-DDi4DkR7.js";import"./index-Bp0jFuCJ.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useObservable-BtgVS7-k.js";import"./useIsomorphicLayoutEffect-dPDL8wRM.js";import"./isObject--vsEa_js.js";import"./isSymbol-DYihM2bc.js";import"./toString-jlmj72dF.js";import"./Add-B9UtLfTX.js";import"./Grid-CLRvRbDN.js";import"./Box-5LOyitj9.js";import"./styled-VBtFtbNj.js";import"./TextField-xUwXrmKL.js";import"./Select-zsC6tXpT.js";import"./index-B9sM2jn7.js";import"./Popover-Dg3slux6.js";import"./Modal-BZoQWh9B.js";import"./Portal-DG1SCA6E.js";import"./List-DfB6hke5.js";import"./ListContext-DH23_8Wk.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-4MorzmI2.js";import"./FormLabel-COht3U-T.js";import"./InputLabel-Bs3e7Pvi.js";import"./ListItem-D5wUjexN.js";import"./ListItemIcon-DcBwmHXU.js";import"./ListItemText-jFKdxWsL.js";import"./Remove-CVVPCUyY.js";import"./useCopyToClipboard-7I7t0jup.js";import"./useMountedState-BYMagqon.js";import"./Button-CKd96K2t.js";import"./Divider-BNkMSFIU.js";import"./FormControlLabel-NXxO9XKS.js";import"./Checkbox-sHHhxHXb.js";import"./SwitchBase-Df9wCHit.js";import"./RadioGroup-DNAjCOlH.js";import"./MenuItem-CM6q5OW6.js";import"./translation-GBMM1Gml.js";import"./DialogTitle-CuYpVqTb.js";import"./Backdrop-DyvTB40d.js";import"./Tooltip-CgFVFwTk.js";import"./Popper-D0FUS77U.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-CuDLzZsa.js";import"./Edit-CBD_4iEx.js";import"./Cancel-AG64lISe.js";import"./Progress-YuIdkVov.js";import"./LinearProgress-B40cTZ8l.js";import"./ContentHeader-BIs9zhYQ.js";import"./Helmet-DSdGZgZY.js";import"./ErrorBoundary-k6DARfl7.js";import"./ErrorPanel-DT8LzRfG.js";import"./WarningPanel-Cevqk5r0.js";import"./ExpandMore-Dc1qa72P.js";import"./AccordionDetails-CzBbo4eK.js";import"./Collapse-B12c-Txj.js";import"./MarkdownContent-DcL7o88V.js";import"./CodeSnippet-vQgCgAWU.js";import"./CopyTextButton-CcbF4huw.js";import"./LinkButton-CWYcR8SV.js";import"./Link-Ds2c62Jm.js";import"./useElementFilter-DJYAdyiW.js";import"./InfoCard-BJ74Wy1V.js";import"./CardContent-BSBI4Wy_.js";import"./CardHeader-CcUDO6MN.js";import"./CardActions-BWT2Xrl1.js";import"./BottomLink-o8fjmmLZ.js";import"./ArrowForward-Br-ribbp.js";import"./useAsync-DPHt3xdh.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=d({entities:x}),o=new c;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>y(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[s,k],[w,o],[g,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":n.routes.root,"/catalog/:namespace/:kind/:name":u}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(l,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(p,{}),t.jsx(h,{}),t.jsx(f,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
