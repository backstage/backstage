import{j as t,T as i,c as m,C as a}from"./iframe-omS-VfEE.js";import{w as n}from"./appWrappers-D_rcKu23.js";import{s as p,H as s}from"./plugin-_6NABpqd.js";import{c as d}from"./api-CfgbfKHQ.js";import{c}from"./catalogApiMock-CeKsI1ay.js";import{M as g}from"./MockStarredEntitiesApi-Diryaini.js";import{s as l}from"./api-BPHn8KSC.js";import{C as h}from"./CustomHomepageGrid-BSvjCDjS.js";import{H as f,a as u}from"./plugin-COsCyJhl.js";import{e as y}from"./routes-CRW5F21M.js";import{s as w}from"./StarredEntitiesApi-CfYtzmG6.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-CWiuwahj.js";import"./useIsomorphicLayoutEffect-NeOa0wWc.js";import"./useAnalytics-DpXUy368.js";import"./useAsync-XDPyEQBh.js";import"./useMountedState-B72_4ZkH.js";import"./componentData-rUfARfxE.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-BJYML3pb.js";import"./useApp-DFGFX2A_.js";import"./index-CxYQenE5.js";import"./Plugin-CgzkpFyB.js";import"./useRouteRef-Q1h4R6gV.js";import"./ref-C0VTUPuL.js";import"./lodash-Y_-RFQgK.js";import"./get-Bc-R-48a.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-CYKR_nZR.js";import"./Grid-BYUcu-HN.js";import"./Box-CkfuSc_q.js";import"./styled-D7Xcwibq.js";import"./TextField-KC2YsO6S.js";import"./Select-cBs4AoEA.js";import"./index-B9sM2jn7.js";import"./Popover-CrWWJ3tC.js";import"./Modal-BJT6EnpA.js";import"./Portal-tl-MtD9Q.js";import"./List-C9vsaZyo.js";import"./ListContext-CkIdZQYa.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CCoK0o0X.js";import"./FormLabel-CMRKpa-Z.js";import"./InputLabel-DTyloQDa.js";import"./ListItem-CyW2KymL.js";import"./ListItemIcon-uG6Zdidr.js";import"./ListItemText-pfsweG72.js";import"./Remove-CVwhuRAx.js";import"./useCopyToClipboard-fqzv143-.js";import"./Button-cwljLBUl.js";import"./Divider-B1hRM44o.js";import"./FormControlLabel-e72U6ksP.js";import"./Checkbox-B25j5ajB.js";import"./SwitchBase-CHLia2ma.js";import"./RadioGroup-B7Y08yS3.js";import"./MenuItem-B-ZJdPwj.js";import"./translation-Dh24WQYh.js";import"./DialogTitle-CbcbXP0z.js";import"./Backdrop-peojPdzD.js";import"./Tooltip-ER_nPOs0.js";import"./Popper-DnFnSudK.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-BMHTwbYs.js";import"./Edit-mMBwCObY.js";import"./Cancel-Dme6q3ux.js";import"./Progress-DKbNvoZJ.js";import"./LinearProgress-BweHx2gc.js";import"./ContentHeader-efQnds20.js";import"./Helmet-CwJLIj-9.js";import"./ErrorBoundary-bGwTKSED.js";import"./ErrorPanel-NSHOjdDK.js";import"./WarningPanel-BpYFzcLR.js";import"./ExpandMore-B7pPANEl.js";import"./AccordionDetails-BhNEpOi0.js";import"./Collapse-BMfiGGQz.js";import"./MarkdownContent-CrQrCbdZ.js";import"./CodeSnippet-D7viEsWF.js";import"./CopyTextButton-Dpc4LkrT.js";import"./LinkButton-D_wGBfsj.js";import"./Link-BWOCx2Nz.js";import"./useElementFilter-BN32wk0X.js";import"./InfoCard-k7q1vcR-.js";import"./CardContent-mylIdFzd.js";import"./CardHeader-Bsb9krxm.js";import"./CardActions-BmZcl3bV.js";import"./BottomLink-BEo5oPXt.js";import"./ArrowForward-Q3VMHoWX.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
