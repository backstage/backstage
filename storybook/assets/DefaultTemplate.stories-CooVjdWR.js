import{j as t,U as p,V as c,W as l,m as i,a0 as d}from"./iframe-CNJ8DcrC.js";import{s as g,H as u}from"./plugin-Dst3d3Mj.js";import{c as h}from"./api-Czrx5drN.js";import{c as f}from"./catalogApiMock-DEWcJE6Q.js";import{s as x}from"./api-BKCYVh3y.js";import{S as y}from"./SearchContext-C3uN_ZQ6.js";import{P as S}from"./Page-D9LCMz_f.js";import{S as r}from"./Grid-DnFVy6t2.js";import{b as k,a as j,c as C}from"./plugin-BPkq4E_8.js";import{T as P}from"./TemplateBackstageLogo-DyMGOrs3.js";import{T as I}from"./TemplateBackstageLogoIcon-arEd5Nyt.js";import{e as T}from"./routes-CAjpqkKz.js";import{w as v}from"./appWrappers-E57FXAeC.js";import{s as G}from"./StarredEntitiesApi-CD-XFus1.js";import{M as A}from"./MockStarredEntitiesApi-73_O5fI_.js";import{I as B}from"./InfoCard-c8gqZTx-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-S7vl_NFK.js";import"./Plugin-_567Mtia.js";import"./componentData-D59WTCiB.js";import"./useAnalytics-BIDW8Yu5.js";import"./useApp-ulf7OiyD.js";import"./useRouteRef-DK6B5L3X.js";import"./index-DkthXm2e.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useAsync-02suuxa3.js";import"./useMountedState-C-7cl-bH.js";import"./DialogTitle-BtCIznAI.js";import"./Modal-RnbSc_sU.js";import"./Portal-C64Jz60P.js";import"./Backdrop-BXGq-7tC.js";import"./Button-BezvKFLQ.js";import"./useObservable-CaBGgD30.js";import"./useIsomorphicLayoutEffect-EkL8LNZ8.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-C_MhXWNV.js";import"./ErrorBoundary-BHcUmZ0p.js";import"./ErrorPanel-Cfax6ZbZ.js";import"./WarningPanel-CAoaG3c4.js";import"./ExpandMore-P7Ms8H_E.js";import"./AccordionDetails-DFFwOrZV.js";import"./index-B9sM2jn7.js";import"./Collapse-CrkD-6-R.js";import"./MarkdownContent-BzDAUZZf.js";import"./CodeSnippet-Cp3x4Ngz.js";import"./Box-CtI-kND1.js";import"./styled-CIO5_I8O.js";import"./CopyTextButton-C1aJOmrW.js";import"./useCopyToClipboard-CMtB8QI9.js";import"./Tooltip-D6Gn2cGq.js";import"./Popper-DrUAX_Wn.js";import"./List-3BFbilF4.js";import"./ListContext--5bBRzIF.js";import"./ListItem-31tIz_LL.js";import"./ListItemText-BjTS0dlF.js";import"./LinkButton-CdwWq3H_.js";import"./Link-UFLrOQPe.js";import"./CardHeader-Croduw33.js";import"./Divider-BSUI1Y9r.js";import"./CardActions-D8qTLEGs.js";import"./BottomLink-iz8-XHvK.js";import"./ArrowForward-Xg3lDUK4.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Ft={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":T}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(I,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
