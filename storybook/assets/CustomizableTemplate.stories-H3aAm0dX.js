import{j as t,T as i,c as m,C as a}from"./iframe-Ck0aXmTM.js";import{w as n}from"./appWrappers-sOes-H4-.js";import{s as p,H as s}from"./plugin-CAuMYVMv.js";import{c as d}from"./api-6tI0L48-.js";import{c}from"./catalogApiMock-B_sOBuvq.js";import{M as g}from"./MockStarredEntitiesApi-DUFrLQB8.js";import{s as l}from"./api-C8f7c2KJ.js";import{C as h}from"./CustomHomepageGrid-DaTDlwOx.js";import{H as f,a as u}from"./plugin-DWMh387_.js";import{e as y}from"./routes-D80en_I5.js";import{s as w}from"./StarredEntitiesApi-DyWMo8WR.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-DUKTvAPs.js";import"./useIsomorphicLayoutEffect-CpSeSuYs.js";import"./useAnalytics-B-_BiaZI.js";import"./useAsync-p0jLc8GG.js";import"./useMountedState-BgEDmEmL.js";import"./componentData-CCV_iCSl.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-DzaKdVpu.js";import"./useApp-Bsc5dzDy.js";import"./index-D6wcFf9r.js";import"./Plugin-D0ldxJ2a.js";import"./useRouteRef-CUlQEYbr.js";import"./ref-C0VTUPuL.js";import"./lodash-DLuUt6m8.js";import"./Add-DKxD-XDK.js";import"./Grid-DJzZ2-y-.js";import"./Box-DpOIFL5c.js";import"./styled-DLjnXpzN.js";import"./TextField-D64ZNtUr.js";import"./Select-CjOIaqH8.js";import"./index-B9sM2jn7.js";import"./Popover-C9BG-sVO.js";import"./Modal-CynqYC-h.js";import"./Portal-enzQuAv4.js";import"./List-Ch4xqBdJ.js";import"./ListContext-m5pyxhJx.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BzjRiLCP.js";import"./FormLabel-CkkwWIYx.js";import"./InputLabel-BsJlp0uy.js";import"./ListItem-BI_yLDsO.js";import"./ListItemIcon-DwE0qrkP.js";import"./ListItemText-BN5MiG2A.js";import"./Remove-zGomY1f9.js";import"./useCopyToClipboard-g3w1_GHx.js";import"./Button-1pGVjime.js";import"./Divider-B0knNu2M.js";import"./FormControlLabel-DuJA6Yub.js";import"./Checkbox-xWzz3qf8.js";import"./SwitchBase-BAdEGN-J.js";import"./RadioGroup-B4BAFPGG.js";import"./MenuItem-DRhwvxmp.js";import"./translation-B9oNBSbz.js";import"./DialogTitle-CrkBwyZG.js";import"./Backdrop-D-sGQwlB.js";import"./Tooltip-Sxlj4qdH.js";import"./Popper-DOPOD1lh.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-PPMGzeO5.js";import"./Edit-D6qfDlHq.js";import"./Cancel-wZAObE93.js";import"./Progress-DdwM_AUv.js";import"./LinearProgress-DBvqEqE7.js";import"./ContentHeader-CHayuRlO.js";import"./Helmet-D6_yNg5f.js";import"./ErrorBoundary-BLpzyTxf.js";import"./ErrorPanel-SFTFZur6.js";import"./WarningPanel-BnKvh7bd.js";import"./ExpandMore-XskE5SkY.js";import"./AccordionDetails-Dunbukgx.js";import"./Collapse-DxAw5EoH.js";import"./MarkdownContent-DTz2Je40.js";import"./CodeSnippet-1zCVoflW.js";import"./CopyTextButton-C18-3nwc.js";import"./LinkButton-D0uXKDvs.js";import"./Link-8mv2gKfv.js";import"./useElementFilter-CwOSdpfj.js";import"./InfoCard-XzrYcPvm.js";import"./CardContent-CrT56zzi.js";import"./CardHeader-BGZWsIne.js";import"./CardActions-B9r0eKLY.js";import"./BottomLink-Cj7rNAle.js";import"./ArrowForward-DkJkdPgV.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
