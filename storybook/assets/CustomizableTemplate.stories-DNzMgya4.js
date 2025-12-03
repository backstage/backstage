import{j as t,T as i,c as m,C as a}from"./iframe-C9zrakkc.js";import{w as n}from"./appWrappers-D30AEFfJ.js";import{s as p,H as s}from"./plugin-BRJcO3GI.js";import{c as d}from"./api-DOeM-2MH.js";import{c}from"./catalogApiMock-BwExXJqt.js";import{M as g}from"./MockStarredEntitiesApi-E5eh3ea9.js";import{s as l}from"./api-ADZ3AgWv.js";import{C as h}from"./CustomHomepageGrid-BYn30ioN.js";import{H as f,a as u}from"./plugin-FvNGz4xC.js";import{e as y}from"./routes-m1hxvVLe.js";import{s as w}from"./StarredEntitiesApi-B3XHKtsK.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-DNrCFxZS.js";import"./useIsomorphicLayoutEffect-BN5wUfcv.js";import"./useAnalytics-DAZilNqi.js";import"./useAsync-ClKr9TyR.js";import"./useMountedState-C5AiKHab.js";import"./componentData-CTZUzyGA.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-kZEKiPjo.js";import"./useApp-5u7uhQnf.js";import"./index-CjAyISCC.js";import"./Plugin-DYqBkcEW.js";import"./useRouteRef-u0DWcSPD.js";import"./ref-C0VTUPuL.js";import"./lodash-Y_-RFQgK.js";import"./get-BObuEKJd.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-C4kO_AfH.js";import"./Grid-JwSod7uj.js";import"./Box-C1t3nISm.js";import"./styled-q2Tapbp0.js";import"./TextField-BhlizQZW.js";import"./Select-BbWiZwSi.js";import"./index-B9sM2jn7.js";import"./Popover-DNks6xHK.js";import"./Modal-BI7VDIZ7.js";import"./Portal-CYobuNZx.js";import"./List-Dykhft8E.js";import"./ListContext-D4YzdYeM.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C-RjzHBz.js";import"./FormLabel-KYyo1YaL.js";import"./InputLabel-BZzk3L7N.js";import"./ListItem-DN7mBFNT.js";import"./ListItemIcon-BN7Nr2w-.js";import"./ListItemText-u9zyj5b2.js";import"./Remove-pUmEkBTg.js";import"./useCopyToClipboard-hqcagNht.js";import"./Button-CmMZjW_f.js";import"./Divider-BvnOZNSI.js";import"./FormControlLabel-Bht_rFHf.js";import"./Checkbox-Dwz9kxDq.js";import"./SwitchBase-B3wrQpA3.js";import"./RadioGroup-B6CS0nC8.js";import"./MenuItem-gfVzx_r1.js";import"./translation-kkIvn1sR.js";import"./DialogTitle-Bu0pvr4n.js";import"./Backdrop-CAN_1fph.js";import"./Tooltip-CwwM6KlC.js";import"./Popper-CnoPmosF.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-BW_w0KUo.js";import"./Edit-zvfpyxR9.js";import"./Cancel-BnFAWcX4.js";import"./Progress-BDzvqsPx.js";import"./LinearProgress-Cebcaf6E.js";import"./ContentHeader-BTpw0BKl.js";import"./Helmet-DwgoPk_d.js";import"./ErrorBoundary-DT6g9ILI.js";import"./ErrorPanel-C1y9p2wT.js";import"./WarningPanel-BpsyaNdk.js";import"./ExpandMore-BmhSC8QK.js";import"./AccordionDetails-CO835Xyy.js";import"./Collapse-BSaPuFEG.js";import"./MarkdownContent-DnFMmDme.js";import"./CodeSnippet-DR38SpuH.js";import"./CopyTextButton-ClvHCzDa.js";import"./LinkButton-C-LjwduR.js";import"./Link-C1eBfv8e.js";import"./useElementFilter-DRQvtUH7.js";import"./InfoCard-RbAMJy0N.js";import"./CardContent-o9HZeIUg.js";import"./CardHeader-BJEjS_-7.js";import"./CardActions-C42Lpz0g.js";import"./BottomLink-CXlh_zpn.js";import"./ArrowForward-B_STm-OI.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
