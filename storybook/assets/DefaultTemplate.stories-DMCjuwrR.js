import{j as t,U as p,V as c,W as l,m as i,a0 as d}from"./iframe-Bfb6es7h.js";import{s as g,H as u}from"./plugin-Czl-hij-.js";import{c as h}from"./api-zYOlh7Z2.js";import{c as f}from"./catalogApiMock-BOs1tnWK.js";import{s as x}from"./api-Bhq5iyV7.js";import{S as y}from"./SearchContext-DdfJXW0C.js";import{P as S}from"./Page-BaEbv32K.js";import{S as r}from"./Grid-fOEQuWsY.js";import{b as k,a as j,c as C}from"./plugin-BrovwtcV.js";import{T as P}from"./TemplateBackstageLogo-w-ZscEcY.js";import{T as I}from"./TemplateBackstageLogoIcon-DwCn7Rkd.js";import{e as T}from"./routes-CyDVDO8Y.js";import{w as v}from"./appWrappers-DdoKMAzO.js";import{s as G}from"./StarredEntitiesApi-Wer1l1mQ.js";import{M as A}from"./MockStarredEntitiesApi-B1tmb-Zx.js";import{I as B}from"./InfoCard-D7aUfm_W.js";import"./preload-helper-PPVm8Dsz.js";import"./index-f1R-dcZD.js";import"./Plugin-CXIsHHNu.js";import"./componentData-ALPptmD3.js";import"./useAnalytics-CVOFFuvg.js";import"./useApp-kTvTF_u-.js";import"./useRouteRef-BqEacaGv.js";import"./index-BH1Qp3-H.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useAsync-DkTP0ua2.js";import"./useMountedState-BiNiTtFn.js";import"./DialogTitle--znV04_h.js";import"./Modal-CMLC8fQ-.js";import"./Portal-DoGSafYV.js";import"./Backdrop-BFCoYjYZ.js";import"./Button-DgLe45Cx.js";import"./useObservable-D9R9w3U2.js";import"./useIsomorphicLayoutEffect-3QlRcHa3.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-D42-qhAJ.js";import"./ErrorBoundary-RfTVQpC0.js";import"./ErrorPanel-Cdw_oYMz.js";import"./WarningPanel-D8tYRIvI.js";import"./ExpandMore-DoDRnIYA.js";import"./AccordionDetails-CKP4iHhe.js";import"./index-B9sM2jn7.js";import"./Collapse-DB4Tv0RR.js";import"./MarkdownContent-BP6bDfRC.js";import"./CodeSnippet-BB1hf6Ht.js";import"./Box-C8tWNgkw.js";import"./styled-DNaQ7xBF.js";import"./CopyTextButton-Bg_o-RoR.js";import"./useCopyToClipboard-CxgcRXBX.js";import"./Tooltip-BIMvLisP.js";import"./Popper-C-IKLGjO.js";import"./List-DdY4r3Qa.js";import"./ListContext-DK41gHFX.js";import"./ListItem-CdGfarMd.js";import"./ListItemText-VDXTeYlf.js";import"./LinkButton-BgEyZHgU.js";import"./Link-BXHXb0Ac.js";import"./CardHeader-hEQM7px_.js";import"./Divider-Dfh3vDVi.js";import"./CardActions-DwnWnO57.js";import"./BottomLink-P4zcIuMj.js";import"./ArrowForward-CTIzHOFz.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Ft={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":T}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(I,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
