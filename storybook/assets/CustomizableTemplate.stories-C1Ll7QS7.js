import{j as t,T as i,c as m,C as a}from"./iframe-BkB0QVAX.js";import{w as n}from"./appWrappers-BeDZegEM.js";import{s as p,H as s}from"./plugin-CBIYz47d.js";import{c as d}from"./api-CEiBGx8U.js";import{c}from"./catalogApiMock-BYYB8rMz.js";import{M as g}from"./MockStarredEntitiesApi-BUhK8b6p.js";import{s as l}from"./api-B9NsujrE.js";import{C as h}from"./CustomHomepageGrid-DiTjMJ4o.js";import{H as f,a as u}from"./plugin-DI1j4xAJ.js";import{e as y}from"./routes-Bi26js9W.js";import{s as w}from"./StarredEntitiesApi-DprOxcyk.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-ix0ZtonL.js";import"./useAnalytics-BaiO7IUZ.js";import"./useAsync-xBHTNlYp.js";import"./useMountedState-pzVPha7m.js";import"./componentData-BqyKlC7z.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-CG9-iTWl.js";import"./useApp-BcKqXm1b.js";import"./index-6E8IA5LZ.js";import"./Plugin-BB1nd9si.js";import"./useRouteRef-D7AJ89qx.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-CUN2pDXl.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-BDalVNly.js";import"./Grid-GzVmgdg9.js";import"./Box-BYh2ueao.js";import"./styled-BkGenL9r.js";import"./TextField-DSM0WJpF.js";import"./Select-BbTHpLlz.js";import"./index-DnL3XN75.js";import"./Popover-Kzi_v5IP.js";import"./Modal-BGWqml8P.js";import"./Portal-CniYJQFb.js";import"./List-CL3RsQbd.js";import"./ListContext-1D3zRM57.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-D0qRsh9W.js";import"./FormLabel-ClUz7mT-.js";import"./InputLabel-CyJm0unI.js";import"./ListItem-uoYhpxef.js";import"./ListItemIcon-Doegkffe.js";import"./ListItemText-ClLUctdJ.js";import"./Remove-7fwiSaQI.js";import"./useCopyToClipboard-ybsekL_1.js";import"./Button-VsEN5bia.js";import"./Divider-BE4Qblaw.js";import"./FormControlLabel-4z2tT4Pv.js";import"./Checkbox-D4VTcckx.js";import"./SwitchBase-_iX5HTV7.js";import"./RadioGroup-CB83qTPE.js";import"./MenuItem-gWsmckXV.js";import"./translation-Dgpu4WLp.js";import"./DialogTitle-BDGKjWc8.js";import"./Backdrop-V6ewlv6k.js";import"./Tooltip-Cw7U8Fon.js";import"./Popper-CoIZ3FWg.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-8X7rFIUJ.js";import"./Edit-BxkbyjYz.js";import"./Cancel-CwleDvGh.js";import"./Progress-GBe0RL6j.js";import"./LinearProgress-CRaYMVia.js";import"./ContentHeader-CNpm-zkg.js";import"./Helmet-CBuMUBOD.js";import"./ErrorBoundary-CG99R0aj.js";import"./ErrorPanel-33EFS4fI.js";import"./WarningPanel-C4fTNgaU.js";import"./ExpandMore-BpFbETJI.js";import"./AccordionDetails-BPj0HgKP.js";import"./Collapse-CFXKULw1.js";import"./MarkdownContent-C_11qXRU.js";import"./CodeSnippet-928r43_H.js";import"./CopyTextButton-SuTXHCNw.js";import"./LinkButton-Dk1fxXeJ.js";import"./Link-DEl3EO73.js";import"./useElementFilter-Cn9M9skL.js";import"./InfoCard-vDgIcNkq.js";import"./CardContent-C9KAu5n0.js";import"./CardHeader-CjkICost.js";import"./CardActions-C5dkW2n_.js";import"./BottomLink-kRokVK0c.js";import"./ArrowForward-BeJ_-l-J.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ie={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
