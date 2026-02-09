import{j as t,U as p,V as c,W as l,m as i,a0 as d}from"./iframe-CZ56O-V9.js";import{s as g,H as u}from"./plugin-BUPH-RXF.js";import{c as h}from"./api-D5xBhMlD.js";import{c as f}from"./catalogApiMock-BJGuRpZz.js";import{s as x}from"./api-C0b41NLl.js";import{S as y}from"./SearchContext-kWgyC5N7.js";import{P as S}from"./Page-BZ1W-zKi.js";import{S as r}from"./Grid-DjbHNKXL.js";import{b as k,a as j,c as C}from"./plugin-D7PDWxiM.js";import{T as P}from"./TemplateBackstageLogo-DH7Cxjwo.js";import{T as I}from"./TemplateBackstageLogoIcon-COLcPPzM.js";import{e as T}from"./routes-DCIpPh8u.js";import{w as v}from"./appWrappers-BeJ0xyiP.js";import{s as G}from"./StarredEntitiesApi-DE9_rC4H.js";import{M as A}from"./MockStarredEntitiesApi-DbYXJT6X.js";import{I as B}from"./InfoCard-BF5bOwh8.js";import"./preload-helper-PPVm8Dsz.js";import"./index-EaCOp69p.js";import"./Plugin-DZUy8-Yb.js";import"./componentData-CSZ8ujY9.js";import"./useAnalytics-BS680IS8.js";import"./useApp-BeYLp8SO.js";import"./useRouteRef-CcFxojYp.js";import"./index-Ca3h4iDJ.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useAsync-BZsMG4pg.js";import"./useMountedState-ut5gwY4t.js";import"./DialogTitle-C-1j8eOs.js";import"./Modal-CQLQBAd-.js";import"./Portal-rgcloK6u.js";import"./Backdrop-DdZZM_yb.js";import"./Button-DKgYvdYh.js";import"./useObservable-ByqNzwSP.js";import"./useIsomorphicLayoutEffect-D3HbnLj9.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-DTAML6Xx.js";import"./ErrorBoundary-bCgK2ux4.js";import"./ErrorPanel-CQnJnEL8.js";import"./WarningPanel-CChAptH0.js";import"./ExpandMore-yvURIOcL.js";import"./AccordionDetails-BaPE-Me3.js";import"./index-B9sM2jn7.js";import"./Collapse-DPNvm9kr.js";import"./MarkdownContent-BOJKT2W9.js";import"./CodeSnippet-rkZMP_wC.js";import"./Box-MN-uZs4I.js";import"./styled-D9whByUF.js";import"./CopyTextButton-wUac2sWa.js";import"./useCopyToClipboard-CrTqHNaz.js";import"./Tooltip-B8FLw8lE.js";import"./Popper-7tudyaaz.js";import"./List-DEdaJe5c.js";import"./ListContext-BmrJCIpO.js";import"./ListItem-BtvfynNb.js";import"./ListItemText-Dn38yijY.js";import"./LinkButton-Bp2XTFR0.js";import"./Link-BQF_zimC.js";import"./CardHeader-BN2Aoi7y.js";import"./Divider-C407Z4rN.js";import"./CardActions-PhczM4sT.js";import"./BottomLink-B_bxfdsL.js";import"./ArrowForward-CzbSCcaK.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Ft={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":T}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(I,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Ft as default};
