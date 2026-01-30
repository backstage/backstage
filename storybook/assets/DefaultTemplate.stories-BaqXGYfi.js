import{j as t,U as p,V as c,W as l,m as i,a0 as d}from"./iframe-CJaWlx9k.js";import{s as g,H as u}from"./plugin-CB5XIHom.js";import{c as h}from"./api-atHlAjLX.js";import{c as f}from"./catalogApiMock-wVjvbFI-.js";import{s as x}from"./api-B2GOuMSA.js";import{S as y}from"./SearchContext-BsgFsiMu.js";import{P as S}from"./Page-SAHP2BU2.js";import{S as r}from"./Grid-CvrlVjPi.js";import{b as k,a as j,c as C}from"./plugin-HC6L5CqT.js";import{T as P}from"./TemplateBackstageLogo-Cz_lBmnX.js";import{T as I}from"./TemplateBackstageLogoIcon-CCaqY7Yx.js";import{e as T}from"./routes-CxQwpNa_.js";import{w as v}from"./appWrappers-KXpf8wG0.js";import{s as G}from"./StarredEntitiesApi-CITPCDyJ.js";import{M as A}from"./MockStarredEntitiesApi-C_c9KR6d.js";import{I as B}from"./InfoCard-Dwr3nloC.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B0cKtLFQ.js";import"./Plugin-CYNhPwzU.js";import"./componentData-DJazsba3.js";import"./useAnalytics-B9VoDArS.js";import"./useApp-C3Rn7vNb.js";import"./useRouteRef-DSloxSH6.js";import"./index-BQ0Bm2RY.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useAsync-BIkYo0dn.js";import"./useMountedState-BX2n2ffy.js";import"./DialogTitle-Ddd7NJfh.js";import"./Modal-DA7gw75D.js";import"./Portal-CCaSbatU.js";import"./Backdrop-Br04yFLt.js";import"./Button-BIo1VJpq.js";import"./useObservable-Ci9nj0uo.js";import"./useIsomorphicLayoutEffect-DaQ9vgb_.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-Cz50hYBX.js";import"./ErrorBoundary-Tzl3QUgw.js";import"./ErrorPanel-B3gEy6QN.js";import"./WarningPanel-Bt3VBM0r.js";import"./ExpandMore-C8_7pfNC.js";import"./AccordionDetails-rBd-wslk.js";import"./index-B9sM2jn7.js";import"./Collapse-Do9YA9sk.js";import"./MarkdownContent-BbMUo3g_.js";import"./CodeSnippet-7H2Sad9p.js";import"./Box-C7QC6pzn.js";import"./styled-CZ7JF9wM.js";import"./CopyTextButton-BT4ENnB_.js";import"./useCopyToClipboard-D8QOZa6n.js";import"./Tooltip-BdyP1fjK.js";import"./Popper-D3Zb46nS.js";import"./List-CG61H5Q6.js";import"./ListContext-BgC5EWvT.js";import"./ListItem-C89Oh5hh.js";import"./ListItemText-DiADD6kG.js";import"./LinkButton-5bxMHofQ.js";import"./Link-BT9-PDsb.js";import"./CardHeader-C3-hJvDl.js";import"./Divider-iZOmm7wk.js";import"./CardActions-BgceOLG0.js";import"./BottomLink-Dm0y6uih.js";import"./ArrowForward-DYtCoeK4.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Ft={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":T}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(I,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
