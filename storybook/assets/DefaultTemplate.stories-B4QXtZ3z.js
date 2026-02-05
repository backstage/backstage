import{j as t,U as p,V as c,W as l,m as i,a0 as d}from"./iframe-DVtcQ4_z.js";import{s as g,H as u}from"./plugin-DcX1mr0d.js";import{c as h}from"./api-_IPIrAgL.js";import{c as f}from"./catalogApiMock-DW6_SfUm.js";import{s as x}from"./api-BrBgl4nj.js";import{S as y}from"./SearchContext-Ag9TnxPT.js";import{P as S}from"./Page-Bj-_Guvz.js";import{S as r}from"./Grid-CRH4wMFl.js";import{b as k,a as j,c as C}from"./plugin-Dz8jVe6c.js";import{T as P}from"./TemplateBackstageLogo-BDiWaVje.js";import{T as I}from"./TemplateBackstageLogoIcon-HDtyy6CY.js";import{e as T}from"./routes-DAK1h19m.js";import{w as v}from"./appWrappers-9shJdU2k.js";import{s as G}from"./StarredEntitiesApi-Cujf8x3c.js";import{M as A}from"./MockStarredEntitiesApi-BbV8k0Op.js";import{I as B}from"./InfoCard-lskUPJjc.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CUu5uJIM.js";import"./Plugin-BFejrjRb.js";import"./componentData-DLUR4SEc.js";import"./useAnalytics-BDGM9FZv.js";import"./useApp-hPSWuSwz.js";import"./useRouteRef-CmZgmteL.js";import"./index-nBdCQRka.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useAsync-0ylosLEO.js";import"./useMountedState-rAyQYyeH.js";import"./DialogTitle-DWxUih24.js";import"./Modal-C3aeePrL.js";import"./Portal-kTp41skA.js";import"./Backdrop-BrMkINGu.js";import"./Button-B6Zk0t0c.js";import"./useObservable-B_06OWLq.js";import"./useIsomorphicLayoutEffect-DivdhHMv.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-CiVhExeM.js";import"./ErrorBoundary-DlSuROHw.js";import"./ErrorPanel-BTyMCoIE.js";import"./WarningPanel-DWnW9ndp.js";import"./ExpandMore-BZTl6lHp.js";import"./AccordionDetails-20s0m78U.js";import"./index-B9sM2jn7.js";import"./Collapse-BTPpLLfL.js";import"./MarkdownContent-C-D6oakD.js";import"./CodeSnippet-CJietKeS.js";import"./Box-D_1MPpAq.js";import"./styled-2Y3L2rTs.js";import"./CopyTextButton-DhwWsCh2.js";import"./useCopyToClipboard-ImQlBzLn.js";import"./Tooltip-dh41oCcd.js";import"./Popper-DhFFD-7P.js";import"./List-DxsGYjB2.js";import"./ListContext-Br6vO3Y2.js";import"./ListItem-C0fXON46.js";import"./ListItemText-CpGTJDVb.js";import"./LinkButton-6srsW-_l.js";import"./Link-t6CnRMqh.js";import"./CardHeader-DLPiWAMi.js";import"./Divider-BmAsVb_O.js";import"./CardActions-DNd32Pjk.js";import"./BottomLink-zMVcDBLB.js";import"./ArrowForward-C8LFtIoy.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Ft={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":T}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(I,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
