import{j as t,U as p,V as c,W as l,m as i,a0 as d}from"./iframe-mdeHk8Us.js";import{s as g,H as u}from"./plugin-Bfaq3gI2.js";import{c as h}from"./api-7YMquuMe.js";import{c as f}from"./catalogApiMock-dKstFqK5.js";import{s as x}from"./api-DMjNQc1b.js";import{S as y}from"./SearchContext-DSdjSGbp.js";import{P as S}from"./Page-qPAZSzb5.js";import{S as r}from"./Grid-DC2Tywm3.js";import{b as k,a as j,c as C}from"./plugin-BVcbV0Ox.js";import{T as P}from"./TemplateBackstageLogo-BNLSq80G.js";import{T as I}from"./TemplateBackstageLogoIcon-B26iY4Tf.js";import{e as T}from"./routes-DnEvmkHy.js";import{w as v}from"./appWrappers-BH9LHHFZ.js";import{s as G}from"./StarredEntitiesApi-YS-VTYLP.js";import{M as A}from"./MockStarredEntitiesApi-BLxIJPWt.js";import{I as B}from"./InfoCard-DYz9dhWP.js";import"./preload-helper-PPVm8Dsz.js";import"./index-cHl5grIV.js";import"./Plugin-BR79PUs9.js";import"./componentData-DyMAqMyS.js";import"./useAnalytics-Cte0NGRl.js";import"./useApp-DWNk4MUY.js";import"./useRouteRef-BPPz61H3.js";import"./index-DhB3CqmG.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useAsync-DlW7WdkC.js";import"./useMountedState-DqT-X8D-.js";import"./DialogTitle-CmcGNy32.js";import"./Modal-uDaBb03U.js";import"./Portal-CGi5eRlN.js";import"./Backdrop-B1KztC8w.js";import"./Button-DaFlKZgy.js";import"./useObservable-BYYos0JC.js";import"./useIsomorphicLayoutEffect-Bz91LDOF.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-D1IhYZuq.js";import"./ErrorBoundary-BLGxg7ja.js";import"./ErrorPanel-De8J-gDX.js";import"./WarningPanel-Cg3FNdiM.js";import"./ExpandMore-4uaBqvpS.js";import"./AccordionDetails-CY4b5vf9.js";import"./index-B9sM2jn7.js";import"./Collapse-B45VguHP.js";import"./MarkdownContent-DOJrLrbX.js";import"./CodeSnippet-DzFJqA_2.js";import"./Box-C_VvrdzU.js";import"./styled-BGP2DNJW.js";import"./CopyTextButton-BqpZzKnD.js";import"./useCopyToClipboard-DVW_Y7r9.js";import"./Tooltip-BRtijnu7.js";import"./Popper-D5LaxFiz.js";import"./List-X7Jezm93.js";import"./ListContext-EwKgne2S.js";import"./ListItem-L1zDUeu9.js";import"./ListItemText-DCPofTJa.js";import"./LinkButton-CSGY2AO6.js";import"./Link-dvajx9JY.js";import"./CardHeader-ByJ2FETy.js";import"./Divider-GxHdmRdJ.js";import"./CardActions-C4694dyD.js";import"./BottomLink-BPrh7zn-.js";import"./ArrowForward-BEuLEQbk.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Ft={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":T}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(I,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
