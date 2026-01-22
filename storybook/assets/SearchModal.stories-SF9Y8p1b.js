import{j as t,m as u,I as p,b as g,T as h}from"./iframe-QksS9oll.js";import{r as x}from"./plugin-DaBVnQ4M.js";import{S as l,u as c,a as S}from"./useSearchModal-CDdUQYIX.js";import{B as m}from"./Button-Dfimf7ZU.js";import{a as M,b as C,c as f}from"./DialogTitle-CMD6ovcq.js";import{B as j}from"./Box-4mwxRbT8.js";import{S as n}from"./Grid-D7XFfWKi.js";import{S as y}from"./SearchType-D2j4e2cx.js";import{L as I}from"./List-BifWF3Ny.js";import{H as B}from"./DefaultResultListItem-BwDWjBDQ.js";import{s as D,M as G}from"./api-CD1TnuNJ.js";import{S as R}from"./SearchContext-C-7jjasf.js";import{w as T}from"./appWrappers-Cbugcrv7.js";import{SearchBar as k}from"./SearchBar-CuTnlUqR.js";import{a as v}from"./SearchResult-5Ab8JyVN.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BRpTdJ9c.js";import"./Plugin-TdwU8h6j.js";import"./componentData-CRWc3Ue1.js";import"./useAnalytics-D3S6fnIb.js";import"./useApp-CB9Zi9mM.js";import"./useRouteRef-CZboVwVy.js";import"./index-esiVI4gD.js";import"./ArrowForward-DFKd6RHK.js";import"./translation-BXUhmTEB.js";import"./Page-BQfwY7Rq.js";import"./useMediaQuery-CkJ47XHw.js";import"./Divider-C2MLF46q.js";import"./ArrowBackIos-Ws5v751W.js";import"./ArrowForwardIos-CVPIqa8c.js";import"./translation-DNPg9YLF.js";import"./Modal-BVik2DkJ.js";import"./Portal-DNcXKhCz.js";import"./Backdrop-D-shBcLD.js";import"./styled-Dz3wLS-L.js";import"./ExpandMore-BvW0rUjO.js";import"./useAsync-DdMXChPX.js";import"./useMountedState-DqrcsGZ8.js";import"./AccordionDetails-DsDHdK5k.js";import"./index-B9sM2jn7.js";import"./Collapse-BhNoWWNo.js";import"./ListItem-CjzOJyc8.js";import"./ListContext-BPnrPY1o.js";import"./ListItemIcon-G0c4vyGi.js";import"./ListItemText-DdfK1hjm.js";import"./Tabs-DjsOc8bc.js";import"./KeyboardArrowRight-DkddoEOP.js";import"./FormLabel--J-vZWgN.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C1ai1oD2.js";import"./InputLabel-C3VXmI13.js";import"./Select-BckGqAPz.js";import"./Popover-D8Mf3ffv.js";import"./MenuItem-DLZ-n9sp.js";import"./Checkbox-eynxIJ-5.js";import"./SwitchBase-Bd0rpPKc.js";import"./Chip-19uECp7S.js";import"./Link-vv3H9C9T.js";import"./lodash-Czox7iJy.js";import"./useObservable-BEkg0zh2.js";import"./useIsomorphicLayoutEffect-DsxO7SBP.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-fQ9pzXbO.js";import"./useDebounce-Cdm6Ybwv.js";import"./InputAdornment-DFk8gPo1.js";import"./TextField-DySARS00.js";import"./useElementFilter-BFKO0v6C.js";import"./EmptyState-2TdUEjaq.js";import"./Progress-DjNQqjl8.js";import"./LinearProgress-2WUaicIm.js";import"./ResponseErrorPanel-MHGINPYk.js";import"./ErrorPanel-_1DH6jIy.js";import"./WarningPanel-D9lI_etd.js";import"./MarkdownContent-D_MwY5Q0.js";import"./CodeSnippet-NS8GLkfk.js";import"./CopyTextButton-CkYKd75j.js";import"./useCopyToClipboard-B1WVdUm6.js";import"./Tooltip-DBYgA5-n.js";import"./Popper-BcJim0Sm.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
