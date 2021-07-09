gem_group :development, :test do
  gem "rspec"
  gem "rspec-rails"
end

rakefile("example.rake") do
  <<-TASK
    namespace :example do
      task :backstage do
        puts "i like backstage!"
      end
    end
  TASK
end
