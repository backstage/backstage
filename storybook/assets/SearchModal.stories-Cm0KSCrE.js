import{j as t,W as u,K as p,X as g}from"./iframe-C7l5P2_I.js";import{r as h}from"./plugin-DPuOR93M.js";import{S as l,u as c,a as x}from"./useSearchModal-COReHaq2.js";import{s as S,M}from"./api-SlqoqosF.js";import{S as C}from"./SearchContext-9snaNFoN.js";import{B as m}from"./Button-D7Ao-a7e.js";import{m as f}from"./makeStyles-DO0dhQTG.js";import{D as j,a as y,b as B}from"./DialogTitle-unfTSm9Q.js";import{B as D}from"./Box-CnwfTMBK.js";import{S as n}from"./Grid-3Bz-t9Mk.js";import{S as I}from"./SearchType-lA2wPtnr.js";import{L as G}from"./List-C_Ju4KCi.js";import{H as R}from"./DefaultResultListItem-CZA31BEw.js";import{w as k}from"./appWrappers-BwMR1oiP.js";import{SearchBar as v}from"./SearchBar-CHMMa6cZ.js";import{S as T}from"./SearchResult-DhX8UGtn.js";import"./preload-helper-PPVm8Dsz.js";import"./index-AwOpyO1Z.js";import"./Plugin-Eik_njzZ.js";import"./componentData-CwoAHc-h.js";import"./useAnalytics-DvfsJVgo.js";import"./useApp-B0ylAoYl.js";import"./useRouteRef-BkHmtX3l.js";import"./index-Ct-Fv-qt.js";import"./ArrowForward-DykIDrM0.js";import"./translation-Cp6YYl2V.js";import"./Page-DTuwIqbR.js";import"./useMediaQuery-DZhcWUcO.js";import"./Divider-5Td0Zzlj.js";import"./ArrowBackIos-DzFeOEDj.js";import"./ArrowForwardIos-CNcKtOKg.js";import"./translation-BtRyzUJJ.js";import"./lodash-C_n5Ni0i.js";import"./useAsync-D4ApmH3Q.js";import"./useMountedState-C3T3GhQF.js";import"./Modal-irLIXdct.js";import"./Portal-YwRf0OFq.js";import"./Backdrop-BaI6MFq9.js";import"./styled-BQ5_1fzN.js";import"./ExpandMore-CJL170OC.js";import"./AccordionDetails-Ctvsfxbt.js";import"./index-B9sM2jn7.js";import"./Collapse-Ch0HaP0g.js";import"./ListItem-DkGdhH3Z.js";import"./ListContext-Dobuofun.js";import"./ListItemIcon-C3_VkfIf.js";import"./ListItemText-BiXUwKFP.js";import"./Tabs-BvjGPY8g.js";import"./KeyboardArrowRight-Dtbg4m6Y.js";import"./FormLabel-BduOcCS6.js";import"./formControlState-Cg625is9.js";import"./InputLabel-BzXMwAn9.js";import"./Select-DtfcHVIh.js";import"./Popover-B2wLjBT4.js";import"./MenuItem-wX1DH0fS.js";import"./Checkbox-Pj7D5a7g.js";import"./SwitchBase-B1krwLlg.js";import"./Chip-BF6e1TPJ.js";import"./Link-DErIwACF.js";import"./index-DlhmoIZL.js";import"./useObservable-Cb3DKD_r.js";import"./useIsomorphicLayoutEffect-C1XtiqS1.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-C1ZK11T8.js";import"./useDebounce-C2o2WC8_.js";import"./InputAdornment-Bj8RPjdS.js";import"./TextField-B7UhiS5j.js";import"./useElementFilter-BaAk7PZo.js";import"./EmptyState-CRVN_IAQ.js";import"./Progress-NYEqWOfj.js";import"./LinearProgress-CmuwQZTf.js";import"./ResponseErrorPanel-DOMe2sqT.js";import"./ErrorPanel-8I3SgwC9.js";import"./WarningPanel-BPh4fMZg.js";import"./MarkdownContent-DVR9imM6.js";import"./CodeSnippet-D-XpegSk.js";import"./CopyTextButton-DfneHI78.js";import"./useCopyToClipboard-CR8tyuMd.js";import"./Tooltip-DXtsjz2q.js";import"./Popper-CuIlqdpq.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},io={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...r.parameters?.docs?.source}}};const lo=["Default","CustomModal"];export{r as CustomModal,e as Default,lo as __namedExportsOrder,io as default};
