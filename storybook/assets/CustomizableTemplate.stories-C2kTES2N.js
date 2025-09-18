import{j as t,T as i,c as m,C as a}from"./iframe-COb0l9Ot.js";import{w as n}from"./appWrappers-CUP1_xOq.js";import{s as p,H as s}from"./plugin-BIpkjt-U.js";import{c as d}from"./api-Dpn8D6Zy.js";import{c}from"./catalogApiMock-BpIs8tpe.js";import{M as g}from"./MockStarredEntitiesApi-C4Bh5q2s.js";import{s as l}from"./api-B05H-Oij.js";import{C as h}from"./CustomHomepageGrid-CHyVn6rI.js";import{H as f,a as u}from"./plugin-BF5haQ0y.js";import{e as y}from"./routes-Cc-gwHbh.js";import{s as w}from"./StarredEntitiesApi-Bsu3PkMv.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-GPFeSMKQ.js";import"./useAnalytics-BEClZYF1.js";import"./useAsync-Ove48rSA.js";import"./useMountedState-BCYouEnX.js";import"./componentData-BMcw6RgA.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-C2rNmFdC.js";import"./useApp-DOIE3BzV.js";import"./index-DEw7olbh.js";import"./Plugin-d8SAvW_D.js";import"./useRouteRef-B3C5BO0J.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-BQNWWhRF.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-CS22b-CP.js";import"./Grid-YEqTPm11.js";import"./Box-DdeU9hBZ.js";import"./styled-COzJBZos.js";import"./TextField-Bw26PUml.js";import"./Select-ByLRgTp3.js";import"./index-DnL3XN75.js";import"./Popover-aodZVFnE.js";import"./Modal-Da3_mpt5.js";import"./Portal-DhkyDrOm.js";import"./List-C_SD4FZR.js";import"./ListContext-C2fYDrJh.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Cch3sisq.js";import"./FormLabel-BjNSCMWe.js";import"./InputLabel-DyvbRCEM.js";import"./ListItem-BXV5PRVp.js";import"./ListItemIcon-CYx9DnQ_.js";import"./ListItemText-Cpgtr8oy.js";import"./Remove-DLg3m3S6.js";import"./useCopyToClipboard-Bc2Muk56.js";import"./Button-2GtkzPEz.js";import"./Divider-DBtusLcX.js";import"./FormControlLabel-KmwI8_F7.js";import"./Checkbox-BxyG6ABj.js";import"./SwitchBase-RRrgaKwm.js";import"./RadioGroup-BppO4vHF.js";import"./MenuItem-UI-6mgld.js";import"./translation-B9J70YWK.js";import"./DialogTitle-B1Fp7DaC.js";import"./Backdrop-DvB5sMhK.js";import"./Tooltip-DiHf9MQ-.js";import"./Popper-Jg-KIdHc.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-D8PsSVbh.js";import"./Edit-C72x0fZt.js";import"./Cancel-CruycgsO.js";import"./Progress-CGri_y1v.js";import"./LinearProgress-CzhWWhfE.js";import"./ContentHeader-DF5pJMCf.js";import"./Helmet-DfLP-98t.js";import"./ErrorBoundary-DODDDLR0.js";import"./ErrorPanel-BXUGmJvH.js";import"./WarningPanel-CNUUwcSO.js";import"./ExpandMore-DzIoUaMP.js";import"./AccordionDetails-xHtvINQ6.js";import"./Collapse-DKLG8K48.js";import"./MarkdownContent-DWCHMYxR.js";import"./CodeSnippet-DUq6zHFn.js";import"./CopyTextButton-L7Y3IiwS.js";import"./LinkButton-CXB10pz2.js";import"./Link-Ct1evR27.js";import"./useElementFilter-mCl7Q9CS.js";import"./InfoCard-D7qgUOA3.js";import"./CardContent-Dv8QIF22.js";import"./CardHeader-Bx-1HdmL.js";import"./CardActions-DeYkfajh.js";import"./BottomLink-LHhWavGh.js";import"./ArrowForward-BIQnZ3Mi.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ie={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...e.parameters?.docs?.source}}};const me=["CustomizableTemplate"];export{e as CustomizableTemplate,me as __namedExportsOrder,ie as default};
