git clone git@github.com:brave-experiments/pagegraph-rust.git
cd pagegraph-rust
cargo build --bin pagegraph-cli --release --target-dir ./
cp release/pagegraph-cli ../
cd ..