import{j as t,W as u,K as p,X as g}from"./iframe-DC0HuKGF.js";import{r as h}from"./plugin-BdYdXoja.js";import{S as l,u as c,a as x}from"./useSearchModal-DBM4UpBL.js";import{s as S,M}from"./api-qFrVV7Y9.js";import{S as C}from"./SearchContext-D_r8S1EG.js";import{B as m}from"./Button-DV2xQJT-.js";import{m as f}from"./makeStyles-CdFTekTr.js";import{D as j,a as y,b as B}from"./DialogTitle-Dtciy7Xt.js";import{B as D}from"./Box-CHRqFhJe.js";import{S as n}from"./Grid-B4PBabAQ.js";import{S as I}from"./SearchType-VbpdLMDB.js";import{L as G}from"./List-CssDjDLP.js";import{H as R}from"./DefaultResultListItem-CF_c3cCi.js";import{w as k}from"./appWrappers-tP4ySi-x.js";import{SearchBar as v}from"./SearchBar-EtzPT73s.js";import{S as T}from"./SearchResult-CApiMsp5.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CsB0h-cw.js";import"./Plugin-B8Vn7ilo.js";import"./componentData-D6GUiLTG.js";import"./useAnalytics-BaWCJwCB.js";import"./useApp-qCrtr9Gq.js";import"./useRouteRef-3mjRGht1.js";import"./index-B88MtuqO.js";import"./ArrowForward-HuWJULct.js";import"./translation-CGlcTDae.js";import"./Page-l1o6nwDT.js";import"./useMediaQuery-Ch9WpVI5.js";import"./Divider-DNA6aJNh.js";import"./ArrowBackIos-ZR30cyKV.js";import"./ArrowForwardIos-DY0S69Dd.js";import"./translation-BeJ9cqj6.js";import"./lodash-CrNJApB2.js";import"./useAsync-pX4Qh_w3.js";import"./useMountedState-DsJQXF1h.js";import"./Modal-BmT395tY.js";import"./Portal-BQrNoYBv.js";import"./Backdrop-DwcG5uTD.js";import"./styled-B4TWoPqU.js";import"./ExpandMore-BviA-7xr.js";import"./AccordionDetails-eCguWzjA.js";import"./index-B9sM2jn7.js";import"./Collapse-BID6kfZ_.js";import"./ListItem-ppf-hIBK.js";import"./ListContext-P3rTeiNo.js";import"./ListItemIcon-ClZ6XSB5.js";import"./ListItemText-BEMMREzR.js";import"./Tabs-DrpIxYYh.js";import"./KeyboardArrowRight-B7ArYsQL.js";import"./FormLabel-DDi_9Eij.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C9u7aH6n.js";import"./InputLabel-DNeoskIJ.js";import"./Select-DnZ_kkyZ.js";import"./Popover-DGTyTaBx.js";import"./MenuItem-g9bjAnHh.js";import"./Checkbox-B6H2vSRp.js";import"./SwitchBase-BTPjMVDw.js";import"./Chip-DcqZf6-M.js";import"./Link-DfdNxTky.js";import"./index-CMG1MCtf.js";import"./useObservable-CHbz0Rru.js";import"./useIsomorphicLayoutEffect-Btshp-T3.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-xpbqMMGb.js";import"./useDebounce-BBDL4OCc.js";import"./InputAdornment-BtLTJVZn.js";import"./TextField-Bg7cslY6.js";import"./useElementFilter-4wCyadVy.js";import"./EmptyState-CsYphWMi.js";import"./Progress-B_C5OgyL.js";import"./LinearProgress-BWbryrqb.js";import"./ResponseErrorPanel-CZDFGPZ4.js";import"./ErrorPanel-Tebf8nic.js";import"./WarningPanel-DgHvJcKU.js";import"./MarkdownContent-CQ1-5gKP.js";import"./CodeSnippet-BdWgOjZc.js";import"./CopyTextButton-BUqVBoGZ.js";import"./useCopyToClipboard-BDEmanwU.js";import"./Tooltip-CTOYHy8_.js";import"./Popper-3kZsTegL.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...r.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{r as CustomModal,e as Default,co as __namedExportsOrder,lo as default};
