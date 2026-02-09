import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-CXYsSFqX.js";import{r as x}from"./plugin-CtBYKFwY.js";import{S as l,u as c,a as S}from"./useSearchModal-BrtPS2mp.js";import{s as M,M as C}from"./api-D9jKqI1j.js";import{S as f}from"./SearchContext-CWgLiHyi.js";import{B as m}from"./Button-D0m-IwQo.js";import{D as j,a as y,b as B}from"./DialogTitle-CexE-OMt.js";import{B as D}from"./Box-DCh7b65F.js";import{S as n}from"./Grid-CBLufU_i.js";import{S as I}from"./SearchType-FRSfUVZO.js";import{L as G}from"./List-CDWQPT5T.js";import{H as R}from"./DefaultResultListItem-n1dklPIF.js";import{w as k}from"./appWrappers-DM9hoX1F.js";import{SearchBar as v}from"./SearchBar-CbnyiU72.js";import{S as T}from"./SearchResult-CwZEVVi6.js";import"./preload-helper-PPVm8Dsz.js";import"./index-IzCJOiwo.js";import"./Plugin-CYVtm61E.js";import"./componentData-B-Xp-WjF.js";import"./useAnalytics-wpQnmzLK.js";import"./useApp-LC36H6z3.js";import"./useRouteRef-D_K4aVES.js";import"./index-mbELQmCK.js";import"./ArrowForward-Ak_-qeRR.js";import"./translation-Bjtv8MBr.js";import"./Page-CR8-gVCX.js";import"./useMediaQuery-rzHzD8B0.js";import"./Divider-DuenxdSn.js";import"./ArrowBackIos-DO_2ABlS.js";import"./ArrowForwardIos-_CsHFU2a.js";import"./translation-Tx1pKHh_.js";import"./lodash-Czox7iJy.js";import"./useAsync-CNZKjAjJ.js";import"./useMountedState-2cXymIoR.js";import"./Modal-D6jcPeuR.js";import"./Portal-y4yvUJUe.js";import"./Backdrop-DpZkZfXy.js";import"./styled-DYzq_tB8.js";import"./ExpandMore-DJZlK5Sd.js";import"./AccordionDetails-CCv3FdOB.js";import"./index-B9sM2jn7.js";import"./Collapse-BITvwjhQ.js";import"./ListItem-DLX99J84.js";import"./ListContext-CWoF9LZC.js";import"./ListItemIcon--c4uLQGt.js";import"./ListItemText-CvzrIeis.js";import"./Tabs-BdkiGxQF.js";import"./KeyboardArrowRight-D3PagGjM.js";import"./FormLabel-XSOpFhvr.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-B5QZVaVY.js";import"./InputLabel-C9B99LW5.js";import"./Select-ZDSVzv3O.js";import"./Popover-Cjl51Zxu.js";import"./MenuItem-lcLkX3GF.js";import"./Checkbox-C5aOkirn.js";import"./SwitchBase-5eN4A7Ua.js";import"./Chip-n-CLizaH.js";import"./Link-DWEj90Ez.js";import"./useObservable-Iu2rwe2U.js";import"./useIsomorphicLayoutEffect-D0goBYeo.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-W5PN1BRM.js";import"./useDebounce-BSw2Cgki.js";import"./InputAdornment-C0pjiKmc.js";import"./TextField-BJUIp_EF.js";import"./useElementFilter-Bfb3gdrY.js";import"./EmptyState-BlYhheWx.js";import"./Progress-Bmw2jChS.js";import"./LinearProgress-gtsyAZfs.js";import"./ResponseErrorPanel-BxgAeJKB.js";import"./ErrorPanel-3Zd2cLU-.js";import"./WarningPanel-DIYvPX_4.js";import"./MarkdownContent-Brn2l3Aj.js";import"./CodeSnippet-DkEMDFHo.js";import"./CopyTextButton-DFxCHX8I.js";import"./useCopyToClipboard-BZhXOA9g.js";import"./Tooltip-DYDrJaUH.js";import"./Popper-BaB5wJeP.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...r.parameters?.docs?.source}}};const io=["Default","CustomModal"];export{r as CustomModal,e as Default,io as __namedExportsOrder,so as default};
